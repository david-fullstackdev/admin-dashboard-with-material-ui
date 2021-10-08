import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
// import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { Auth } from 'aws-amplify';
import componentStyles from "assets/theme/views/order-flow/orderflow.js";
import 'leaflet/dist/leaflet.css';

import OrderStepper from "views/order-flow/OrderStepper";
import states from "assets/jsons/states.json";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const useStyles = makeStyles(componentStyles);

function OrderDetails() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();  
  const orderInfo = useSelector(state => state.orderInfo);
  const pickupLocation = useSelector(state => state.order_pickupLocation);
  const deliveryLocation = useSelector(state => state.order_deliveryLocation);
  const orderPrice = useSelector(state => state.orderPrice);

  useEffect(() => {
    if (!orderInfo || !pickupLocation || !deliveryLocation) {
      navi.push('/order/info');

    } else if (!orderPrice) {
      navi.push('/order/prices');
    }
  }, [])

  const goPurchase = async () => {
    try {
      let user = await Auth.currentAuthenticatedUser({ bypassCache: false })      
      if (user) {
        window.location = "/user/order/new";
      } else {
        window.location = "/auth/index";
      }

    } catch (e) {
      window.location = "/auth/index";
    }
  }

  return (
    <ValidatorForm
      onSubmit={goPurchase}
    >
      <Container
        maxWidth={false}
        component={Box}
        marginTop="2rem"
        marginBottom="2rem"
        classes={{ root: classes.containerRoot }}
      >
        <Grid container component={Box} justifyContent="center">
          <Grid
            item
            xs={12}
            xl={7}
            component={Box}
            marginBottom="3rem"
            classes={{ root: classes.gridItemRoot + " " + classes.order1 }}
          >

            <OrderStepper />
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
                  </div>
                </div>

                <Box display="flex" marginTop="1rem" marginBottom="1rem" justifyContent="center">
                  <Button type="submit" color="primary" variant="outlined" disabled={!pickupLocation || !deliveryLocation}>
                    Purchase
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
      </Container>
    </ValidatorForm>
  );
}

export default OrderDetails;
