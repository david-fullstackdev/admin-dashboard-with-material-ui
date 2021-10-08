import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Container from "@material-ui/core/Container";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Snackbar from '@material-ui/core/Snackbar'
import CircularProgress from "@material-ui/core/CircularProgress";
import MoreVert from "@material-ui/icons/MoreVert";
import MuiAlert from '@material-ui/lab/Alert';
import moment from "moment";
import Header from "components/Headers/Header.js";
import componentStyles from "assets/theme/views/admin/tables.js";
import { getDeliveries, cancelDelivery, deleteDelivery } from 'services/delivery';
import { getClient } from "services/client";
import { setGlobalLoading } from 'store/actions';

const useStyles = makeStyles(componentStyles);

function Alert(props) {
  const classes = useStyles();
  return <MuiAlert className={classes.alert} elevation={6} variant="filled" {...props} />;
}

const Deliveries = () => {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [deliveries, setDeliveries] = React.useState([]);
  const [selectedDelivery, setSelectedDelivery] = React.useState(null);
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [client, setClient] = React.useState(null);

  useEffect(async () => {
    getMyDeliveries();
    getClientInfo();
  }, []);

  const getClientInfo = async () => {
    try {
      let client = await getClient(id);
      setClient(client);
    } catch (error) {
      console.log(error);
    }
  }

  const getMyDeliveries = async () => {
    try {
      setMessage(null);
      setLoading(true);

      const deliveries = await getDeliveries(id);
      setDeliveries(deliveries);

    } catch(err) {
      setMessage(err.response.data.message)
      setError(true);

    } finally {
      setLoading(false);
    }
  }

  const handleCancelDelivery = async () => {
    handleClose();

    if (selectedDelivery) {
      try {
        setMessage(null);

        dispatch(setGlobalLoading(true));
        await cancelDelivery(selectedDelivery.id)
        selectedDelivery.order_status = 3;
        
      } catch(err) {
        setMessage(err.response.data.message)
        setError(true);

      } finally {
        dispatch(setGlobalLoading(false));
      }
    }
  }

  const handleDeleteDelivery = async () => {
    handleClose();

    if (selectedDelivery) {
      try {
        setMessage(null);

        dispatch(setGlobalLoading(true));
        await deleteDelivery(selectedDelivery.id)

        let index = deliveries.indexOf(selectedDelivery);
        if (index !== -1) {
          deliveries.splice(index, 1);
        }

      } catch(err) {
        setMessage(err.response.data.message)
        setError(true);

      } finally {
        dispatch(setGlobalLoading(false));
      }
    }
  }

  const handleClick = (event, delivery) => {
    setSelectedDelivery(delivery);

    setAnchorEl1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl1(null);
  };

  const goDeliveryDetails = ( event, delivery ) => {
    event.preventDefault();

    navi.push(`/user/deliveries/${delivery.id}`)
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessage(null);
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container
        maxWidth={false}
        component={Box}
        marginTop="-6rem"
        classes={{ root: classes.containerRoot }}
      >
        <Card classes={{ root: classes.cardRoot }}>
          <CardHeader
            className={classes.cardHeader}
            title={id?(client?`${client.contact_name}'s Deliveries`:""):"My Deliveries"}
            titleTypographyProps={{
              component: Box,
              marginBottom: "0!important",
              variant: "h3",
            }}
          ></CardHeader>
          <TableContainer>
            <Box
              component={Table}
              alignItems="center"
              marginBottom="0!important"
            >
              <TableHead>
                <TableRow>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Pickup Address</TableCell>
                  {/* <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Delivery Address</TableCell> */}
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Delivery Name</TableCell>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Plan</TableCell>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Cost</TableCell>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Status</TableCell>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Created On</TableCell>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { deliveries.map((delivery, key) =>
                  <TableRow key={key}>
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead}} component="th" variant="head" scope="row">
                      { delivery.order_info.pickup_address }, { delivery.order_info.pickup_city }, { delivery.order_info.pickup_state }, {delivery.order_info.pickup_zip}
                    </TableCell>
                    {/* <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead }} component="th" variant="head" scope="row">
                      { delivery.order_info.delivery_address }, { delivery.order_info.delivery_city }, { delivery.order_info.delivery_state }, { delivery.order_info.delivery_zip }
                    </TableCell> */}
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead }} component="th" variant="head" scope="row">
                      { delivery.order_info.delivery_username }
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead }} component="th" variant="head" scope="row">
                      { delivery.price_info.title }
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead }} component="th" variant="head" scope="row">
                      ${ delivery.price_info.price }
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead }} component="th" variant="head" scope="row">
                      <Box paddingTop=".35rem" paddingBottom=".35rem">
                        <Box
                          marginRight="10px"
                          component="i"
                          width=".375rem"
                          height=".375rem"
                          borderRadius="50%"
                          display="inline-block"
                          className={
                            classes.verticalAlignMiddle + " " + classes.bgWarning
                          }
                        ></Box>
                        <a href="#" onClick={(event) => goDeliveryDetails(event, delivery)}>
                          { delivery.order_status === 0 && "Pending" }
                          { delivery.order_status === 3 && "Cancelled" }
                          { delivery.order_status === 4 && "Deleted" }
                        </a>
                      </Box>
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead }} component="th" variant="head" scope="row">
                      { moment(delivery.created_on).format('YYYY-MM-DD HH:mm') }
                    </TableCell>
                    <TableCell
                      classes={{ root: classes.tableCellRoot }}
                      align="right"
                    >
                      <Box
                        aria-controls="simple-menu-1"
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, delivery)}
                        size="small"
                        component={Button}
                        width="2rem!important"
                        height="2rem!important"
                        minWidth="2rem!important"
                        minHeight="2rem!important"
                      >
                        <Box
                          component={MoreVert}
                          width="1.25rem!important"
                          height="1.25rem!important"
                          position="relative"
                          top="2px"
                          color={theme.palette.gray[500]}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <Menu
                anchorEl={anchorEl1}
                keepMounted
                open={Boolean(anchorEl1)}
                onClose={handleClose}
              >
                { selectedDelivery && selectedDelivery.order_status === 0 && <MenuItem onClick={handleCancelDelivery}>Cancel</MenuItem> }
                { selectedDelivery && ( selectedDelivery.order_status === 0 || selectedDelivery.order_status === 3 ) && 
                  <MenuItem onClick={handleDeleteDelivery}>Delete</MenuItem> }
                
                
              </Menu>
            </Box>
          </TableContainer>

          <Box textAlign="center" marginTop="1.5rem" marginBottom="1.5rem">
            { loading && <CircularProgress size={30} /> }
          </Box>
          {/* <Box
            classes={{ root: classes.cardActionsRoot }}
            component={CardActions}
            justifyContent="flex-end"
          >
            <Pagination count={3} color="primary" variant="outlined" />
          </Box> */}
        </Card>

        <Snackbar 
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={message?true:false} autoHideDuration={5000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={error?"error":"success"}>
            { message }
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Deliveries;
