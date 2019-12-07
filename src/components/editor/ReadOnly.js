// heavily based on: https://github.com/ianstormtaylor/slate/tree/master/examples/rich-text
import { Editor } from 'slate-react';
import { Value } from 'slate';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Plain from 'slate-plain-serializer';
import styles from './EditorStyles';

class ReadOnly extends React.Component {
  state = {
    value: Value.fromJSON(this.props.value)
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Editor
          className={classes.editor}
          value={this.state.value}
          renderBlock={this.renderBlock}
          renderMark={this.renderMark}
          readOnly
        />
      </div>
    );
  }

  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'image': {
        return (
          <img
            alt="Flashcard Details"
            {...attributes}
            src={node.data.get('file')}
          />
        );
      }
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      default:
        return next();
    }
  };

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      case 'superscript':
        return <sup {...attributes}>{children}</sup>;
      case 'subscript':
        return <sub {...attributes}>{children}</sub>;
      default:
        return next();
    }
  };
}

ReadOnly.propTypes = {
  value: PropTypes.object
};

ReadOnly.defaultProps = {
  value: Plain.deserialize('')
};

export default withStyles(styles)(ReadOnly);
