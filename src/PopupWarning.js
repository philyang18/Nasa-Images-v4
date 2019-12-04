import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

export default class PopupWarning extends React.Component {
  render() {
    return (
      <div
        data-testid="popup-warning-container"
        className={this.props.hide ? "hide-popup pop-up" : "show-popup popup"}
      >
        <div className="popup-inner row">
          <h1 className="col-12" data-testid="warning-text">
            {this.props.text}
          </h1>
          <div className="col-12 popup-button-holder">
            {this.props.redirectUrl ? (
              <NavLink
                data-testid="link-container"
                to={{
                  pathname: this.props.redirectUrl,
                  idProps: {
                    id: this.props.id
                  }
                }}
              >
                <button
                  className="popup-button"
                  onClick={() => this.props.handlePopup("ok")}
                >
                  Ok
                </button>
              </NavLink>
            ) : (
              <button
                data-testid="ok-button"
                className="popup-button"
                onClick={() => this.props.handlePopup("ok")}
              >
                Ok
              </button>
            )}
            <button
              data-testid="cancel-button"
              className="popup-button"
              autoFocus
              onClick={() => this.props.handlePopup("cancel")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

PopupWarning.propTypes = {
  hide: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  handlePopup: PropTypes.func.isRequired
};
