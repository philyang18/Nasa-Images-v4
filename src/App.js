import React from 'react';

import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import Home from './Home';
import MarsRover from './MarsRover';
import SingleImage from './SingleImage';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';



export default class App extends React.Component {

  render () {
    return (
    	<Router id="appPage">
	    	<nav id="navigation-bar" className="navbar navbar-expand-lg navbar-dark bg-dark">
		    	<a className="navbar-brand disabled" href="#">NASA Images</a>
		    	<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
		    		<span className="navbar-toggler-icon"></span>
		    	</button>
		    	<div className="collapse navbar-collapse" id="navbarNav">
			    	<ul className="navbar-nav">
			    		<li className="nav-item">
				    		<NavLink className="nav-link" to="/" exact={true}>Home</NavLink>
				    	</li>
				    	<li className="nav-item">
				    		<NavLink className="nav-link" to="/mars_rover">Mars</NavLink>
				    	</li>
				    	<li className="nav-item">
				    		<NavLink className="nav-link" to="/hello">Library</NavLink>
				    	</li>
				    	<li className="nav-item">
				    		<a className="nav-link" href="#">Favorites</a>
				    	</li>
			    	</ul>
		    	</div>
	    	</nav>
	    	<Switch>
	    		<Route path="/" exact={true} component={Home} />
	    		<Route path="/mars_rover" exact={true} component={MarsRover}/>
				{/* <Route path="/mars_rover" exact={true} render={(props) => <MarsRover {...props} earth_date={} />}/> */}
				<Route path="/mars_rover/:info" exact={true} component={SingleImage}/>
	    	</Switch>

    	</Router>
      );
  }
  
}


