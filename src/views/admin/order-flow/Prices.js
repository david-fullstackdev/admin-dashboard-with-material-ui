import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import OrderStepper from "views/admin/order-flow/OrderStepper";
import Header from "components/Headers/Header.js";
import componentStyles from "assets/theme/views/admin/orderflow.js";
import { getPrices } from "services/orderflow";
import { setOrderPrice } from "store/actions";

const useStyles = makeStyles(componentStyles);

function Prices() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();
  const dispatch = useDispatch();
  const orderInfo = useSelector(state => state.orderInfo);
  const pickupLocation = useSelector(state => state.order_pickupLocation);
  const deliveryLocation = useSelector(state => state.order_deliveryLocation);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPriceList();
  }, [])

  const getPriceList = () => {
    if (!orderInfo || !pickupLocation || !deliveryLocation) {
      navi.push('/user/order/new');
      return;
    }

    setLoading(true);
    getPrices(orderInfo.pickup_state, pickupLocation, deliveryLocation)
    .then(_prices => {
      setLoading(false);
      _prices.sort(function(a, b) {
        return b.ratio - a.ratio
      });
      setPrices(_prices);
    })
    .catch(error => {
      setLoading(false);
      
      if (error.response.status === 404) {
        setError(error.response.data.message);
      }
    });
  }

  const selectPrice = (price) => {
    dispatch(setOrderPrice(price));
    navi.push('/user/order/details');
  }

  return (
    <>
      <Header />
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

                <OrderStepper />

                { loading && <Grid container component={Box} justifyContent="center"><CircularProgress /></Grid> }
                { error && 
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {error}<a href="/user/order/new"><strong>Go back</strong></a>
                </Alert>}

                {
                  prices.map((price, key) => 
                    <Card classes={{ root: classes.cardRoot + " " + classes.mb2 }} key={key}>
                      <CardContent>
                        <div className={classes.plLg4}>
                          <Grid container alignItems="center">
                            <Grid component={Box} item xs={6} lg={4} display="flex" flexDirection="column" justifyContent="center">
                              <FormLabel className={classes.planName}> { price.title } </FormLabel>
                              <FormLabel>{ price.deliver_time }</FormLabel>
                            </Grid>
                            <Grid item component={Box} xs={6} lg={3} display="flex">
                              <FormLabel className={classes.planDriver}>3 drivers available</FormLabel>
                            </Grid>
                            <Grid item component={Box} display="flex" xs={6} lg={2} justifyContent="center">
                              <FormLabel className={classes.planPrice}>${price.price}</FormLabel>
                            </Grid>
                            <Grid item component={Box} display="flex" xs={6} lg={3} justifyContent="center">
                              <Button color="primary" variant="outlined" onClick={() => selectPrice(price)}>
                                SELECT
                              </Button>
                            </Grid>
                          </Grid>
                        </div>
                      </CardContent>
                    </Card>
                  )
                }

              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Prices;