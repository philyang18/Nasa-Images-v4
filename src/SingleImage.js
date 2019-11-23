import React from 'react';
import { fetchRover} from './NasaAPIs';
import { NavLink } from 'react-router-dom';
import ErrorPage  from './ErrorPage';
import Loading from './Loading';
import { formatDisplayDate } from './Formatting';

export default class SingeImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            id: '',
            idExists: false,
            loading: false,
            photo: {}
        };
    }
    componentDidMount = async () => {
        console.log(this.props);
        this.setState({ loading: true });
        var firstSplit = this.props.match.params.info.split("=");
        const id = firstSplit[2];
        var secondSplit = firstSplit[1].split("&");
        const earthDate = secondSplit[0];
        const photos = await fetchRover(earthDate);
        console.log(photos);
        this.setState({photos, id});
        this.state.photos.map(photo => {
            if (String(photo.id) === this.state.id) {
                this.setState({ idExists: true , photo });
            }
            return 0;
        });
        console.log("photo");
        console.log(this.state.photo);
        this.setState({ loading: false });
    }
    render() {
        return (
            <div id="single-photo-page">
                {this.state.loading ? <Loading/> :
                    <div>
                        {this.state.photos.length === 0 || !this.state.idExists ? <ErrorPage url={this.props.location.pathname} /> :
                            <div key={this.state.photo.id} className="container">
                                <div className="row">
                                    <NavLink to={{
                                        pathname: '/mars_rover', 
                                        dateProps:{
                                            earth_date: this.state.photo.earth_date
                                        }
                                    }} >
                                        <button id="back-button">Back</button>
                                    </NavLink>
                                </div>
                                <div className="row">
                                    <div id="single-mars-photo" className="col-lg-7 col-md-7 col-sm-12">
                                        <img src={this.state.photo.img_src} alt={this.state.photo.camera.full_name}/>
                                    </div>
                                    <div id="single-photo-details" className="col-5 col-md-5 col-sm-12">
                                        <h2>Details</h2>
                                        <p><strong>Date Taken: </strong>{formatDisplayDate(this.state.photo.earth_date)}</p>
                                        <p><strong>Rover: </strong>{this.state.photo.rover.name}</p>
                                        <p><strong>Camera: </strong>{this.state.photo.camera.full_name}</p>
                                        <p><strong>Launch Date: </strong>{formatDisplayDate(this.state.photo.rover.launch_date)}</p>
                                        <p><strong>Landing Date: </strong>{formatDisplayDate(this.state.photo.rover.landing_date)}</p>
                                        <p><strong>Status: </strong>{this.state.photo.rover.status}</p>
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