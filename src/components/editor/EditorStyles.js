export default {
  root: {
    backgroundColor: '#F6F8FA',
    '& blockquote': {
      borderLeft: '2px solid #ddd',
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: '10px',
      color: '#aaa',
      fontStyle: 'italic'
    },

    "& blockquote[dir = 'rtl']": {
      borderLeft: 'none',
      paddingLeft: 0,
      paddingRight: '10px',
      borderRight: '2px solid #ddd'
    },

    '& code': {
      backgroundColor: '#eee',
      padding: '3px'
    },

    '& img': {
      display: 'block',
      maxWidth: '100%',
      maxHeight: '20em',
    }
  },
  editor: {
    fontFamily: "'Roboto', sans-serif",
    lineHeight: 1.2,
    padding: '15px'
  },
  icon: {
    width: '.8em'
  },
};
