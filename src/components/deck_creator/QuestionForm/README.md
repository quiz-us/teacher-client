# Question Form

## Description

Form for creating questions.

## Usage

```js
const useStyles = makeStyles({
  root: {
    margin: '20px',
    width: '80%'
  }
});

const standards = [
  { id: 1, name: '6.5A' },
  { id: 2, name: '8.5A' },
  { id: 3, name: '8.8A' }
];

const questionTypes = ['Free Response', 'Multiple Choice'];

const onSubmit = formData => alert(JSON.stringify(formData, 2));

const fetchTags = async input => {
  const res = await axios.get(`/tags?input=${input}`);
  return res.data;
};

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <QuestionForm
        standards={standards}
        questionTypes={questionTypes}
        onSubmit={onSubmit}
        fetchTags={fetchTags}
      />
    </div>
  );
};


```

## Properties

| Props           | Type               | Required | Values | Default | Description                                                               |
| --------------- | ------------------ | :------: | ------ | ------- | ------------------------------------------------------------------------- |
| `standards`     | `array of objects` |  `true`  |        |         | Array of teaching standards                                               |
| `questionTypes` | `array of strings` |  `true`  |        |         | Array question types (ie. Multiple Choice or Free Response)               |
| `onSubmit`      | `function`         |  `true`  |        |         | Callback function to call when form is being submitted                    |
| `fetchTags`     | `function`         |  `true`  |        |         | Callback function to call when user types into the tags autosuggest field |