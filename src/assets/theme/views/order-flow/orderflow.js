import boxShadows from "assets/theme/box-shadow.js";

const componentStyles = (theme) => ({
  orderFormField: {
    "& input": {
      borderRight: '0',
      height: 'auto'
    }
  },
  mapContainer: {
    height: '660px', 
    width: '100%',
    "&>.leaflet-container": {
      height: '100%'
    }
  },
  mapContainer_details: {
    height: '660px', 
    width: '100%',
    marginBottom: '15px',
    "&>.leaflet-container": {
      height: '100%'
    }
  },
	planName: {
		fontSize: '18px',
		fontWeight: 'bold'
	},
	planDriver: {
		padding: '12px 15px',
    border: 'solid 1px #525f7f',
    borderRadius: '4px'
	},
	planPrice: {
		fontSize: '18px'
	},
  orderDetails: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    "&>div": {
      border: 'solid 1px #5e72e4',
      borderRadius: '5px',
      padding: '13px',
      textAlign: 'center',
      color: '#5e72e4',

      "&>div:first-child": {
        fontSize: '20px',
        marginBottom: '10px',
        fontWeight: '600'
      }
    }
  },

	paymentTitle: {
		fontSize: '30px'
	},
	paymentCard: {
		height: '160px'
	},
  mb2: {
    marginBottom: '20px'
  },
  cardRoot: {
    boxShadow: boxShadows.boxShadow + "!important",
    border: "0!important",
	},
  cardRootSecondary: {
    backgroundColor: theme.palette.secondary.main,
  },
  cardHeaderRoot: {
    backgroundColor: theme.palette.white.main + "!important",
  },
  containerRoot: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: "39px",
      paddingRight: "39px",
    },
  },
  gridItemRoot: {
    [theme.breakpoints.up("xl")]: {
      marginBottom: "0!important",
    },
  },
  typographyRootH6: {
    textTransform: "uppercase",
  },
  plLg4: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: "1.5rem",
    },
  },
  ptMd4: {
    [theme.breakpoints.up("sm")]: {
      paddingTop: "1.5rem!important",
    },
  },
  mtMd5: {
    [theme.breakpoints.up("sm")]: {
      paddingTop: "3rem!important",
    },
  },
  cardHeaderRootProfile: {
    [theme.breakpoints.up("sm")]: {
      paddingBottom: "1.5rem!important",
      paddingTop: "1.5rem!important",
    },
  },
  buttonRootInfo: {
    color: theme.palette.white.main,
    backgroundColor: theme.palette.info.main,
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
    },
  },
  buttonRootDark: {
    color: theme.palette.white.main,
    backgroundColor: theme.palette.dark.main,
    "&:hover": {
      backgroundColor: theme.palette.dark.dark,
    },
  },
  profileImage: {
    verticalAlign: "middle",
    borderStyle: "none",
    transform: "translate(-50%,-30%)",
    transition: "all .15s ease",
  },
  cardProfileLink: {
    color: theme.palette.primary.main,
    backgroundColor: "initial",
    textDecoration: "none",
    fontSize: "1rem",
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },
  order1: {
    [theme.breakpoints.down("lg")]: {
      order: "1!important",
    },
  },
  order2: {
    [theme.breakpoints.down("lg")]: {
      order: "2!important",
    },
  },
  marginBottomXl0: {
    [theme.breakpoints.up("lg")]: {
      marginBottom: "0!important",
    },
  },
});

export default componentStyles;
