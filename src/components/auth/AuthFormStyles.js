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
});
