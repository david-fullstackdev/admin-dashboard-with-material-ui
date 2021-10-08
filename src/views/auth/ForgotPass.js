import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
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
// import { setUserInfo } from 'store/actions';
import componentStyles from "assets/theme/views/auth/login.js";

const useStyles = makeStyles(componentStyles);

function Alert(props) {
  const classes = useStyles();
  return <MuiAlert className={classes.alert} elevation={6} variant="filled" {...props} />;
}

function ForgotPass() {
  const classes = useStyles();
  const theme = useTheme();
  const navi = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({});
  const [needVerify, setNeedVerify] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setMessage(null);
      setLoading(true);
      await Auth.forgotPassword(values.email);
      
      setLoading(false);
      setError(false);
      setNeedVerify(true);
      
    } catch (error) {
      setLoading(false);

      console.log(error);
      setError(true);
      if (error.code === "UserNotFoundException") {
        setMessage("Email does not exist.");

      } else {
        setMessage(error.message);
      }
    }
  }

  const setNewPassword = async (event) => {
    event.preventDefault();

    try {
      setMessage(null);
      setLoading(true);
      await Auth.forgotPasswordSubmit(values.email, values.verification_code, values.password)
      setLoading(false);
      setError(false);
      setMessage("Your password was reset successfully.")
      setTimeout(() => navi.push("/auth/login"), 3000);

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
    <Grid item xs={12} lg={5} md={7}>
      { needVerify && 
      <ValidatorForm className={classes.root} noValidate autoComplete="off" onSubmit={setNewPassword}>
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
                <div>Please submit new password with verification code sent to your email.</div>
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

            <FormControl component={Box} width="100%" marginBottom="1rem!important">
              <TextValidator 
                variant="outlined"
                margin="normal"
                fullWidth
                label="New Password"
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
                  Set New Password
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
                Please submit your email and we will send verification code to your email.
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
            
            <Box textAlign="center" marginTop="1.5rem" marginBottom="1.5rem">
              { loading && <CircularProgress size={30} /> }
              { !loading && 
                <Button color="primary" variant="contained" type="submit">
                  Forgot Password
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

export default ForgotPass;
