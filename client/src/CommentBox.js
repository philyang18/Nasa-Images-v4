import React from "react";
import PropTypes from "prop-types";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: props.value,
      editMode: false,
      defaultText: "Click to add a comment",
      default: false,
      showSaveError: false
    };
  }
  componentDidMount = () => {
    if (
      this.props.value === "" ||
      !this.props.value ||
      this.props.value === "\n"
    ) {
      this.setState({ default: true });
    }
  };
  enableEditMode = () => {
    this.setState({
      editMode: true
    });
  };
  handleChange = event => {
    this.setState({
      currentValue: event.target.value
    });
    if (event.target.value.length <= 150) {
      this.setState({
        showSaveError: false
      });
    }
  };
  handleKeyUp = event => {
    console.log(event);
    const { keyCode } = event;
    const { currentValue } = this.state;
    if ((keyCode === ENTER_KEY && !event.shiftKey)|| keyCode === ESCAPE_KEY) {
      this.setState({ editMode: false });
    }

    if (keyCode === ENTER_KEY && !event.shiftKey) {
      if (!currentValue.trim()) {
        this.setState({ default: true, currentValue: "" });
      } else {
        this.setState({ default: false });
      }
      this.props.onEnter(currentValue);
    } else if (keyCode === ESCAPE_KEY) {
      this.setState({
        currentValue: this.props.value
      });
    }
  };
  handleInvalidKeyUp = event => {
    const { keyCode } = event;
    if (keyCode === ESCAPE_KEY) {
      this.setState({ editMode: false, currentValue: this.props.value });

    }
    if (keyCode === ENTER_KEY) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth' });
      
      this.setState({ showSaveError: true });
    }
  };
  // removes a newline when hitting enter
  handleKeyDown = event => {
    const { keyCode } = event;
    if (keyCode === ENTER_KEY && !event.shiftKey) {
      event.preventDefault();
    }
  };

  render() {
    if (this.state.editMode) {
      return (
        <div>
          <textarea
            data-testid="comment-input"
            id="comment-box-input"
            value={this.state.currentValue}
            onKeyUp={ this.state.currentValue.length <= 150 ? this.handleKeyUp : this.handleInvalidKeyUp }
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            rows="5"
            autofocus
          />
          <RemainingCharacters max={150} text={this.state.currentValue}>
            {remainingCharacters => {
              return (
                <p className={remainingCharacters < 0 ? "text-danger" : undefined}>
                  {remainingCharacters} characters left
                </p>
              );
            }}
          </RemainingCharacters>
          {this.state.showSaveError ? <div data-testid="form-validation" className="text-danger">Cannot save!</div> : <div /> }
        </div>
      );
    }
    else {
      return (
        <p
          data-testid="comment-text"
          id="comment-box"
          className="col-lg-6 col-md-6 col-sm-12"
          onClick={this.enableEditMode}
        >
          {this.state.default ? this.state.defaultText : this.props.value}
        </p>
      );
    }
  }
}

CommentBox.propTypes = {
  value: PropTypes.string.isRequired,
  onEnter: PropTypes.func.isRequired
};

function RemainingCharacters(props) {
  const { max, text, children } = props;
  const remaining = max - text.length;

  if (typeof children === "function") {
    return children(remaining);
  } else {
    return <>{remaining} characters left</>;
  }
}

RemainingCharacters.propTypes = {
  text: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired
};
