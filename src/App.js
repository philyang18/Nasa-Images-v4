import React from 'react';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import Loading from './Loading';


const API_KEY = "RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0";
async function fetchRover(date) {
  try {
    const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${API_KEY}`);
    // const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&camera=MAHLI&api_key=RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0`);
    const json = await response.json();
    return json.photos;
  } catch {
    return 0;
  }
}
async function fetchAPOD(){
	const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
	const json = await response.json();
	return json;
}



export default class App extends React.Component {
	
  render () {
    return (
    	<Router>
	    	<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
		    	<a className="navbar-brand" href="#">Web Name</a>
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
	    		<Route path="/" exact={true} component={TodaysPicture} />
	    		<Route path="/mars_rover" component={MarsRover}/>
	    	</Switch>

    	</Router>
      );
  }
  
}
class TodaysPicture extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			apod: []
		};
	}
	async componentDidMount() {
		const apod = await fetchAPOD();
		this.setState({ apod });
	}
	render() {
		return (
			<div id="apod-container" className="col-12">
				<img id="apod-photo" src={this.state.apod.url} />
			</div>
			
		);
	}
}

class MarsRover extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			photos: [],
			todaysDate: '',
			searchDate: '2018-11-15',
			invalidDate: true,
			loading: false,
			overRequested: false
		};
	}
	async componentDidMount() {
		var today = new Date(),
			date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
			year = today.getFullYear(),
			month = today.getMonth() + 1,
			day = today.getDate()
		this.setState({ todaysDate: today, loading: true }); 
		console.log(today);
		while (this.state.invalidDate) {
			// const photos = await fetchRover(date);
			const photos = await fetchRover("2019-9-28");
			if(photos == null) {
				this.setState({ overRequested: true });
				break;
			}
			if (photos.length !== 0) {
				this.setState({ photos });
				console.log(photos.length);
				this.setState({invalidDate: false});
			} else {
				if (Number(day) === 1){
					month -= 1;
					if(Number(month) === 5 || Number(month) === 7 || Number(month) === 8 || Number(month) === 10 || Number(month) === 12) {
						day = 30;
					} else if (Number(month) === 3 ) {
						if (Number(year) % 4 === 0) {
							day = 29;
						} else {
							day = 28;
						}
					} else if (Number(month) === 1) {
						day = 31;
						month = 12;
						year -= 1;
					} else {
						day = 30;
					}
				} else {
					day -= 1;
				}
				date = String(year) + '-' + String(month) + '-' + String(day);
			}
		}
		this.setState({ loading: false });
	}
	formatDisplayDate(date) {
		return moment(date).format("MMMM Do YYYY");
	}
	formatPickerDate(date) {
		var dateComponents = date.split('-');
		return new Date(dateComponents[0], dateComponents[1], dateComponents[2], 0, 0, 0, 0);
		
		
	}
	handleChange = event => {
		this.setState({ searchDate: event.target});
	}
	render() {
		return (
			<div>
				{this.state.overRequested ? <div>Too many requests to Nasa API </div>: 
					<div>
						{this.state.loading ? <Loading/>:
							<div>
								{this.state.invalidDate ? <div id="mars-photo-error">No photos on {this.state.searchDate}</div> :
									<div id="mars-photo-container">
										<div className="row">
											<div id="mars-photo-date" className="col-6">{this.formatDisplayDate(this.state.searchDate)}</div>
											<DatePicker
												className="col-6"
												selected={this.formatPickerDate(this.state.searchDate)}
												onChange={this.handleChange}
											/>
										</div>
										{this.state.photos.map(photo => {
											return (
												<img className="mars-photo" src={photo.img_src} />
											);
										})}
									</div>
								}
							</div>
						}
					</div>
				}
			</div>
			
		);
	}
}


