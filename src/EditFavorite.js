import React from 'react';
import ErrorPage  from './ErrorPage';
import Loading from './Loading';
import { NavLink } from 'react-router-dom';
import { formatDisplayDate } from './Formatting';
import { fetchRover, fetchAPOD } from './NasaAPIs';

const API = "https://itp404-final-project-yangphil.herokuapp.com/api/favorites";

export default class EditFavorite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            idExists: false,
            loading: false,
            photo: {},
            rawPhoto: {},
            liked: true
        };
    }
    componentDidMount = async () => {
        console.log(this.props);
        this.setState({ loading: true });
        let response = await fetch(`${API}/${this.state.id}`);
        if (response.status === 200) {
            const json = await response.json();
            this.setState({ idExists: true, photo: json });

            console.log(json);
            if(json.api === "mars") {
                const rawPhoto = await fetchRover(json.date);
                rawPhoto.map(photo => {
                    console.log("pp");
                    console.log(photo);
                    if(photo.id === json.array_id){
                        this.setState({ rawPhoto: photo });
                    }
                });
            } else {
                const rawPhoto = await fetchAPOD(json.date);
                this.setState({ rawPhoto });
            }
            console.log("rawphoto");
            console.log(this.state.rawPhoto);
        }
        else {
            this.setState({ idExists: false });
        }
        this.setState({ loading: false }); 
    }
    toggleLike = async () => {
        const id = this.state.photo.id;
        if(this.state.photo.api === "mars") {
            await fetch(`${API}/mars/${id}`, {
                method: 'DELETE'
            });
        } else {
            await fetch(`${API}/apod/${id}`, {
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
                        {this.state.idExists === false ? <ErrorPage url={this.props.location.pathname} /> :
                            <div className="container">
                                <div className="row">
                                    <NavLink to="/favorites"> 
                                        <button id="back-button">Back</button>
                                    </NavLink>
                                </div>
                                <div className="row">
                                    <div className="col-lg-7 col-md-7 col-sm-12 single-photo">
                                        <img className="col-12" src={this.state.photo.url} alt={this.state.photo.comment} onClick={this.handleDoubleTap}/>
                                    </div>
                                    <div className="col-lg-5 col-md-5 col-sm-12 single-photo-details">
                                        {this.state.photo.api === "mars" ? 
                                            <div>
                                                <h2>Details</h2>
                                                <p><strong>Date Taken: </strong>{formatDisplayDate(this.state.rawPhoto.earth_date)}</p>
                                                <p><strong>Rover: </strong>{this.state.rawPhoto.rover.name}</p>
                                                <p><strong>Camera: </strong>{this.state.rawPhoto.camera.full_name}</p>
                                                <p><strong>Launch Date: </strong>{formatDisplayDate(this.state.rawPhoto.rover.launch_date)}</p>
                                                <p><strong>Landing Date: </strong>{formatDisplayDate(this.state.rawPhoto.rover.landing_date)}</p>
                                                <p><strong>Status: </strong>{this.state.rawPhoto.rover.status}</p>
                                                <div className="icon-holder" onClick={this.toggleLike}>
                                                    <img
                                                        src={this.state.liked ? require('./images/filledHeart.png') : require('./images/emptyHeart.png')}
                                                        className="heart-icon"
                                                        alt="heart icon"
                                                    />
                                                </div>
                                            </div> :            
                                            <div>
                                                <p id="apod-date">{formatDisplayDate(this.state.rawPhoto.date)}</p>
                                                <p>{this.state.rawPhoto.explanation}</p>
                                                {this.state.rawPhoto.copyright ? 
                                                    <p>Credit: {this.state.rawPhoto.copyright}</p> : <p></p>
                                                }
                                            </div>  
                                        }   
                                    </div>
                                </div>
                                {this.state.photo.api === "mars" ? <div/> :
                                    <div className="row apod-details">
                                        <div className="icon-holder" onClick={this.toggleLike}>
                                            <img
                                                src={this.state.liked ? require('./images/filledHeart.png') : require('./images/emptyHeart.png')}
                                                className="heart-icon"
                                                alt="heart icon"
                                            />
                                        </div>
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

