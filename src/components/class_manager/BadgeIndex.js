import React from 'react';
import GlobalLoader from '../app/GlobalLoader';
import { GET_STUDENTS } from '../gql/queries/Student';
import { GET_PERIOD } from '../gql/queries/Period';
import QRCode from 'qrcode.react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useStyles = makeStyles({
  root: {
    margin: '20px',
    overflow: 'scroll',
  },
  badgeIndex: {
    width: '1070px',
    margin: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    border: '1px dashed black',
    height: '302px', // height that prevents badges from being cut off in pdf format
    width: '33.33%',
    padding: '85px 10px 20px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  downloadContainer: {
    marginTop: '20px',
  },
});

const BadgeIndex = ({ match }) => {
  const { params } = match;
  const classes = useStyles();
  const { data, loading } = useQuery(GET_STUDENTS, {
    variables: { periodId: params.id },
  });
  const { data: classData, loading: classLoading } = useQuery(GET_PERIOD, {
    variables: { periodId: params.id },
  });
  if (loading || classLoading) {
    return <GlobalLoader />;
  }

  const downloadPdf = () => {
    window.scrollTo(0, 0);
    html2canvas(document.querySelector('#badges'), {}).then(canvas => {
      // https://stackoverflow.com/a/35816550
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let doc = new jsPDF('p', 'mm');
      let position = 0;

      doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save(`${classData.period.name}-badges.pdf`);
    });
  };

  return (
    <div className={classes.root}>
      <Link className="link" to={`/class-manager/${params.id}`}>
        Back to Class
      </Link>
      <div className={classes.downloadContainer}>
        <Button variant="contained" color="secondary" onClick={downloadPdf}>
          Download PDF
        </Button>
      </div>

      <div className={classes.badgeIndex} id="badges">
        {data.students.map(({ firstName, lastName, qrCode }) => {
          return (
            <div className={classes.badge} key={qrCode}>
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
