import React from 'react';
import { fetchAPOD, fetchApodFavorites, BACK_SERVER_URL } from './NasaAPIs';
import { formatDisplayDate } from './Formatting';
import Loading from './Loading';
import Iframe from 'react-iframe';
import thumbnail from './images/galaxy.jpg';
import { addPhotoNotification, removePhotoNotification } from './Notifications';
import DocumentTitle from "react-document-title";
import axios from 'axios';
const API = "https://itp404-final-project-yangphil.herokuapp.com/api/favorites";


export default class APOD extends React.Component {
    constructor(props) {
		super(props);
        this.state ={
			apod: [],
			previousSeven: [],
			todaysDate: '',
			loading: false,
			description: '',
			descriptionSection: 'hide-description',
			descriptionButton: 'show-description', 
			overRequestedAPIAPI: false,
			liked: false
		};
	}
	componentDidMount = async () => {
		this.setState( { loading: true });
		const apod = await fetchAPOD();
		if (apod.error) {
			this.setState({ overRequestedAPI: true });
		} else {
			this.setState({ apod });
			this.state.previousSeven.push([]);
			this.state.previousSeven[0].push(apod);
			this.setState( { mainLoading: false, todaysDate: apod.date });
			const currentDate = apod.date;
			const dateComponents = currentDate.split('-');
			var year = Number(dateComponents[0]), month = Number(dateComponents[1]), day = Number(dateComponents[2]);
			for( var i = 1; i < 7; i++) {
				if (day === 1){
					month -= 1;
					if(month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
						day = 30;
					} else if (month === 3 ) {
						if (year % 4 === 0) {
							day = 29;
						} else {
							day = 28;
						}
					} else if (month === 1) {
						day = 31;
						month = 12;
						year -= 1;
					} else {
						day = 30;
					}
				} else {
					day -= 1;
				}
				const newDate = String(year) + "-" + String(month) + "-" + String(day);
				this.state.previousSeven.push([]);
				this.state.previousSeven[i].push( await fetchAPOD(newDate) );
			}
			if(apod.media_type !== "video") {
				this.checkIfLiked(apod);
			}
			
			this.setState({ loading: false, description: apod.explanation});
		}
	}
	
	checkIfLiked = async (photo) => {

		const urlComponents = photo.hdurl.split('/');
		const id = urlComponents[urlComponents.length - 1];
		const acc = {
			_id: this.props.location.state.email,
			data: {
				_id: id
			}
		}
		let res = await axios.post(`${BACK_SERVER_URL}/account/favorites/apod/fetch`, acc);
		if(res.status !== 200) {
			this.setState({ liked: false });
		} else {
			this.setState({ liked: true });
		}
	}
	handleClick = (photo) => {
		window.scrollTo({top: 240, behavior: 'smooth' });
		if(photo.date !== this.state.apod.date) {
			this.setState({ apod: photo });
			if(photo.media_type !== "video") {
				this.checkIfLiked( photo );
			}
		}
	} 
	showDescription = () => {
		this.setState({ descriptionSection: "show-description", descriptionButton: "hide-description"});
	}
	hideDescription = () => {
		this.setState({ descriptionSection: "hide-description", descriptionButton: "show-description"});
	}
	toggleLike = async () => {
		const urlComponents = this.state.apod.hdurl.split('/');
		const id = urlComponents[urlComponents.length - 1];
		if(!this.state.liked){
			const newFav = {
                _id: this.props.location.state.email,
                data: {
					_id: id,
					url: this.state.apod.hdurl,
					date: this.state.apod.date,
					comment: "",
					api: "apod"
				}
			};
			axios.put(`${BACK_SERVER_URL}/account/favorites/apod/add`, newFav)
				.then(response => {
					addPhotoNotification(id);
				})
				.catch(err => {
					// console.log(err);
				});
			
		}
		else if(this.state.liked){
			axios.delete('/favorites/apod/delete', {
				// for delete, all data must be wrapped in data
                data: {
					_id: this.props.location.state.email,
					data: {
						_id: id
					}
				}
			})
			.then(response => {
				removePhotoNotification(id);
			})
			.catch(err => {
				// console.log("didn't delete");
			});
			
		}
		this.setState({ liked: !this.state.liked });
	}

