import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '50px'
  },
  formContainer: {
    width: '30%',
    [theme.breakpoints.down('md')]: {
      width: '50%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '85%'
    },
    height: 'max-content',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  field: {
    marginBottom: '25px'
  },
  header: {
    textAlign: 'center'
  },
  submitButton: {
    marginBottom: '10px',
    marginTop: '25px'
  },
  helpText: {
    textAlign: 'center'
  },
  error: {
    color: 'red'
  }
}));
