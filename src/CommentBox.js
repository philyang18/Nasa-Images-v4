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
      showError: false
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
        showError: false
      });
    }
  };
  handleKeyUp = event => {
    console.log(event);
    const { keyCode } = event;
    const { currentValue } = this.state;
    if (keyCode === ENTER_KEY || keyCode === ESCAPE_KEY) {
      this.setState({ editMode: false });
    }

    if (keyCode === ENTER_KEY) {
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
      this.setState({ showError: true });
    }
  };
  // removes a newline when hitting enter
  handleKeyDown = event => {
    const { keyCode } = event;
    console.log(keyCode);
    if (keyCode === ENTER_KEY && !event.shiftKey) {
      event.preventDefault();
    }
  };

  render() {
    if (this.state.editMode) {
      return (
        <div>
          <textarea
            id="comment-box-input"
            value={this.state.currentValue}
            onKeyUp={
              this.state.currentValue.length <= 150
                ? this.handleKeyUp
                : this.handleInvalidKeyUp
            }
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            rows="5"
          />
          <RemainingCharacters max={150} text={this.state.currentValue}>
            {remainingCharacters => {
              return (
                <p
                  className={
                    remainingCharacters < 0 ? "text-danger" : undefined
                  }
                >
                  {remainingCharacters} characters left
                </p>
              );
            }}
          </RemainingCharacters>
          {this.state.showError ? (
            <div className="text-danger">Cannot save!</div>
          ) : (
            <div />
          )}
        </div>
      );
    }
    if (this.state.default) {
      return (
        <p
          id="comment-box"
          className="col-lg-6 col-md-6 col-sm-12"
          onClick={this.enableEditMode}
        >
          {this.state.defaultText}
        </p>
      );
    } else {
      return (
        <p
          id="comment-box"
          className="col-lg-6 col-md-6 col-sm-12"
          onClick={this.enableEditMode}
        >
          {this.props.value}
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
