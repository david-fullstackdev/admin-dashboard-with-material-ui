import React, { useState } from "react";
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
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from '@material-ui/core/TextareaAutosize';
import InputMask from "react-input-mask";
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import Header from "components/Headers/Header.js";
import componentStyles from "assets/theme/views/admin/client.js";
import { addClient } from "services/client.js";
import states from "assets/jsons/states.json";

const useStyles = makeStyles(componentStyles);

function AddClient() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    addClient(values)
    .then(result => {
      setLoading(false);
      navi.push('/user/clients');
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
                  xl={7}
                  component={Box}
                  marginBottom="3rem"
                  classes={{ root: classes.gridItemRoot + " " + classes.order1 }}
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
                  classes={{ root: classes.order2 + " " + classes.marginBottomXl0 }}
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
                  
                  <Box display="flex" marginTop="1rem" marginBottom="1rem" justifyContent="center">
                    <Box display="inline-block">
                      { !loading &&
                        <Button type="submit" color="primary" variant="outlined">
                          Add Client
                        </Button>
                      }
                      { loading && <CircularProgress /> }
                    </Box>
                    <Box display="inline-block" marginLeft="1rem">
                      <Button color="default" variant="outlined" onClick={(event) => navi.push('/user/clients')}>
                        Cancel
                      </Button>
                    </Box>
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

export default AddClient;
