const componentStyles = (theme) => ({
  mainContent: {
    [theme.breakpoints.up("md")]: {
      marginLeft: "0px",
    },
  },
  containerRoot: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: "39px",
      paddingRight: "39px",
    },
  },
});

export default componentStyles;
