// core components
import Dashboard from "views/admin/Dashboard.js";
import Icons from "views/admin/Icons.js";
import Login from "views/auth/Login.js";
import Landing from "views/auth/Landing.js";
import OrderInfo from "views/order-flow/OrderInfo.js";
import OrderDetails from "views/order-flow/OrderDetails.js";
import Prices from "views/order-flow/Prices.js";
import Maps from "views/admin/Maps.js";
import Profile from "views/admin/Profile.js";
import Register from "views/auth/Register.js";
import ForgotPass from "views/auth/ForgotPass.js";
import Deliveries from "views/admin/delivery/Deliveries.js";
import DeliveryDetails from "views/admin/delivery/DeliveryDetails.js";
import Clients from "views/admin/client/Clients.js";
import AddClient from "views/admin/client/AddClient.js";
import EditClient from "views/admin/client/EditClient.js";
import UserOrderInfo from "views/admin/order-flow/OrderInfo.js";
import UserPrices from "views/admin/order-flow/Prices.js";
import UserOrderDetails from "views/admin/order-flow/OrderDetails.js";
import UserPayment from "views/admin/order-flow/Payment.js";
// @material-ui/icons components
import AccountCircle from "@material-ui/icons/AccountCircle";
import Dns from "@material-ui/icons/Dns";
import FlashOn from "@material-ui/icons/FlashOn";
import FormatListBulleted from "@material-ui/icons/FormatListBulleted";
import Grain from "@material-ui/icons/Grain";
import LocationOn from "@material-ui/icons/LocationOn";
import Palette from "@material-ui/icons/Palette";
import Person from "@material-ui/icons/Person";
import Tv from "@material-ui/icons/Tv";
import VpnKey from "@material-ui/icons/VpnKey";
import BusinessIcon from '@material-ui/icons/Business';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SportsHandballIcon from '@material-ui/icons/SportsHandball';

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: Tv,
    iconColor: "Primary",
    component: Dashboard,
    layout: "/user",
    //sidemenu: true
  },
  {
    path: "/icons",
    name: "Icons",
    icon: Grain,
    iconColor: "Primary",
    component: Icons,
    layout: "/user",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: LocationOn,
    iconColor: "Warning",
    component: Maps,
    layout: "/user",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: Person,
    iconColor: "WarningLight",
    component: Profile,
    layout: "/user",
  },
  {
    path: "/order/new/:id",
    name: "New Order",
    icon: Grain,
    iconColor: "Primary",
    component: UserOrderInfo,
    layout: "/user"
  },
  {
    path: "/order/new",
    name: "New Order",
    icon: Grain,
    iconColor: "Primary",
    component: UserOrderInfo,
    layout: "/user",
    sidemenu: true
  },
  {
    path: "/order/prices",
    name: "Choose a Price",
    icon: Grain,
    iconColor: "Primary",
    component: UserPrices,
    layout: "/user"
  },
  {
    path: "/order/details",
    name: "Order Details",
    icon: Grain,
    iconColor: "Primary",
    component: UserOrderDetails,
    layout: "/user"
  },
  {
    path: "/order/payment",
    name: "Order Payment",
    icon: Grain,
    iconColor: "Primary",
    component: UserPayment,
    layout: "/user"
  },
  {
    path: "/deliveries/:id",
    name: "Delivery Details",
    icon: FormatListBulleted,
    iconColor: "Error",
    component: DeliveryDetails,
    layout: "/user"
  },
  
  {
    path: "/deliveries",
    name: "My Deliveries",
    icon: FormatListBulleted,
    iconColor: "Error",
    component: Deliveries,
    layout: "/user",
    sidemenu: true
  },
  {
    path: "/clients/:id/deliveries",
    name: "My Deliveries",
    icon: FormatListBulleted,
    iconColor: "Error",
    component: Deliveries,
    layout: "/user"
  },
  {
    path: "/clients/:id",
    name: "Client Details",
    icon: FormatListBulleted,
    iconColor: "Error",
    component: EditClient,
    layout: "/user"
  },
  {
    path: "/clients",
    name: "My Clients",
    icon: BusinessIcon,
    iconColor: "Error",
    component: Clients,
    layout: "/user",
    sidemenu: true
  },
  {
    path: "/client/new",
    name: "Add New Client",
    icon: BusinessIcon,
    iconColor: "Error",
    component: AddClient,
    layout: "/user"
  },
  {
    path: "/login",
    name: "Login",
    icon: VpnKey,
    iconColor: "Info",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: AccountCircle,
    iconColor: "ErrorLight",
    component: Register,
    layout: "/auth",
  },
  {
    path: "/forgotpass",
    name: "ForgotPass",
    icon: AccountCircle,
    iconColor: "ErrorLight",
    component: ForgotPass,
    layout: "/auth",
  },
  {
    path: "/info",
    name: "OrderInfo",
    icon: AccountCircle,
    iconColor: "Error",
    component: OrderInfo,
    layout: "/order",
  },
  {
    path: "/prices",
    name: "Prices",
    icon: AccountCircle,
    iconColor: "Error",
    component: Prices,
    layout: "/order",
  },
  {
    path: "/details",
    name: "Confirm",
    icon: AccountCircle,
    iconColor: "Error",
    component: OrderDetails,
    layout: "/order",
  },
  {
    path: "/payment/settings",
    name: "Payment Settings",
    icon: PaymentIcon,
    iconColor: "Error",
    component: Icons,
    layout: "/user",
    sidemenu: true
  },
  {
    path: "/payment/list",
    name: "List Payments",
    icon: AccountBalanceIcon,
    iconColor: "Error",
    component: Icons,
    layout: "/user",
    sidemenu: true
  },
  {
    path: "/customer/settings",
    name: "Customer Settings",
    icon: SportsHandballIcon,
    iconColor: "Error",
    component: Icons,
    layout: "/user",
    sidemenu: true
  },
  {
    path: "/",
    name: "Landing",
    icon: AccountCircle,
    iconColor: "Error",
    component: Landing,
    layout: "/",
  },
  
  {
    divider: true,
  },
  {
    title: "Documentation",
  },
  {
    href:
      "https://www.creative-tim.com/learning-lab/material-ui/overview/argon-dashboard?ref=admui-admin-sidebar",
    name: "Getting started",
    icon: FlashOn,
  },
  {
    href:
      "https://www.creative-tim.com/learning-lab/material-ui/colors/argon-dashboard?ref=admui-admin-sidebar",
    name: "Foundation",
    icon: Palette,
  },
  {
    href:
      "https://www.creative-tim.com/learning-lab/material-ui/alerts/argon-dashboard?ref=admui-admin-sidebar",
    name: "Components",
    icon: Dns,
  },
];
export default routes;
