import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
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
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import componentStyles from "assets/theme/views/order-flow/orderflow.js";
import 'leaflet/dist/leaflet.css';
import states from "assets/jsons/states.json";

import { getLatLngFromAddress } from "services/orderflow";
import { setOrderInfo, setOrderPickupLocation, setOrderDeliveryLocation, setOrderPrice } from "store/actions";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const useStyles = makeStyles(componentStyles);

let streetMap = null;
var router = undefined;

function setupRouter(map, url) {
  // L.Routing.Itinerary.hide();
  var options = { serviceUrl: 'http://demo.seraffinity.com:5000/route/v1' }; 
  var osrmRouter = new L.Routing.OSRMv1(options);

  var routerIn = L.Routing.control({
      router: osrmRouter,
      //createMarker: function() { return null; },  // this disables the marker display
      lineOptions: {
          styles: [
              { color: '#004499', opacity: 0.8, weight: 5 },
              { color: '#0044bb', opacity: 1, weight: 2 }
          ],
          addWaypoints: false
      },
      formatter: new L.Routing.Formatter({ units: 'imperial' }),
      routeWhileDragging: false,
      show: false
  }).addTo(map);

  // This is a hack because the "show" property does not work 
  routerIn._container.style.display = "None";
  return routerIn;
}

function OrderInfo() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();
  const dispatch = useDispatch();

  const _orderInfo = useSelector(state => state.orderInfo);
  const _pickupLocation = useSelector(state => state.order_pickupLocation);
  const _deliveryLocation = useSelector(state => state.order_deliveryLocation);

  const [values, setValues] = useState(_orderInfo?_orderInfo:{});
  const [pickupLocation, setPickupLocation] = useState(_pickupLocation);
  const [deliveryLocation, setDeliveryLocation] = useState(_deliveryLocation);
  
  let geolocTimeoutForPickup = null, geolocTimeoutForDelivery = null;

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

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
    let bounds = [];
    if (pickupLocation) {
      bounds.push([pickupLocation.lat, pickupLocation.lng]);
    }

    if (deliveryLocation) {
      bounds.push([deliveryLocation.lat, deliveryLocation.lng]);
    }

    if (streetMap && bounds.length === 2) {
      streetMap.fitBounds(bounds);
      console.log('routing...');
      let waypoints = [];
      waypoints.push(L.Routing.waypoint(L.latLng(pickupLocation.lat, pickupLocation.lng)));
      waypoints.push(L.Routing.waypoint(L.latLng(deliveryLocation.lat, deliveryLocation.lng)));
      router.setWaypoints(waypoints);
      console.log('waypoints' + waypoints);

    } else if (streetMap && bounds.length < 2) {
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

    navi.push('/order/prices');
  }

  const mapInitialized = (map) => {
    streetMap = map;
    console.log(streetMap);
    var showItinerary = false;
    var url = 'http://demo.seraffinity.com:5000';
    router = setupRouter(map, url, showItinerary);
  }

  return (
    <ValidatorForm
      onSubmit={handleSubmit}
    >
      <Container
        maxWidth={false}
        component={Box}
        marginTop="2rem"
        marginBottom="2rem"
        classes={{ root: classes.containerRoot }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            xl={6}
            component={Box}
            marginBottom="3rem"
            classes={{ root: classes.gridItemRoot + " " + classes.order1 }}
          >
            <Card
              classes={{
                root: classes.cardRoot + " " + classes.cardRootSecondary,
              }}
            >
              <CardContent>
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
                <div className={classes.plLg4}>
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

                <Box display="flex" marginTop="1rem" marginBottom="1rem" justifyContent="center">
                  <Button type="submit" color="primary" variant="outlined" disabled={!pickupLocation || !deliveryLocation}>
                    Get Prices
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            xl={6}
            component={Box}
            marginBottom="3rem!important"
            classes={{ root: classes.order2 + " " + classes.marginBottomXl0 }}
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
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                { pickupLocation &&
                  <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
                    <Popup>
                      Pickup Address
                    </Popup>
                  </Marker>
                }

                { deliveryLocation &&
                  <Marker position={[deliveryLocation.lat, deliveryLocation.lng]}>
                    <Popup>
                      Delivery Address
                    </Popup>
                  </Marker>
                }
              </MapContainer>
            </div>
          </Grid>
        </Grid>
      </Container>
    </ValidatorForm>
  );
}

export default OrderInfo;
