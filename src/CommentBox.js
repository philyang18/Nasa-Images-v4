import React from 'react';
import PropTypes from 'prop-types';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: props.value,
            editMode: false,
            defaultText: 'Click to add a comment',
            default: false
        };
    }
    componentDidMount = () => {
        if(this.props.value === "" || !this.props.value || this.props.value === "\n") {
            this.setState({ default: true });
        }
    }
    enableEditMode = () => {
        this.setState({
            editMode: true
        });
    }
    handleChange = (event) => {
        this.setState({
            currentValue: event.target.value
        });
    }
    handleKeyUp = (event) => {
        console.log(event);
        const { keyCode } = event;
        const { currentValue } = this.state;
        if (keyCode === ENTER_KEY || keyCode === ESCAPE_KEY) {
            this.setState({ editMode: false });
        }

        if (keyCode === ENTER_KEY) {
            if(!currentValue.trim()) {
                this.setState({ default: true, currentValue: '' });
            } else {
                this.setState({ default: false });
            }
            this.props.onEnter(currentValue);
        } else if (keyCode === ESCAPE_KEY) {
            this.setState({
            currentValue: this.props.value
            });
        }
    }
    
    render() {
        if (this.state.editMode) {
            return (
                <textarea
                    id="comment-box-input"
                    value={this.state.currentValue}
                    onKeyUp={this.handleKeyUp}
                    onChange={this.handleChange} 
                    rows="5"
                    maxLength="150"
                />
            );
        }
        if (this.state.default) {
            return (
                <p id="comment-box" className="col-lg-6 col-md-6 col-sm-12" onClick={this.enableEditMode}>
                    {this.state.defaultText}
                </p>
            );
        } else {
            return (
                <p id="comment-box" className="col-lg-6 col-md-6 col-sm-12" onClick={this.enableEditMode}>
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

    if (typeof children === 'function') {
    return children(remaining);
    } else {
    return (
        <>{remaining} characters left</>
    );
    }
}

RemainingCharacters.propTypes = {
    text: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired
}; 