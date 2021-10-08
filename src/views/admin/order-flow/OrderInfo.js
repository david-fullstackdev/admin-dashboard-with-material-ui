import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';

// import TextField from '@material-ui/core/TextField';
import InputMask from "react-input-mask";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import Header from "components/Headers/Header.js";
import componentStyles from "assets/theme/views/admin/orderflow.js";

import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import states from "assets/jsons/states.json";
import { getLatLngFromAddress } from "services/orderflow";
import { searchClientsByName, getClient } from "services/client";
import { setOrderInfo, setOrderPickupLocation, setOrderDeliveryLocation, setOrderPrice } from "store/actions";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { setupRouter, setWaypoints } from "utils/geoutils";

let pickupIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 38]
});

let deliveryIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 38]
});

const useStyles = makeStyles(componentStyles);

let streetMap = null;
let timeout = null;
var router = undefined;

// These need to be set from environment variables:
// process.env.NAV_ROUTESERVER & process.env.NAV_TILESERVER
const NAV_TILESERVER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const NAV_ROUTESERVER = 'http://demo.seraffinity.com:5000/route/v1';

function OrderInfo() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();

  const _orderInfo = useSelector(state => state.orderInfo);
  const _pickupLocation = useSelector(state => state.order_pickupLocation);
  const _deliveryLocation = useSelector(state => state.order_deliveryLocation);

  const [values, setValues] = useState(_orderInfo?_orderInfo:{});
  const [pickupLocation, setPickupLocation] = useState(_pickupLocation);
  const [deliveryLocation, setDeliveryLocation] = useState(_deliveryLocation);

  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clients, setClients] = useState([]);
  const [isPrevClient, setIsPrevClient] = useState(false);
  
  let geolocTimeoutForPickup = null, geolocTimeoutForDelivery = null;

  useEffect(() => {
    if (id) {
      getClientInfo();
    }
  }, [])

  const getClientInfo = async () => {
    try {
      setLoading(true);

      let client = await getClient(id);
      setLoading(false);

      setValues({
        ...values,
        delivery_username: client.contact_name,
        delivery_email: client.contact_email,
        delivery_mobile: client.contact_number,
        delivery_address: client.mailing_address,
        delivery_address2: client.mailing_address2,
        delivery_city: client.mailing_city,
        delivery_state: client.mailing_state,
        delivery_zip: client.mailing_zip,
        is_create_client: false,
        client_id: client.id
      });
  
      setIsPrevClient(true);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleChange = (event) => {
    if (event.target.name.indexOf("delivery_") !== -1 && isPrevClient) {
      return;
    }

    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const inputChange = (event, value, reason) => {
    if (reason === 'reset') return;
    if (reason === 'clear') {
      setIsPrevClient(false);
      setValues({
        ...values,
        client_id: null
      })
    }

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    
    if (value.length >= 3) {
      timeout = setTimeout(() => searchClientByName(value), 500);
    } else {
      setClients([])
    }

    setValues({
      ...values,
      delivery_username: value
    });
  }

  const changedClient = (event, value, reason) => {

    if (value && value.client) {

      setValues({
        ...values,
        delivery_username: value.client.contact_name,
        delivery_email: value.client.contact_email,
        delivery_mobile: value.client.contact_number,
        delivery_address: value.client.mailing_address,
        delivery_address2: value.client.mailing_address2,
        delivery_city: value.client.mailing_city,
        delivery_state: value.client.mailing_state,
        delivery_zip: value.client.mailing_zip,
        is_create_client: false,
        client_id: value.client.id
      });
  
      setIsPrevClient(true);
    }
  }

  const searchClientByName = (name) => {
    setLoadingClients(true);

    searchClientsByName(name)
    .then(result => {
      result = result.map(result => {
        return {
          title: result.contact_name,
          client: result
        }
      })
      setClients(result);
      setLoadingClients(false);
    })
    .catch(error => {
      console.log(error)
      setLoadingClients(false);
    })
  }

  const changeCreateClient = (event) => {
    setValues({
      ...values,
      is_create_client: event.target.checked
    })
  }

  useEffect(() => {
    if (values.pickup_address &&  values.pickup_city && values.pickup_state && values.pickup_zip) {
      if (geolocTimeoutForPickup) {
        clearTimeout(geolocTimeoutForPickup);
        geolocTimeoutForPickup = null;
      }

      geolocTimeoutForPickup = setTimeout(geoLocationForPickup, 300);
    }
  }, [values.pickup_address, values.pickup_city, values.pickup_state, values.pickup_zip])

  useEffect(() => {
    if (values.delivery_address &&  values.delivery_city && values.delivery_state && values.delivery_zip) {

      if (geolocTimeoutForDelivery) {
        clearTimeout(geolocTimeoutForDelivery);
        geolocTimeoutForDelivery = null;
      }

      geolocTimeoutForDelivery = setTimeout(geoLocationForDelivery, 300);
    }
  }, [values.delivery_address, values.delivery_city, values.delivery_state, values.delivery_zip])

  useEffect(() => {
    let points = [];
    if (pickupLocation) {
      points.push([pickupLocation.lat, pickupLocation.lng]);
    }

    if (deliveryLocation) {
      points.push([deliveryLocation.lat, deliveryLocation.lng]);
    }

    if (streetMap && points.length === 2) {
      streetMap.fitBounds(points);

      // Add start and end points to router for diplaying on the ap
      setWaypoints(router, points);

    } else if (streetMap && points.length < 2) {
      if (pickupLocation) {
        streetMap.setView([pickupLocation.lat, pickupLocation.lng], 13);
        
      } else if (deliveryLocation) {
        streetMap.setView([deliveryLocation.lat, deliveryLocation.lng], 13);
      }
    }

  }, [pickupLocation, deliveryLocation])

  const geoLocationForPickup = () => {
    setPickupLocation(null);
    getLatLngFromAddress(values.pickup_address, values.pickup_city, values.pickup_state, values.pickup_zip)
    .then(data => {
      if (data[0] && data[0].position) {
        setPickupLocation({ 
          lat: data[0].position.latitude, 
          lng: data[0].position.longitude
        });
      }
      
    })
    .catch(err => {
      console.log(err);
    });

    if (geolocTimeoutForPickup) {
      clearTimeout(geolocTimeoutForPickup);
      geolocTimeoutForPickup = null;
    }
  }

  const geoLocationForDelivery = () => {
    setDeliveryLocation(null);
    getLatLngFromAddress(values.delivery_address, values.delivery_city, values.delivery_state, values.delivery_zip)
    .then(data => {
      if (data[0] && data[0].position) {
        setDeliveryLocation({ 
          lat: data[0].position.latitude, 
          lng: data[0].position.longitude
        });
      }
    })
    .catch(err => {
      console.log(err);
    });

    if (geolocTimeoutForDelivery) {
      clearTimeout(geolocTimeoutForDelivery);
      geolocTimeoutForDelivery = null;
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(setOrderPickupLocation(pickupLocation));
    dispatch(setOrderDeliveryLocation(deliveryLocation));
    dispatch(setOrderInfo(values));
    dispatch(setOrderPrice(null));

    navi.push('/user/order/prices');
  }

  const mapInitialized = (map) => {
    streetMap = map;
    router = setupRouter(map, NAV_ROUTESERVER);
  }

  return (
    <>
      <Header />
      <ValidatorForm
        onSubmit={handleSubmit}
      >
        <Container
          maxWidth={false}
          component={Box}
          marginTop="-7rem"
          marginBottom="2rem"
          classes={{ root: classes.containerRoot }}
        >

          <Card
            classes={{
              root: classes.cardRoot + " " + classes.cardRootSecondary,
            }}
          >
            <CardContent>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  xl={6}
                  component={Box}
                  marginBottom="3rem"
                  className={classes.gridItemRoot}
                >
                  <Box
                    component={Typography}
                    variant="h6"
                    color={theme.palette.gray[600] + "!important"}
                    paddingTop=".25rem"
                    paddingBottom=".25rem"
                    fontSize=".75rem!important"
                    letterSpacing=".04em"
                    marginBottom="1.5rem!important"
                    classes={{ root: classes.typographyRootH6 }}
                  >
                    Pick-Up Address
                  </Box>
                  <div className={classes.plLg4}>
                    <Grid container>
                      <Grid item xs={12}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Address"
                          name="pickup_address"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.pickup_address?values.pickup_address:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12} lg={4}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="City"
                          name="pickup_city"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.pickup_city?values.pickup_city:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <SelectValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="State"
                          name="pickup_state"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.pickup_state?values.pickup_state:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange }>

                          {states.map((state, key) => <MenuItem value={state.code} key={key}>{ state.state }</MenuItem>)}

                        </SelectValidator> 
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Postal Code"
                          name="pickup_zip"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.pickup_zip?values.pickup_zip:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                    </Grid>
                  </div>
                  <Box
                    component={Divider}
                    marginBottom="1.5rem!important"
                    marginTop="1.5rem!important"
                  />
                  <Box
                    component={Typography}
                    variant="h6"
                    color={theme.palette.gray[600] + "!important"}
                    paddingTop=".25rem"
                    paddingBottom=".25rem"
                    fontSize=".75rem!important"
                    letterSpacing=".04em"
                    marginBottom="1.5rem!important"
                    classes={{ root: classes.typographyRootH6 }}
                  >
                    Delivery Address
                  </Box>

                  { loading?
                  <Box display="flex" marginTop="1rem" marginBottom="1rem" justifyContent="center">
                    <CircularProgress color="inherit" size={20} />
                  </Box>
                  :
                  <div className={classes.plLg4}>
                    <Grid container>

                      <Grid item xs={12} lg={4}>
                        <Autocomplete
                          freeSolo
                          options={clients}
                          getOptionLabel={(option) => option.title}
                          className={classes.autocomplete}
                          onInputChange={inputChange}
                          onChange={changedClient}
                          value={{title: values.delivery_username?values.delivery_username:""}}
                          renderInput={(params) => 
                            <TextValidator 
                              {...params}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="Client Name"
                              name="delivery_username"
                              validators={['required']}
                              errorMessages={['This field is required']}
                              value={ values.delivery_username?values.delivery_username:"" }
                              className={classes.orderFormField}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    { loadingClients?<CircularProgress color="inherit" size={20} />:null }
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                          />}
                        />
                        
                      </Grid>
                    
                      <Grid item xs={12} lg={4}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Email"
                          name="delivery_email"
                          validators={['isEmail']}
                          errorMessages={['Enter valid email.']}
                          value={ values.delivery_email?values.delivery_email:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                      <Grid item xs={12} lg={4}>

                        <InputMask
                          mask="(999) 999-9999"            
                          disabled={false}
                          value={ values.delivery_mobile?values.delivery_mobile:"" }
                          onChange={ handleChange }
                          maskChar="_"
                        >
                          {() => <TextValidator 
                                  variant="outlined"
                                  margin="normal"
                                  fullWidth
                                  label="Mobile"
                                  name="delivery_mobile"
                                  validators={['required', 'matchRegexp:^(\\([0-9]{3}\\)|[0-9]{3}-) [0-9]{3}-[0-9]{4}$']}
                                  errorMessages={['Enter valid mobile number.']}
                                  className={classes.orderFormField}
                                /> 
                          }
                        </InputMask>
                        
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Address"
                          name="delivery_address"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.delivery_address?values.delivery_address:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Address 2"
                          name="delivery_address2"
                          validators={[]}
                          errorMessages={[]}
                          value={ values.delivery_address2?values.delivery_address2:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12} lg={4}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="City"
                          name="delivery_city"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.delivery_city?values.delivery_city:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <SelectValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="State"
                          name="delivery_state"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.delivery_state?values.delivery_state:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange }>

                          {states.map((state, key) => <MenuItem value={state.code} key={key}>{ state.state }</MenuItem>)}

                        </SelectValidator>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Postal Code"
                          name="delivery_zip"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.delivery_zip?values.delivery_zip:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                    </Grid>
                  </div>
                  }

                  { !isPrevClient && !loading && !values.client_id &&
                  <Box display="flex" marginTop="1rem" marginBottom="1rem" justifyContent="flex-end">
                    <FormControlLabel
                      control={<Checkbox color="primary" name="checkedA" onChange={changeCreateClient} />}
                      label="Create New Client"
                    />
                  </Box>
                  }

                  <Box display="flex" marginTop="1rem" marginBottom="1rem" justifyContent="center">
                    <Button type="submit" color="primary" variant="outlined" disabled={!pickupLocation || !deliveryLocation}>
                      Get Prices
                    </Button>
                  </Box>
                  
                </Grid>
                <Grid
                  item
                  xs={12}
                  xl={6}
                  component={Box}
                  marginBottom="3rem!important"
                  className={classes.marginBottomXl0}
                >
                  <div className={classes.mapContainer}>
                    <MapContainer
                      boundsOptions={{padding: [50, 50]}} 
                      center={[41.850033, -87.6500523]}
                      zoom={13} 
                      scrollWheelZoom={true}
                      whenCreated={mapInitialized}
                    >
                      <TileLayer
                        // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url={NAV_TILESERVER}
                      />
                      { pickupLocation &&
                        <Marker position={[pickupLocation.lat, pickupLocation.lng]}
                        icon={pickupIcon}>
                          <Popup>
                            Pickup Address
                          </Popup>
                        </Marker>
                      }

                      { deliveryLocation &&
                        <Marker position={[deliveryLocation.lat, deliveryLocation.lng]}
                        icon={deliveryIcon}>
                          <Popup>
                            Delivery Address
                          </Popup>
                        </Marker>
                      }
                    </MapContainer>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </ValidatorForm>
    </>
  );
}

export default OrderInfo;
