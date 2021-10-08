import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import Snackbar from '@material-ui/core/Snackbar'
import Email from "@material-ui/icons/Email";
import Lock from "@material-ui/icons/Lock";
import Person from "@material-ui/icons/Person";
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import MuiAlert from '@material-ui/lab/Alert';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import InputMask from "react-input-mask";
import { Auth } from 'aws-amplify';
import componentStyles from "assets/theme/views/auth/register.js";

const useStyles = makeStyles(componentStyles);

function Alert(props) {
  const classes = useStyles();
  return <MuiAlert className={classes.alert} elevation={6} variant="filled" {...props} />;
}

function Register() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();
  const [values, setValues] = useState({});
  const [loading, setLoading]  = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [needVerify, setNeedVerify] = useState(false);

  const handleChange = (event) => {
    console.log("handle change")
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    let phone_number = values.mobile;
    phone_number = phone_number.replace("(", "");
    phone_number = phone_number.replace(")", "");
    phone_number = phone_number.replace(" ", "");
    phone_number = phone_number.replace("-", "");
    phone_number = `+1${phone_number}`;

    try {
      setLoading(true);
      const { user } = await Auth.signUp({
        username: values.email,
        password: values.password,
        attributes: {
            name: values.name,
            phone_number: phone_number
        }
      });
      setLoading(false);
      setError(false);
      setNeedVerify(true);

    } catch (error) {
      setLoading(false);
      setError(true);
      setMessage(error.message)
    }
  }

  const verifyEmail = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await Auth.confirmSignUp(values.email, values.verification_code);
      setLoading(false);
      setError(false);
      setMessage("Your email was verified. Please login.")
      setTimeout(() => navi.push('/auth/login'), 2000);

    } catch (error) {
      setLoading(false);
      console.log('error confirming sign up', error);
      setError(true);
      setMessage(error.message)
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessage(null);
  }

  return (
    <Grid item xs={12} lg={6} md={8}>
      { needVerify && 
      <ValidatorForm className={classes.root} noValidate autoComplete="off" onSubmit={verifyEmail}>
        <Card classes={{ root: classes.cardRoot }}>
          <CardContent classes={{ root: classes.cardContent }}>
            <Box
              color={theme.palette.gray[600]}
              textAlign="center"
              marginBottom="1rem"
              marginTop=".5rem"
              fontSize="1rem"
            >
              <Box fontSize="80%" fontWeight="400" component="small">
                <div>Please verify your email by submitting verification code sent to your email.</div>
              </Box>
            </Box>
            
            <FormControl component={Box} width="100%" marginBottom="1rem!important">
              <TextValidator 
                variant="outlined"
                margin="normal"
                fullWidth
                label="Verification Code"
                name="verification_code"
                validators={['required']}
                errorMessages={['This field is required']}
                value={ values.verification_code?values.verification_code:"" }
                className={classes.authFormField}            
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VerifiedUserIcon />
                    </InputAdornment>
                  )
                }}
                onChange={ handleChange} 
              />
            </FormControl>
            
            <Box textAlign="center" marginTop="1.5rem" marginBottom="1.5rem">
              { loading && <CircularProgress size={30} /> }
              { !loading &&
                <Button color="primary" variant="contained" type="submit">
                  Verify Email
                </Button>
              }
            </Box>
          </CardContent>
        </Card>
      </ValidatorForm>
      }
      {!needVerify && 
      <ValidatorForm className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card classes={{ root: classes.cardRoot }}>
          <CardContent classes={{ root: classes.cardContent }}>
            <Box
              color={theme.palette.gray[600]}
              textAlign="center"
              marginBottom="1.5rem"
              marginTop=".5rem"
              fontSize="1rem"
            >
              <Box fontSize="80%" fontWeight="400" component="small">
                Sign up with credentials
              </Box>
            </Box>
            <FormControl component={Box} width="100%" marginBottom="1.5rem!important">
              <TextValidator 
                variant="outlined"
                margin="normal"
                fullWidth
                label="User Name"
                name="name"
                validators={['required']}
                errorMessages={['This field is required']}
                value={ values.name?values.name:"" }
                className={classes.authFormField}            
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  )
                }}
                onChange={ handleChange} 
              />
            </FormControl>

            <FormControl component={Box} width="100%" marginBottom="1.5rem!important">
              <TextValidator 
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                error={false}
                validators={['required', 'isEmail']}
                errorMessages={['This field is required.', 'Please enter valid email']}
                value={ values.email?values.email:"" }
                className={classes.authFormField}            
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  )
                }}
                onChange={ handleChange} 
              />
            </FormControl>

            <FormControl component={Box} width="100%" marginBottom="1.5rem!important">
              <InputMask
                mask="(999) 999-9999"
                disabled={false}
                value={ values.mobile?values.mobile:"" }
                onChange={ handleChange }
                maskChar="_"
              >
                {() => <TextValidator 
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Mobile"
                        name="mobile"
                        validators={['required', 'matchRegexp:^(\\([0-9]{3}\\)|[0-9]{3}-) [0-9]{3}-[0-9]{4}$']}
                        errorMessages={['This field is required.', 'Enter valid mobile number.']}
                        className={classes.authFormField}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneAndroidIcon />
                            </InputAdornment>
                          )
                        }}
                      /> 
                }
              </InputMask>
            </FormControl>

            <FormControl component={Box} width="100%" marginBottom="1.5rem!important">
              <TextValidator 
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                name="password"
                type="password"
                validators={['required']}
                errorMessages={['This field is required']}
                value={ values.password?values.password:"" }
                className={classes.authFormField}            
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  )
                }}
                onChange={ handleChange} 
              />
            </FormControl>
            <Box textAlign="center" marginTop="1.5rem" marginBottom="1.5rem">
              { loading && <CircularProgress size={30} /> }
              {!loading &&
              <Button color="primary" variant="contained" type="submit">
                Create account
              </Button>
              }
            </Box>
          </CardContent>
        </Card>
      </ValidatorForm>
      }

      <Snackbar 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={message?true:false} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={error?"error":"success"}>
          { message }
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default Register;
