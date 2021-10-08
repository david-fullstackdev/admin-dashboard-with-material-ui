import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import MuiAlert from '@material-ui/lab/Alert';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Auth } from 'aws-amplify';
import { setUserInfo } from 'store/actions';
import componentStyles from "assets/theme/views/auth/login.js";

const useStyles = makeStyles(componentStyles);

function Alert(props) {
  const classes = useStyles();
  return <MuiAlert className={classes.alert} elevation={6} variant="filled" {...props} />;
}

function Login() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({});
  const [needVerify, setNeedVerify] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const orderInfo = useSelector(state => state.orderInfo);
  const pickupLocation = useSelector(state => state.order_pickupLocation);
  const deliveryLocation = useSelector(state => state.order_deliveryLocation);
  const orderPrice = useSelector(state => state.orderPrice);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true);
      const user = await Auth.signIn(values.email, values.password);
      
      setLoading(false);
      setError(false);
      dispatch(setUserInfo(user));

      if (orderInfo/* && pickupLocation && deliveryLocation && orderPrice*/) {
        navi.push('/user/order/new');
      } else {
        navi.push('/user/deliveries');
      }
      
      
      
    } catch (error) {
      setLoading(false);
      console.log('error signing in', error);

      if (error.code === "UserNotConfirmedException") {
        sendVerificationCode();
        setNeedVerify(true)
        
      } else {
        setError(true);
        setMessage(error.message)
      }
    }
  }

  const verifyEmail = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await Auth.confirmSignUp(values.email, values.verification_code);
      setLoading(false);
      setMessage("Your email was verified. Please login.")
      setNeedVerify(false);

    } catch (error) {
      setLoading(false);
      console.log('error confirming sign up', error);
      setError(true);
      setMessage(error.message)
    }
  }

  const sendVerificationCode = async() => {
    try {
      setLoading(true);
      await Auth.resendSignUp(values.email);
      setLoading(false);
      setError(false);
      setMessage("Verification code resent successfully")
      
    } catch (error) {
      setLoading(false);
      setMessage(error.message);
      setError(true);
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessage(null);
  }

  return (
    <Grid item xs={12} lg={5} md={7}>
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
                <div>Your email is not verified.</div>
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

      { !needVerify &&
      <ValidatorForm className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
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
                Sign in with credentials
              </Box>
            </Box>

            <FormControl component={Box} width="100%" marginBottom="1rem!important">
              <TextValidator 
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                error={false}
                validators={['required', 'isEmail']}
                errorMessages={['Please enter valid email']}
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

            <FormControl component={Box} width="100%" marginBottom="1rem!important">
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
              { !loading && 
                <Button color="primary" variant="contained" type="submit">
                  Sign in
                </Button>
              }
            </Box>
          </CardContent>
        </Card>
        <Grid container component={Box} marginTop="1rem">
          <Grid item xs={6} component={Box} textAlign="left">
            <a
              href="/auth/forgotpass"
              className={classes.footerLinks}
            >
              Forgot password
            </a>
          </Grid>
          <Grid item xs={6} component={Box} textAlign="right">
            <a
              href="/auth/register"
              className={classes.footerLinks}
            >
              Create new account
            </a>
          </Grid>
        </Grid>
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

export default Login;
