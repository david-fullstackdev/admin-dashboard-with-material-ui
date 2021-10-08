import React, { useEffect } from "react";
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
import InputMask from "react-input-mask";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
// import { Auth } from 'aws-amplify';
import Header from "components/Headers/Header.js";
import componentStyles from "assets/theme/views/admin/orderflow.js";
import 'leaflet/dist/leaflet.css';

import states from "assets/jsons/states.json";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { getDelivery } from "services/delivery";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const useStyles = makeStyles(componentStyles);

function DeliveryDetails() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = React.useState(null);
  const [pickupLocation, setPickupLocation] = React.useState(null);
  const [deliveryLocation, setDeliveryLocation] = React.useState(null);
  const [orderPrice, setOrderPrice] = React.useState(null);
  const [orderStatus, setOrderStatus] = React.useState(0);
  
  useEffect(async () => {
    getDeliveryDetails();
  }, [])

  const getDeliveryDetails = async () => {
    try {
      let delivery = await getDelivery(id);
      setPickupLocation(delivery.pickup_location);
      setDeliveryLocation(delivery.delivery_location);
      setOrderPrice(delivery.price_info);
      setOrderInfo(delivery.order_info);
      setOrderStatus(delivery.order_status);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header />

      {orderInfo && 
      <ValidatorForm
        onSubmit={() => navi.push('/user/deliveries')}
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
              <Grid container component={Box} justifyContent="center">
                <Grid
                  item
                  xs={12}
                  xl={7}
                  component={Box}
                  marginBottom="3rem"
                  classes={{ root: classes.gridItemRoot + " " + classes.order2 }}
                >

                </Grid>
              </Grid>
              
              <Grid container>
                <Grid
                  item
                  xs={12}
                  xl={6}
                  component={Box}
                  marginBottom="3rem"
                  classes={{ root: classes.gridItemRoot + " " + classes.order2 }}
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
                          value={ orderInfo.pickup_address?orderInfo.pickup_address:"" }
                          className={classes.orderFormField}
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
                          value={ orderInfo.pickup_city?orderInfo.pickup_city:"" }
                          className={classes.orderFormField}
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
                          value={ orderInfo.pickup_state?orderInfo.pickup_state:"" }
                          className={classes.orderFormField}
                        >

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
                          value={ orderInfo.pickup_zip?orderInfo.pickup_zip:"" }
                          className={classes.orderFormField}
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
                      <Grid item xs={12} lg={4}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Client Name"
                          name="delivery_username"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ orderInfo.delivery_username?orderInfo.delivery_username:"" }
                          className={classes.orderFormField}                        
                        />
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Email"
                          name="delivery_email"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ orderInfo.delivery_email?orderInfo.delivery_email:"" }
                          className={classes.orderFormField}                        
                        />
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <InputMask
                          mask="(999) 999-9999"            
                          disabled={false}
                          value={ orderInfo.delivery_mobile?orderInfo.delivery_mobile:"" }
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
                          value={ orderInfo.delivery_address?orderInfo.delivery_address:"" }
                          className={classes.orderFormField}
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
                          value={ orderInfo.delivery_address2?orderInfo.delivery_address2:"" }
                          className={classes.orderFormField}
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
                          value={ orderInfo.delivery_city?orderInfo.delivery_city:"" }
                          className={classes.orderFormField}
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
                          value={ orderInfo.delivery_state?orderInfo.delivery_state:"" }
                          className={classes.orderFormField}
                        >

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
                          value={ orderInfo.delivery_zip?orderInfo.delivery_zip:"" }
                          className={classes.orderFormField}
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div className={classes.orderDetails}>
                    <div>
                      <div>Order Details</div>
                      <div>Price: ${orderPrice.price}</div>
                      <div>Delivery Time: {orderPrice.deliver_time}</div>
                      <div>Status:&nbsp;
                        { orderStatus === 0 && "Pending" }
                        { orderStatus === 3 && "Cancelled" }
                        { orderStatus === 4 && "Deleted" }
                      </div>
                    </div>
                  </div>

                  <Box display="flex" marginTop="1rem" marginBottom="1rem" justifyContent="center">
                    <Button type="submit" color="primary" variant="outlined" disabled={!pickupLocation || !deliveryLocation}>
                      Go Back
                    </Button>
                  </Box>
                  
                </Grid>
                <Grid
                  item
                  xs={12}
                  xl={6}
                  component={Box}
                  marginBottom="3rem!important"
                  classes={{ root: classes.order1 + " " + classes.marginBottomXl0 }}
                >
                  <div className={classes.mapContainer_details}>
                    <MapContainer
                      bounds={[[pickupLocation.lat, pickupLocation.lng], [deliveryLocation.lat, deliveryLocation.lng]]}
                      boundsOptions={{padding: [50, 50]}} 
                      zoom={13} 
                      scrollWheelZoom={true}
                    >
                      <TileLayer                  
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
            </CardContent>
          </Card>
        </Container>
      </ValidatorForm>
      }
    </>
  );
}

export default DeliveryDetails;
