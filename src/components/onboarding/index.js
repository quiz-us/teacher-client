// import React from 'react';

// // check:
// // do they have at least one standard created?
// // do they have at least one student created?
// // do they have at least one deck created
// // do they have at least one question

// import { makeStyles } from '@material-ui/core/styles';
// import Stepper from '@material-ui/core/Stepper';
// import Step from '@material-ui/core/Step';
// import StepLabel from '@material-ui/core/StepLabel';
// import StepContent from '@material-ui/core/StepContent';
// import Typography from '@material-ui/core/Typography';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//     padding: 30,
//   },
//   actionsContainer: {
//     marginBottom: theme.spacing(2),
//   },
// }));

// function getSteps() {
//   return ['Create first standard', 'Add your first student', 'Create an ad'];
// }

// function getStepContent(step) {
//   switch (step) {
//     case 0:
//       return "Every question should be aligned to a standard. Open the side navigation on the top left corner and navigate to 'Standards Manager'. Once you're there, create your first standard!";
//     case 1:
//       return 'An ad group contains one or more ads which target a shared set of keywords.';
//     case 2:
//       return `Try out different ad text to see what brings in the most customers,
//               and learn how to enhance your ads using features like ad extensions.
//               If you run into any problems with your ads, find out how to tell if
//               they're running and how to resolve approval issues.`;
//     default:
//       return 'Unknown step';
//   }
// }

// export default function VerticalLinearStepper() {
//   const classes = useStyles();
//   const [activeStep, setActiveStep] = React.useState(0);
//   const steps = getSteps();

//   return (
//     <div className={classes.root}>
//       <h2>Quiz Us Onboarding</h2>
//       <Stepper activeStep={activeStep} orientation="vertical">
//         {steps.map((label, index) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//             <StepContent>
//               <Typography>{getStepContent(index)}</Typography>
//             </StepContent>
//           </Step>
//         ))}
//       </Stepper>
//     </div>
//   );
// }
