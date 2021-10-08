const componentStyles = (theme) => ({
  mainContent: {
    [theme.breakpoints.up("md")]: {
      marginLeft: "250px",
    },
  },
  containerRoot: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: "39px",
      paddingRight: "39px",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

export default componentStyles;
