import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '50px'
  },
  formContainer: {
    width: '30%',
    height: '60%',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  form: {
    display: 'flex',
    height: '60%',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  header: {
    textAlign: 'center'
  },
  submitButton: {},
  helpText: {
    textAlign: 'center'
  },
  error: {
    color: 'red'
  }
});
