import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from '@material-ui/core/TextareaAutosize';
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';
import InputMask from "react-input-mask";
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import Header from "components/Headers/Header.js";
import componentStyles from "assets/theme/views/admin/client.js";
import { updateClient, getClient } from "services/client.js";
import states from "assets/jsons/states.json";

const useStyles = makeStyles(componentStyles);

function Alert(props) {
  const classes = useStyles();
  return <MuiAlert className={classes.alert} elevation={6} variant="filled" {...props} />;
}

function AddClient() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();
  const { id } = useParams();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getClientInfo();
  }, [])

  const getClientInfo = async () => {
    try {
      setLoading(true);

      let client = await getClient(id);
      setValues(client);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setUpdating(true);
    updateClient(id, values)
    .then(result => {
      setUpdating(false);

      setMessage(result.message);
      setError(false);
      
      setTimeout(() => navi.push('/user/clients'), 1500);
    })
    .catch(err => {
      console.log(err);
      setUpdating(false);
    });
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessage(null);
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
              { loading && 
              <Box display="flex" marginTop="1rem" marginBottom="1rem" justifyContent="center">
                <CircularProgress />
              </Box>
              }
              { !loading && 
              <Grid container>
                <Grid
                  item
                  xs={12}
                  xl={7}
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
                    Primary Information
                  </Box>
                  <div className={classes.plLg4}>
                    <Grid container>
                      <Grid item xs={12} lg={6}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Contact Name"
                          name="contact_name"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.contact_name?values.contact_name:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Email"
                          name="contact_email"
                          validators={['required', 'isEmail']}
                          errorMessages={['This field is required.', 'Enter valid email.']}
                          value={ values.contact_email?values.contact_email:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <InputMask
                          mask="(999) 999-9999"            
                          disabled={false}
                          value={ values.contact_number?values.contact_number:"" }
                          onChange={ handleChange }
                          maskChar="_"
                        >
                          {() => <TextValidator 
                                  variant="outlined"
                                  margin="normal"
                                  fullWidth
                                  label="Phone"
                                  name="contact_number"
                                  validators={['required', 'matchRegexp:^(\\([0-9]{3}\\)|[0-9]{3}-) [0-9]{3}-[0-9]{4}$']}
                                  errorMessages={['This field is required.', 'Enter valid mobile number.']}
                                  className={classes.orderFormField}
                                /> 
                          }
                        </InputMask>
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
                    Company Information
                  </Box>
                  <div className={classes.plLg4}>
                    <Grid container>
                      <Grid item xs={12} lg={6}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Company Name"
                          name="company_name"
                          validators={[]}
                          errorMessages={[]}
                          value={ values.company_name?values.company_name:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <InputMask
                          mask="(999) 999-9999"            
                          disabled={false}
                          value={ values.company_number?values.company_number:"" }
                          onChange={ handleChange }
                          maskChar="_"
                        >
                          {() => <TextValidator 
                                  variant="outlined"
                                  margin="normal"
                                  fullWidth
                                  label="Phone"
                                  name="company_number"
                                  validators={['matchRegexp:^(\\([0-9]{3}\\)|[0-9]{3}-) [0-9]{3}-[0-9]{4}$']}
                                  errorMessages={['Enter valid mobile number.']}
                                  className={classes.orderFormField}
                                /> 
                          }
                        </InputMask>
                      </Grid>
                    </Grid>

                    <Box
                      component={Typography}
                      variant="h6"
                      color={theme.palette.gray[600] + "!important"}
                      paddingTop="0.25rem"
                      paddingBottom=".25rem"
                      fontSize=".75rem!important"
                      letterSpacing=".04em"
                      marginTop="1rem!important"
                      marginBottom="0rem!important"
                      classes={{ root: classes.typographyRootH6 }}
                    >
                      Mailing Address
                    </Box>

                    <Grid container>
                      <Grid item xs={12}>
                        <TextValidator 
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          label="Address"
                          name="mailing_address"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.mailing_address?values.mailing_address:"" }
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
                          name="mailing_address2"
                          validators={[]}
                          errorMessages={[]}
                          value={ values.mailing_address2?values.mailing_address2:"" }
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
                          name="mailing_city"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.mailing_city?values.mailing_city:"" }
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
                          name="mailing_state"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.mailing_state?values.mailing_state:"" }
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
                          name="mailing_zip"
                          validators={['required']}
                          errorMessages={['This field is required']}
                          value={ values.mailing_zip?values.mailing_zip:"" }
                          className={classes.orderFormField}
                          onChange={ handleChange } 
                        />
                      </Grid>
                    </Grid>
                  </div>
                  
                </Grid>
                <Grid
                  item
                  xs={12}
                  xl={5}
                  component={Box}
                  marginBottom="3rem!important"
                  className={classes.marginBottomXl0}
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
                    Client Notes
                  </Box>
                  <div className={classes.plLg4}>
                    <Grid container>
                      <Grid item xs={12} lg={12}>
                      <TextField
                        placeholder="Write notes here."
                        multiline="true"
                        name="notes"
                        value={ values.notes?values.notes:"" }
                        className={classes.notesField }
                        onChange={ handleChange }
                      />
                      </Grid>
                    </Grid>
                  </div>

                  <Box display="flex" justifyContent="center" marginTop="1rem" marginBottom="1rem">
                    <Box display="inline-block">
                      { !updating &&
                      <>
                        <Button type="submit" color="primary" variant="outlined">
                          Save
                        </Button>
                      </>
                      }
                      { updating && <CircularProgress /> }
                    </Box>
                    <Box display="inline-block" marginLeft="1rem">
                      <Button color="default" variant="outlined" onClick={(event) => navi.push('/user/clients')}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                  
                </Grid>
              </Grid>
              }
            </CardContent>
          </Card>
        </Container>

        <Snackbar 
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={message?true:false} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={error?"error":"success"}>
            { message }
          </Alert>
        </Snackbar>
      </ValidatorForm>
    </>
  );
}

export default AddClient;
