import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import APOD from "./APOD";
import MarsRover from "./MarsRover";
import SingleMarsImage from "./SingleMarsImage";
import Login from './Login';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import EditFavorite from "./EditFavorite";
import Favorites from './Favorites';
import ErrorPage from "./ErrorPage";
import "react-notifications-component/dist/theme.css";
import NavigationBar from "./NavigationBar";
import EditPassword from "./EditPassword";
import Home from './Home';



function PrivateRoute ({component: Component, authed, onClick, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} onClick={onClick}/>
        : <Redirect to={{
            pathname: '/'
          }} />}
    />
  )
}
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      showAccountMenu: false
    };
  }

  saveEmail = (email) => {
    this.setState({email});
  }
  logout = () => {
    this.setState({email: ""});
  }
  toggleAccountMenu = () => {
    this.setState({showAccountMenu: !this.state.showAccountMenu});
  }
  closeAccountMenu = () => {
    this.setState({showAccountMenu: false});
  }
  render() {
    return (
      <Router id="appPage" onClick={this.closeAccountMenu}>
        <Switch>
          {/* <Route path="/" exact render={(props) => <Login {...props} onLogin={this.saveEmail} />} /> */}
          <Route path="/" exact render={(props) => <Login {...props} onLogin={this.saveEmail} />} />
          <Route path="/:anything">
            <NavigationBar email={this.state.email} onClick={this.closeAccountMenu} onLogout={this.logout} onToggle={this.toggleAccountMenu} show={this.state.showAccountMenu}/>
            <Switch>
              <PrivateRoute path="/apod" onClick={this.closeAccountMenu} authed = {this.state.email.length === 0 ? false : true} exact component={APOD}/>
              {/* <Route path="/apod" exact render={(props) =>  <APOD {...props} email={this.state.email} />}/> */}
              <PrivateRoute path="/mars/:info" exact onClick={this.closeAccountMenu} authed = {this.state.email.length === 0 ? false : true} component={SingleMarsImage} />
              <PrivateRoute path="/mars" onClick={this.closeAccountMenu} authed = {this.state.email.length === 0 ? false : true} exact component={MarsRover} />
              <PrivateRoute path="/favorites/edit/:id" exact onClick={this.closeAccountMenu} authed = {this.state.email.length === 0 ? false : true} component={EditFavorite} />
              <PrivateRoute path="/favorites" onClick={this.closeAccountMenu} authed = {this.state.email.length === 0 ? false : true} exact component={Favorites} />
              <PrivateRoute path="/account/password" onClick={this.closeAccountMenu} authed= {this.state.length === 0 ? false : true} exact component={EditPassword} />
              <PrivateRoute component={ErrorPage}  onClick={this.closeAccountMenu} authed = {this.state.email.length === 0 ? false : true}/>
            </Switch>
          </Route>
        </Switch>
      </Router>
    );
  }
}
