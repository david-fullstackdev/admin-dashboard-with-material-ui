import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import PaymentCredit from "assets/img/svgs/payment_credit.svg";
import PaymentPaypal from "assets/img/svgs/payment_paypal.svg";
import PaymentAws from "assets/img/svgs/payment_aws.svg";
import { Alert, AlertTitle } from '@material-ui/lab';

import OrderStepper from "views/admin/order-flow/OrderStepper";
import Header from "components/Headers/Header.js";
import componentStyles from "assets/theme/views/admin/orderflow.js";

import { setOrderInfo, setOrderPickupLocation, setOrderDeliveryLocation, setOrderPrice } from "store/actions";
import { orderDelivery } from "services/orderflow";

const useStyles = makeStyles(componentStyles);

function Payment() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();  
  const dispatch = useDispatch();
  const orderInfo = useSelector(state => state.orderInfo);
  const pickupLocation = useSelector(state => state.order_pickupLocation);
  const deliveryLocation = useSelector(state => state.order_deliveryLocation);
  const orderPrice = useSelector(state => state.orderPrice);

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!orderPlaced) {
      if (!orderInfo || !pickupLocation || !deliveryLocation) {
        navi.push('/user/order/new');

      } else if (!orderPrice) {
        navi.push('/user/order/prices');
      }
    }
  }, [])

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const placeOrder = (event) => {
    event.preventDefault();

    setLoading(true);
    orderDelivery(orderInfo, pickupLocation, deliveryLocation, orderPrice)
    .then(result => {
      setLoading(false);

      setOrderPlaced(true);

      dispatch(setOrderPickupLocation(null));
      dispatch(setOrderDeliveryLocation(null));
      dispatch(setOrderInfo(null));
      dispatch(setOrderPrice(null));

      setTimeout(() => {
        navi.push('/user/order/deliveries');
      }, 2000);
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    });
  }

  return (
    <>
      <Header />
      <ValidatorForm
        onSubmit={placeOrder}
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
              <Grid container component={Box} justifyContent="center" alignItems="center">
                
                <Grid
                  item
                  xs={12}
                  xl={10}
                  component={Box}
                  marginBottom="3rem"
                  classes={{ root: classes.gridItemRoot + " " + classes.order2 }}
                >
                  <OrderStepper />

                  <Box display="flex" flexDirection="column" alignItems="center">
                    <div><FormLabel className={classes.paymentTitle}>Payment</FormLabel></div>
                    <div className={classes.mb2}><FormLabel>Choose payment method below</FormLabel></div>
                  </Box>

                  <Grid container>
                    <Grid item xs={12} lg={4}>
                      <Card classes={{ root: classes.cardRoot + " " + classes.paymentCard + " " + classes.cardRootSecondary + " " + classes.mb2 }}>
                        <CardContent component={Box} display="flex" alignItems="center" justifyContent="center">
                          <img height="50%" src={PaymentCredit} alt="" />
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <Card classes={{ root: classes.cardRoot + " " + classes.paymentCard + " " + classes.cardRootSecondary + " " + classes.mb2 }}>
                        <CardContent component={Box} display="flex" alignItems="center" justifyContent="center">
                          <img height="50%" src={PaymentPaypal} alt="" />
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <Card classes={{ root: classes.cardRoot + " " + classes.paymentCard + " " + classes.cardRootSecondary + " " + classes.mb2 }}>
                        <CardContent component={Box} display="flex" alignItems="center" justifyContent="center">
                          <img height="50%" src={PaymentAws} alt="" />
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  
                  { orderPlaced && 
                  <div className={classes.mb2}>
                    <Alert severity="success">
                      <AlertTitle>Success</AlertTitle>
                      Order was placed successfully. You will redirect to order status page automatically.
                    </Alert>
                  </div>
                  }
                
                  <div className={classes.plLg4}>
                    <Grid container>
                      <Grid item xs={12} lg={5}>
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
                          Billing Info
                        </Box>
                        <Grid container>
                          <Grid item xs={12} lg={12}>
                            <TextValidator 
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="Full Name"
                              name="username"
                              validators={['required']}
                              errorMessages={['This field is required']}
                              value={ values.username?values.username:"" }
                              className={classes.orderFormField}            
                              onChange={ handleChange} 
                            />
                          </Grid>
                          <Grid item xs={12} lg={12}>
                            <TextValidator 
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="Address"
                              name="address"
                              validators={['required']}
                              errorMessages={['This field is required']}
                              value={ values.address?values.address:"" }
                              className={classes.orderFormField}            
                              onChange={ handleChange} 
                            />
                          </Grid>
                          <Grid item xs={12} lg={6}>
                            <TextValidator 
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="City"
                              name="city"
                              validators={['required']}
                              errorMessages={['This field is required']}
                              value={ values.city?values.city:"" }
                              className={classes.orderFormField}            
                              onChange={ handleChange} 
                            />
                          </Grid>
                          <Grid item xs={12} lg={6}>
                            <TextValidator 
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="ZIP Code"
                              name="zip_code"
                              validators={['required']}
                              errorMessages={['This field is required']}
                              value={ values.zip_code?values.zip_code:"" }
                              className={classes.orderFormField}            
                              onChange={ handleChange} 
                            />
                          </Grid>
                          <Grid item xs={12} lg={12}>
                            <TextValidator 
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="Country"
                              name="country"
                              validators={['required']}
                              errorMessages={['This field is required']}
                              value={ values.country?values.country:"" }
                              className={classes.orderFormField}            
                              onChange={ handleChange} 
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid component={Box} item xs={12} lg={2} display="flex" justifyContent="center">
                        <Divider orientation="vertical" />
                      </Grid>

                      <Grid item xs={12} lg={5}>
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
                          Credit Card Info
                        </Box>
                        <Grid container>
                          <Grid item xs={12} lg={12}>
                            <TextValidator 
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="Card Number"
                              name="card_number"
                              validators={['required']}
                              errorMessages={['This field is required']}
                              value={ values.card_number?values.card_number:"" }
                              className={classes.orderFormField}            
                              onChange={ handleChange} 
                            />
                          </Grid>
                          <Grid item xs={12} lg={12}>
                            <TextValidator 
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="CardHolder Name"
                              name="cardholder_name"
                              validators={['required']}
                              errorMessages={['This field is required']}
                              value={ values.cardholder_name?values.cardholder_name:"" }
                              className={classes.orderFormField}            
                              onChange={ handleChange} 
                            />
                          </Grid>
                          <Grid item xs={12} lg={12}>
                            <TextValidator 
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="Expiration Date"
                              name="expiration_date"
                              validators={['required']}
                              errorMessages={['This field is required']}
                              value={ values.expiration_date?values.expiration_date:"" }
                              className={classes.orderFormField}            
                              onChange={ handleChange} 
                            />
                          </Grid>
                          <Grid item xs={12} lg={6}>
                            <TextValidator 
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="CVV"
                              name="cvv"
                              validators={['required']}
                              errorMessages={['This field is required']}
                              value={ values.cvv?values.cvv:"" }
                              className={classes.orderFormField}            
                              onChange={ handleChange} 
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>

                  <Box display="flex" marginTop="1rem" marginBottom="1rem" justifyContent="center">
                    { !loading && !orderPlaced && 
                    <Button type="submit" color="primary" variant="outlined">
                      Place an Order
                    </Button>
                    }
                    { loading && <CircularProgress /> }
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </ValidatorForm>
    </>
  );
}

export default Payment;
