import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  stepBack: {
    backgroundColor: 'transparent'
  },
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
	icon: {
		width: '24px',
		height: '24px'
	}
}));

function getSteps() {
  return ['OPTIONS', 'DETAILS', 'PAYMENT'];
}

export default function OrderStepper() {
  const classes = useStyles();
  const navi = useHistory();  
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());  
  const steps = getSteps();

  useEffect(() => {
    if (window.location.pathname.indexOf("user/order/prices") !== -1) {
      setActiveStep(0);

    } else if (window.location.pathname.indexOf("user/order/details") !== -1) {
      const newCompleted = new Set();
      newCompleted.add(0);
      setCompleted(newCompleted);

      setActiveStep(1);

    } else if (window.location.pathname.indexOf("user/order/payment") !== -1) {
      const newCompleted = new Set();
      newCompleted.add(0);
      newCompleted.add(1);
      setCompleted(newCompleted);

      setActiveStep(2);
    }
  }, [])

  const handleStep = (step) => () => {
    setActiveStep(step);

    if (completed.has(step)) {
      if (step === 0) {
        navi.push('/user/order/prices');

      } else if (step === 1) {
        navi.push('/user/order/details');

      } else if (step === 2) {
        navi.push('/user/order/payment');
      }
    }
  };

  function isStepComplete(step) {
    return completed.has(step);
  }

  return (
    <div className={classes.root}>
      <Stepper alternativeLabel nonLinear activeStep={activeStep} className={classes.stepBack}>
        {steps.map((label, index) => {
          const buttonProps = {};
          return (
            <Step key={label}>
              <StepButton
                onClick={handleStep(index)}
                completed={isStepComplete(index)}
                {...buttonProps}
                disabled={!isStepComplete(index)}
              >
                <StepLabel
                  StepIconProps={{ classes: { root: classes.icon } }}
                >
                  {label}
                </StepLabel>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
}