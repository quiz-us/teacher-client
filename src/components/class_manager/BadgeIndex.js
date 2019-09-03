import React from 'react';
import GlobalLoader from '../app/GlobalLoader';
import { GET_STUDENTS } from '../queries/Student';
import QRCode from 'qrcode.react';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useStyles = makeStyles({
  root: {
    margin: '20px'
  },
  badgeIndex: {
    margin: '20px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  badge: {
    border: '1px dashed black',
    width: '30%',
    padding: '80px 10px 20px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
});

const BadgeIndex = ({ match }) => {
  const { params } = match;
  const classes = useStyles();
  const { data, loading } = useQuery(GET_STUDENTS, {
    variables: { periodId: params.id }
  });
  if (loading) {
    return <GlobalLoader />;
  }

  const downloadPdf = () => {
    html2canvas(document.querySelector('#badges'), {}).then(canvas => {
      let doc;
      if (canvas.width > canvas.height) {
        doc = new jsPDF('l', 'mm', [canvas.width, canvas.height]);
      } else {
        doc = new jsPDF('p', 'mm', [canvas.height, canvas.width]);
      }
      doc.addImage(canvas, 'PNG', 0, 0);
      doc.save('qr-badges.pdf');
    });
  };

  return (
    <div className={classes.root}>
      <Link className="link" to={`/class-manager/${params.id}`}>
        Back to Class
      </Link>
      <div>
        <Button variant="contained" color="primary" onClick={downloadPdf}>
          Download PDF
        </Button>
      </div>

      <div className={classes.badgeIndex} id="badges">
        {data.students.map(({ firstName, lastName, qrCode }) => {
          return (
            <div className={classes.badge}>
              <div>
                <QRCode value={qrCode} />
              </div>
              <h3>{`${firstName} ${lastName}`}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeIndex;
