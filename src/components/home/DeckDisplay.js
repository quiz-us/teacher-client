import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// media queries guide: https://material-ui.com/layout/breakpoints/#theme-breakpoints-down-key-media-query
const styles = theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '28%',
    margin: '20px',
    [theme.breakpoints.down('md')]: {
      width: '45%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
});

const DeckDisplay = ({
  deck: { name, description, id },
  classes,
  openAssigner,
}) => {
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description ? description : 'No Description'}
          </Typography>
        </CardContent>

        <CardActions>
          <Link to={`/decks/${id}/edit`}>
            <Button size="small" color="primary">
              Edit
            </Button>
          </Link>

          <Button size="small" color="primary" onClick={openAssigner}>
            Assign
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

export default withStyles(styles)(DeckDisplay);
