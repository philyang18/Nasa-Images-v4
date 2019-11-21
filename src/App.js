import React from 'react';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import Loading from './Loading';


// const API_KEY = "RzyT98G4RWi51f3LYNHdbdEzUJkUH7RdAJnQoOd0";
// const API_KEY = "BfzfbPpRYn7O5rafnhT7BMOC0hUoEV54ybVwWe1a";
const API_KEY = "PBViMuqFzfpvcXjqnmC6jYR4pqkNbyC0jNUy95Sh";
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
			currentDate: '',
			previousDate: '',
			invalidDate: true,
			loading: false,
			overRequested: false
		};
	}
	componentDidMount = async () => {
		var today = new Date(),
			year = today.getFullYear(),
			month = today.getMonth() + 1,
			day = today.getDate();
		this.setState({loading: true }); 
		// today.setDate(18);
		// today.setMonth(3);
		// console.log(today);
		while (this.state.photos.length === 0) {
			var todayString = moment(today).format("YYYY-M-D");
			console.log(todayString);
			const photos = await fetchRover(todayString);
			// const photos = await fetchRover("2019-4-18");
			if(photos === null) {
				this.setState({ overRequested: true });
				break;
			}
			if (photos.length > 0) {
				this.setState({ photos });
				// console.log(photos.length);
				this.setState({invalidDate: false});
			} 
			else {
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
				today.setMonth(month -1);
				today.setFullYear(year);
				today.setDate(day);
			}
		}
		this.setState({ currentDate: today, previousDate: today, loading: false });
	}
	componentDidUpdate = async () => {
		if(this.state.currentDate !== this.state.previousDate){
			this.setState({ previousDate: this.state.currentDate, photos:[], loading: true, invalidDate: true, overRequested: false}); 
			var todayString = moment(this.state.currentDate).format("YYYY-M-D");
			const photos = await fetchRover(todayString);
			console.log(photos);
			console.log(photos.length);
			if(photos.length === 0) {
				this.setState({photos, loading: false});
			}
			if(photos === null) {
				this.setState({ overRequested: true, loading: false});
			}
			if(photos.length > 0){
				this.setState({ photos });
				this.setState({invalidDate: false, loading: false});
			}
		}
	}
	formatDisplayDate(date) {
		return moment(date).format("MMMM Do YYYY");
	}
	handleChange = event => {
		this.setState({ currentDate: event });
	}
	render() {
		return (
			<div>
				{this.state.overRequested ? <div>Too many requests to Nasa API </div>: 
					<div>
						{this.state.loading ? <Loading/>:
							<div>
								{this.state.photos.length === 0 ? <div id="mars-photo-error">No photos on {this.formatDisplayDate(this.state.currentDate)}</div> :
									<div id="mars-photo-container">
										<div className="row">
											<div id="mars-photo-date" className="col-12">{this.formatDisplayDate(this.state.currentDate)}</div>
											<div id="mars-date-picker" className="col-12">
												<DatePicker
													selected={this.state.currentDate}
													onChange={this.handleChange}
												/>
											</div>
										</div>
										{this.state.photos.map(photo => {
											return (
												<img className="mars-photo" src={photo.img_src} key={photo.id} alt={photo.camera.full_name}/>
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


