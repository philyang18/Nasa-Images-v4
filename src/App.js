import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import Home from "./Home";
import MarsRover from "./MarsRover";
import SingleMarsImage from "./SingleMarsImage";
import Favorites from "./Favorites";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch
} from "react-router-dom";
import EditFavorite from "./EditFavorite";
import ErrorPage from "./ErrorPage";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

export default class App extends React.Component {
  render() {
    return (
      <Router id="appPage">
        <ReactNotification />
        <nav
          id="navigation-bar"
          className="navbar navbar-expand-lg navbar-dark bg-dark"
        >
          <a className="navbar-brand disabled" href="#">
            NASA Images
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
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" exact={true}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/mars">
                  Mars
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/favorites">
                  Favorites
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <Route path="/mars" exact={true} component={MarsRover} />
          <Route path="/mars/:info" exact={true} component={SingleMarsImage} />
          <Route path="/favorites" exact={true} component={Favorites} />
          <Route path="/favorites/edit/:id" component={EditFavorite} />
          <Route component={ErrorPage} />
        </Switch>
      </Router>
    );
  }
}
