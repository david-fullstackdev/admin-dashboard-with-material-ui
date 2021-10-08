import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
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
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Snackbar from '@material-ui/core/Snackbar'
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardActions from '@material-ui/core/CardActions';
import Pagination from '@material-ui/lab/Pagination';
import MoreVert from "@material-ui/icons/MoreVert";
import MuiAlert from '@material-ui/lab/Alert';
import Header from "components/Headers/Header.js";
import componentStyles from "assets/theme/views/admin/tables.js";
import { getClients, deleteClient } from 'services/client.js';
import { setGlobalLoading } from 'store/actions';

const useStyles = makeStyles(componentStyles);

function Alert(props) {
  const classes = useStyles();
  return <MuiAlert className={classes.alert} elevation={6} variant="filled" {...props} />;
}

const Clients = () => {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();
  const dispatch = useDispatch();
  const [clients, setClients] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState(null);
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);

  useEffect(async () => {
    getMyClients(1);
  }, []);

  const getMyClients = async (pageNo) => {
    try {
      setClients([]);
      setMessage(null);
      setLoading(true);

      const clients = await getClients(pageNo);
      setClients(clients.Items);
      setPageCount(Math.ceil(clients.totalCount / 10));

    } catch(err) {
      setMessage(err.response.data.message)
      setError(true);

    } finally {
      setLoading(false);
    }
  }

  const handleEditClient = async () => {
    handleClose();
    navi.push(`/user/clients/${selectedClient.id}`)
  }

  const handleDeleteDelivery = async () => {
    handleClose();

    if (selectedClient) {
      try {
        setMessage(null);

        dispatch(setGlobalLoading(true));
        await deleteClient(selectedClient.id)

        let index = clients.indexOf(selectedClient);
        if (index !== -1) {
          clients.splice(index, 1);
        }

      } catch(err) {
        setMessage(err.response.data.message)
        setError(true);

      } finally {
        dispatch(setGlobalLoading(false));
      }
    }
  }

  const handleClick = (event, client) => {
    setSelectedClient(client);

    setAnchorEl1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl1(null);
  };

  const createNewDelivery = () => {
    handleClose();
    navi.push(`/user/order/new/${selectedClient.id}`);
  }

  const goDeliveryHistory = () => {
    handleClose();
    navi.push(`/user/clients/${selectedClient.id}/deliveries`);
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
            subheader={
              <Grid
                container
                component={Box}
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs="auto">
                  <Box
                    component={Typography}
                    variant="h3"
                    marginBottom="0!important"
                  >
                    My Clients
                  </Box>
                </Grid>
                <Grid item xs="auto">
                  <Box
                    justifyContent="flex-end"
                    display="flex"
                    flexWrap="wrap"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      href="/user/client/new"
                    >
                      + New Client
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            }
          >
          </CardHeader>
          <TableContainer>
            <Box
              component={Table}
              alignItems="center"
              marginBottom="0!important"
            >
              <TableHead>
                <TableRow>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Contact Name</TableCell>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Contact Email</TableCell>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Contact Number</TableCell>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Company Name</TableCell>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}>Company Number</TableCell>
                  <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootHead }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { clients.map((client, key) =>
                  <TableRow key={key}>
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead}} component="th" variant="head" scope="row">
                      { client.contact_name }
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead }} component="th" variant="head" scope="row">
                      { client.contact_email }
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead }} component="th" variant="head" scope="row">
                      { client.contact_number }
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead }} component="th" variant="head" scope="row">
                      { client.company_name }
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCellRoot + " " + classes.tableCellRootBodyHead }} component="th" variant="head" scope="row">
                      { client.company_number }
                    </TableCell>
                    <TableCell
                      classes={{ root: classes.tableCellRoot }}
                      align="right"
                    >
                      <Box
                        aria-controls="simple-menu-1"
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, client)}
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
            </Box>

            <Menu
              anchorEl={anchorEl1}
              keepMounted
              open={Boolean(anchorEl1)}
              onClose={handleClose}
            >
              <MenuItem onClick={createNewDelivery}>New Delivery</MenuItem>
              <MenuItem onClick={goDeliveryHistory}>History</MenuItem>
              <MenuItem onClick={handleEditClient}>Edit</MenuItem>
              <MenuItem onClick={handleDeleteDelivery}>Delete</MenuItem>
            </Menu>
          </TableContainer>
          
          { loading && 
            <Box textAlign="center" marginTop="1.5rem" marginBottom="1.5rem">
              <CircularProgress size={30} />
            </Box>
          }

          <Box
            classes={{ root: classes.cardActionsRoot }}
            component={CardActions}
            justifyContent="flex-end"
          >
            <Pagination count={pageCount} color="primary" variant="outlined" onChange={(event, page) => getMyClients(page)} />
          </Box>
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

export default Clients;
