import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';


async function fetchRover(date) {
  try {
    const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&camera=MAHLI&api_key=RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0`);
    // const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&camera=MAHLI&api_key=RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0`);
    
    const json = await response.json();
    return json;
  } catch {
    return 0;
  }
}



export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			photos: [],
			date: ''
		};
	}
  async componentDidMount() {
    const photos = await fetchRover("2019-2-28");
    console.log(photos);
  }
  render () {
    return (
    	<div>
	    	<nav class="navbar navbar-expand-lg navbar-light bg-light">
		    	<a class="navbar-brand" href="#">Web Name</a>
		    	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
		    		<span class="navbar-toggler-icon"></span>
		    	</button>
		    	<div class="collapse navbar-collapse" id="navbarNav">
			    	<ul class="navbar-nav">
			    		<li class="nav-item">
			    			<a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
			    		</li>
				    	<li class="nav-item active">
				    		<a class="nav-link" href="#">Mars</a>
				    	</li>
				    	<li class="nav-item">
				    		<a class="nav-link" href="#">Library</a>
				    	</li>
				    	<li class="nav-item">
				    		<a class="nav-link" href="#">Favorites</a>
				    	</li>
			    	</ul>
		    	</div>
	    	</nav>


    	</div>
      );
  }
  
}


