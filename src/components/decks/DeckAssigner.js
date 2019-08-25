import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { GET_PERIODS } from '../queries/Period';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { DatePicker } from '@material-ui/pickers';
import { CREATE_ASSIGNMENTS } from '../queries/Assignment';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '20px'
  },
  field: {
    marginBottom: '30px'
  },
  label: {
    marginBottom: '10px'
  }
}));

const DeckAssigner = ({ open, closeAssigner, selectedDeck }) => {
  const { name: deckName, id: deckId } = selectedDeck;

  const [selectedDate, handleDateChange] = useState(new Date());
  const [instructions, setInstructions] = useState('');
  const [selectedPeriods, setSelectedPeriods] = useState({});
  const { data, loading } = useQuery(GET_PERIODS);
  const [createPeriod, { loading: createLoading }] = useMutation(
    CREATE_ASSIGNMENTS,
    {
      onCompleted: data => {
        console.log(data);
      },
      onError: err => console.error(err)
    }
  );
  const classes = useStyles();
  if (loading) {
    return null;
  }

  const toggleSelected = periodId => {
    return () => {
      setSelectedPeriods({
        ...selectedPeriods,
        [periodId]: !selectedPeriods[periodId]
      });
    };
  };

  const handleSubmit = e => {
    e.preventDefault();
    createPeriod({
      variables: {
        instructions: instructions,
        due: selectedDate,
        deckId,
        periodIds: Object.keys(selectedPeriods)
      }
    });
  };

  const { periods = [] } = data;
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      className={classes.root}
      open={open}
      onClose={closeAssigner}
    >
      <DialogTitle>
        Assign <strong>{`${deckName}`}</strong>
      </DialogTitle>
      <DialogContent>
        <form className={classes.form} onSubmit={handleSubmit}>
          <DatePicker
            required
            className={classes.field}
            autoOk
            label="Due Date"
            clearable
            value={selectedDate}
            onChange={handleDateChange}
          />
          <FormLabel required className={classes.label} component="legend">
            Classes To Assign To
          </FormLabel>
          {periods.length ? (
            <Paper className={`${classes.paper} ${classes.field}`}>
              <List dense component="div" role="list">
                {periods.map(({ name, id }) => {
                  const labelId = `list-item-${name}-label`;
                  return (
                    <ListItem
                      key={name}
                      role="listitem"
                      button
                      onClick={toggleSelected(id)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedPeriods[id] === true}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={name} />
                    </ListItem>
                  );
                })}
                <ListItem />
              </List>
            </Paper>
          ) : (
            <div>
              You currently have no classes! Go to your{' '}
              <Link className="link" to="/class-manager">
                Class Manager
              </Link>{' '}
              to create one!
            </div>
          )}

          <TextField
            className={classes.field}
            label="Instructions"
            name="instructions"
            type="text"
            multiline
            fullWidth
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
          />
          {createLoading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" color="primary" type="submit">
              Assign
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeckAssigner;