	lastTap = null;
	handleDoubleTap = event => {

		const now = Date.now();
		const DOUBLE_PRESS_DELAY = 300;
		if (this.lastTap && (now - this.lastTap) < DOUBLE_PRESS_DELAY) {
			event.preventDefault();
			this.toggleLike();
		} else {
			this.lastTap = now;
		}
	}
	
    render() {
		if(this.state.description !== this.state.apod.explanation) {
			this.setState({ descriptionSection: "hide-description", descriptionButton: "show-description", description: this.state.apod.explanation});
		}
        return(
			<DocumentTitle title="APOD">
				<div id="homePage" onClick={this.props.onClick}> 
					{this.state.overRequestedAPIAPI ? <div>Too many requests to Nasa API</div> :
						<div> 
							<div className="container">
								<h1 className="page-title d-xs-block d-md-none"><div>Astronomy</div><div>Photo of the Day</div></h1>	
								<h1 className="page-title d-none d-md-block">Astronomy Picture of the Day</h1>		
								{this.state.loading ? <Loading/> : 
									<div className="row">
										<div id="main-image" className="col-lg-9 col-md-9 col-sm-12">
											<h3 className="column-title col-12"><strong>{this.state.todaysDate === this.state.apod.date ? "Today" : formatDisplayDate(this.state.apod.date)}</strong></h3>
											<div className="col-12">
												{this.state.apod.media_type !== "video" ?
													<img src={this.state.apod.hdurl} onClick={this.handleDoubleTap} alt={this.state.apod.title} /> :
													<Iframe src={this.state.apod.url} width="100%"frameBorder="0" allowFullScreen/>
												}
											</div>
											<div className="col-12 apod-details">
												{this.state.apod.media_type !== "video" ? 
													<p className="icon-holder" onClick={this.toggleLike}>
														<img
															src={this.state.liked ? require('./images/filledHeart.png') : require('./images/emptyHeart.png')}
															className="heart-icon"
															alt="heart icon"
														/>
													</p> : <p/>
												}
												<p id="apod-date">{formatDisplayDate(this.state.apod.date)}</p>
												<p><strong>{this.state.apod.title}</strong></p>
												<p id="apod-description-button" className={`${this.state.descriptionButton} d-xs-block d-md-none`} onClick={this.showDescription}>Click to Read Description...</p>
												<div className="d-xs-block d-md-none" onClick={this.hideDescription}>
													<p className={this.state.descriptionSection} >{this.state.description}</p>
												</div>
												<p className="d-none d-md-block">{this.state.apod.explanation}</p>
												{this.state.apod.copyright ? 
													<p>Credit: {this.state.apod.copyright}</p> : <p></p>
												}
											</div>
										</div>
										<div id="previous-image-column" className="col-lg-3 col-md-3 col-sm-12">
											<h3 className="column-title col-12"><strong>Last 7 Days</strong></h3>
											{this.state.previousSeven.map(last => {
												return (
													<img src={last[0].media_type === "video" ? thumbnail : last[0].hdurl} className={this.state.apod.date === last[0].date ? "col-12 previous-image active" : "col-12 previous-image"} loading="lazy" key={last[0].title} onClick={() => {this.handleClick(last[0])}} alt={last[0].title} />
												);
												
											})}
										</div>
									</div>
								}
							</div>
							
						</div>
					}
				</div>
			</DocumentTitle>
        );
    }
}

// class DescriptionButton extends React.Component {
// 	constructor(props){
// 		super(props);
// 		this.state = {
// 			description: '',
// 			hideDescription: 'hideDescription'
// 		};
// 	}
// 	componentDidMount() {
// 		this.setState({ description: this.props.description });
// 		console.log(this.state.description);
// 		console.log(this.props.description);
// 	}
// 	handleButtonClick = () => {
// 		this.setState({ hideDescription: "show-description"});
// 	}
// 	render() {
// 		if(this.state.description !== this.props.description) {
// 			this.setState({ hideDescription: "hideDescription", description: this.props.description});
// 		}
// 		return (
// 			<div>
// 				<p id="apod-description-button" className="col-12" onClick={this.handleButtonClick}>Click to Read Description...</p>
// 				<p id="apod-description" className={this.state.hideDescription}>{this.state.description}</p>
// 			</div>					
// 		);
// 	}
	
// }