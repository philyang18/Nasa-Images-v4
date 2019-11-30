import React from 'react';
import { fetchRover, fetchMarsFavorites } from './NasaAPIs';
import { NavLink } from 'react-router-dom';
import ErrorPage  from './ErrorPage';
import Loading from './Loading';
import { formatDisplayDate } from './Formatting';

const API = "https://itp404-final-project-yangphil.herokuapp.com/api/favorites";

export default class SingeImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            idExists: false,
            loading: false,
            photo: {}, 
            liked: false,
            loadingError: false
        };
    }
    componentDidMount = async () => {
        this.setState({ loading: true });
        try {
             var firstSplit = this.props.match.params.info.split("=");
             const id = firstSplit[2];
            var secondSplit = firstSplit[1].split("&");
            const earthDate = secondSplit[0];
            const photos = await fetchRover(earthDate);
            this.setState({photos });
            this.state.photos.map(photo => {
                if (String(photo.id) === id) {
                    this.setState({ idExists: true , photo });
                }
                return 0;
            });
            this.checkIfLiked();
        } catch {
            this.setState({ loadingError: true });
        }
        this.setState({ loading: false });
    }
    checkIfLiked = async () => {
		const urlComponents = this.state.photo.img_src.split('/');
		const id = urlComponents[urlComponents.length - 1];
        const image = await fetchMarsFavorites(id);
		if (image === 404 || image === 400) {
			this.setState({ liked: false });
		} else {
			this.setState({ liked: true });
		}
	}
    toggleLike = async () => {
		const urlComponents = this.state.photo.img_src.split('/');
		const id = urlComponents[urlComponents.length - 1];
		if(!this.state.liked){
			await fetch(`${API}/mars`, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json "
				},
				body: JSON.stringify({
                    id: id,
                    url: this.state.photo.img_src,
                    date: this.state.photo.earth_date,
                    api: "mars",
                    array_id: this.state.photo.id
				})
			});
		}
		else {
			await fetch(`${API}/mars/${id}`, {
				method: 'DELETE'
			});
		}
		this.setState({ liked: !this.state.liked });
	}
	lastTap = null;
	handleDoubleTap = () => {
		const now = Date.now();
		const DOUBLE_PRESS_DELAY = 300;
		if (this.lastTap && (now - this.lastTap) < DOUBLE_PRESS_DELAY) {
			this.toggleLike();
		} else {
			this.lastTap = now;
		}
	}
    render() {
        return (
            <div id="singlePhotoPage">
                {this.state.loading ? <Loading/> :
                    <div>
                        {this.state.photos.length === 0 || !this.state.idExists ? <ErrorPage url={this.props.location.pathname} /> :
                            <div key={this.state.photo.id} className="container">
                                <div className="row">
                                    <NavLink to={{
                                        pathname: '/mars', 
                                        dateProps:{
                                            earth_date: this.state.photo.earth_date
                                        }
                                    }} > <button id="back-button">Back</button>
                                    </NavLink>
                                </div>
                                <div className="row">
                                    <div className="col-lg-7 col-md-7 col-sm-12 single-photo">
                                        <img className="col-12" onClick={this.handleDoubleTap} src={this.state.photo.img_src} alt={this.state.photo.camera.full_name}/>
                                    </div>
                                    <div className="col-lg-5 col-md-5 col-sm-12 single-photo-details">
                                        <h2>Details</h2>
                                        <p><strong>Date Taken: </strong>{formatDisplayDate(this.state.photo.earth_date)}</p>
                                        <p><strong>Rover: </strong>{this.state.photo.rover.name}</p>
                                        <p><strong>Camera: </strong>{this.state.photo.camera.full_name}</p>
                                        <p><strong>Launch Date: </strong>{formatDisplayDate(this.state.photo.rover.launch_date)}</p>
                                        <p><strong>Landing Date: </strong>{formatDisplayDate(this.state.photo.rover.landing_date)}</p>
                                        <p><strong>Status: </strong>{this.state.photo.rover.status}</p>
                                        <p className="icon-holder" onClick={this.toggleLike}>
                                            <img
                                                src={this.state.liked ? require('./images/filledHeart.png') : require('./images/emptyHeart.png')}
                                                className="heart-icon"
                                                alt="heart icon"
                                            />
                                        </p>
                                    </div>
                                </div>
                            </div>      
                        }
                    </div>
                }   
            </div>
        );
    }
    
}