import React from "react";
import ReactNotification from "react-notifications-component";
import { NavLink } from "react-router-dom";

export default class NavigationBar extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      // hide: true
    }
  }

  // toggleAccountMenu = () => {
  //   this.setState({hide: !this.state.hide});
  // }
  logout = () => {
    this.props.onLogout();
  }
  render() {
    return (
      <div>
        <ReactNotification />
        <nav
          id="navigation-bar"
          className="navbar navbar-expand-lg navbar-dark bg-dark"
        >
          <a className="navbar-brand">
            <NavLink to={{
              pathname: '/',
              state: {
                email: this.props.email
              }
            }}>
              NASA Images
            </NavLink>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav"  onClick={this.props.onClick}>
              <li className="nav-item">
                <NavLink className="nav-link" exact={true} to={{
                  pathname: "/apod",
                  state: {
                    email: this.props.email
                  }
                }}>
                  APOD
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to={{
                  pathname: '/mars',
                  state: {
                    email: this.props.email
                  }
                }}>
                  Mars
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to={{
                  pathname: '/favorites',
                  state: {
                    email: this.props.email
                  }
                }}>
                  Favorites
                </NavLink>
              </li>
            </ul>
            <ul id="account-btn-holder" className="navbar-nav">
              <li className="nav-item" >
                <button id="account-btn" className="ml-auto" className="btn" onClick={this.props.onToggle}>
                  <i className="icon-user"></i>
                  {this.props.show ? 
                    <div id="user-box" className="row">
                      <NavLink to={{
                        pathname: '/account/password',
                        state: {
                          email: this.props.email
                        }
                      }}>
                        <button className="col-12">Change Password</button>
                      </NavLink>
                      <div className="col-10 divider"></div>
                      <NavLink 
                        to={{
                          pathname: '/'
                        }}
                      >
                        <button className="col-12" onClick={this.logout}>Logout</button>
                      </NavLink>
                      
                    </div> : <div/>
                  } 
                </button>
              </li>
            </ul>
            
          </div>
        </nav>
      </div>
    );
  }
}
