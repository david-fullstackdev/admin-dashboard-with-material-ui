import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch/*, Redirect*/ } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import theme from "assets/theme/theme.js";
import { Provider } from 'react-redux'
import configureStore from './store';

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import HomeLayout from "layouts/Home.js";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import OrderLayout from "layouts/Order.js";

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

export const store = configureStore ();

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Switch>
          
          <Route path="/user" render={(props) => <AdminLayout {...props} />} />
          <Route path="/auth" render={(props) => <AuthLayout {...props} />} /> 
          <Route path="/order" render={(props) => <OrderLayout {...props} />} />
          <Route path="/" render={(props) => <HomeLayout {...props} />} /> 


          {/* <Redirect from="/" to="/auth/login" /> */}
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
  document.querySelector("#root")
);
