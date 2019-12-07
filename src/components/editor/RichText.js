// heavily based on: https://github.com/ianstormtaylor/slate/tree/master/examples/rich-text
import { Editor } from 'slate-react';
import { Value, Block } from 'slate';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatSuperscriptIcon from 'mdi-react/FormatSuperscriptIcon';
import FormatSubscriptIcon from 'mdi-react/FormatSubscriptIcon';
import CodeIcon from '@material-ui/icons/Code';
import InsertImages from 'slate-drop-or-paste-images';
import React from 'react';
import { isKeyHotkey } from 'is-hotkey';
import Image from './Image';
import { Button, Toolbar } from './Components';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Plain from 'slate-plain-serializer';
import styles from './EditorStyles';

const schema = {
  document: {
    last: { type: 'line' },
    normalize: (editor, { code, node }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const line = Block.create('line');

          return editor.insertNodeByKey(node.key, node.nodes.size, line);
        }
        default: {
          return editor;
        }
      }
    }
  },
  blocks: {
    image: {
      isVoid: true
    }
  }
};

const plugins = [
  InsertImages({
    insertImage: (change, file) => {
      return change.insertBlock({
        type: 'image',
        isVoid: true,
        data: { file }
      });
    }
  })
];

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph';

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

/**
 * The rich text example.
 *
 * @type {Component}
 */

class RichTextEditor extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(this.props.initialValue)
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = editor => {
    this.editor = editor;
  };

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { classes, placeholder } = this.props;
    return (
      <div className={classes.root}>
        <Toolbar>
          {this.renderMarkButton(
            'bold',
            <FormatBoldIcon className={classes.icon} />
          )}
          {this.renderMarkButton(
            'italic',
            <FormatItalicIcon className={classes.icon} />
          )}
          {this.renderMarkButton(
            'underlined',
            <FormatUnderlinedIcon className={classes.icon} />
          )}
          {this.renderMarkButton('code', <CodeIcon className={classes.icon} />)}
          {this.renderMarkButton(
            'superscript',
            <FormatSuperscriptIcon
              className={`${classes.icon} ${classes.mdi}`}
            />
          )}
          {this.renderMarkButton(
            'subscript',
            <FormatSubscriptIcon className={`${classes.icon} ${classes.mdi}`} />
          )}
          {this.renderBlockButton(
            'heading-one',
            <LooksOneIcon className={classes.icon} />
          )}
          {this.renderBlockButton(
            'heading-two',
            <LooksTwoIcon className={classes.icon} />
          )}
          {this.renderBlockButton(
            'block-quote',
            <FormatQuoteIcon className={classes.icon} />
          )}
          {this.renderBlockButton(
            'numbered-list',
            <FormatListNumberedIcon className={classes.icon} />
          )}
          {this.renderBlockButton(
            'bulleted-list',
            <FormatListBulletedIcon className={classes.icon} />
          )}
        </Toolbar>
        <Editor
          plugins={plugins}
          schema={schema}
          className={classes.editor}
          spellCheck
          placeholder={placeholder}
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderBlock={this.renderBlock}
          renderMark={this.renderMark}
        />
      </div>
    );
  }

  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'image': {
        return <Image {...props} editor={editor} />;
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

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        {icon}
      </Button>
    );
  };

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock('list-item') && parent && parent.type === type;
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        {icon}
      </Button>
    );
  };

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => {
    this.setState({ value });
    this.props.updateParentState(value);
  };

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */

  onKeyDown = (event, editor, next) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks('list-item').wrapBlock(type);
      }
    }
  };
}

RichTextEditor.propTypes = {
  initialValue: PropTypes.object,
  placeholder: PropTypes.string
};

RichTextEditor.defaultProps = {
  initialValue: Plain.deserialize(''),
  placeholder: 'Write here...'
};

export default withStyles(styles)(RichTextEditor);
