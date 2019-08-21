import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// media queries guide: https://material-ui.com/layout/breakpoints/#theme-breakpoints-down-key-media-query
const styles = theme => ({
  card: {
    width: '28%',
    margin: '20px',
    [theme.breakpoints.down('md')]: {
      width: '45%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%'
    }
  }
});

const DeckDisplay = ({ deck: { name, description, id }, classes }) => {
  return (
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
        <Button size="small" color="primary">
          Assign
        </Button>
        <Link to={`/decks/${id}/edit`}>
          <Button size="small" color="primary">
            Edit
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default withStyles(styles)(DeckDisplay);
