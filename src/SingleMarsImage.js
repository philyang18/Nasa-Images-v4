import React from "react";
import { fetchRover, fetchMarsFavorites } from "./NasaAPIs";
import { NavLink } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Loading from "./Loading";
import { formatDisplayDate } from "./Formatting";
import DocumentTitle from "react-document-title";
import { addPhotoNotification, removePhotoNotification } from "./Notifications";
import axios from 'axios';
const API = "https://itp404-final-project-yangphil.herokuapp.com/api/favorites";


export default class SingleMarsImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      idExists: false,
      loading: false,
      photo: {},
      liked: false
      // loadingError: false
    };
  }
  componentDidMount = async () => {
    console.log(this.props);
    this.setState({ loading: true });
    try {
      // date and photo id are passed in via url they need to be extracted
      var firstSplit = this.props.match.params.info.split("=");
      const id = firstSplit[2]; // extract the id
      var secondSplit = firstSplit[1].split("&");
      const earthDate = secondSplit[0];
      // after extracting the date, I can use it to grab the JSON for that date
      const photos = await fetchRover(earthDate);
      this.setState({ photos });
      this.state.photos.map(photo => {
        // check if that ID exists incase the user plays w/ the url
        if (String(photo.id) === id) {
          this.setState({ idExists: true, photo });
          this.checkIfLiked();
        }
        return 0;
      });
    } catch {
      // this.setState({ loadingError: true });
      this.props.history.push({
        pathname: "/mars",
        state: {
          email: this.props.location.state.email
        }
      })
    }
    this.setState({ loading: false });
  };
  checkIfLiked = async () => {

    const urlComponents = this.state.photo.img_src.split("/");
    const id = urlComponents[urlComponents.length - 1];
		
		const acc = {
			_id: this.props.location.state.email,
			data: {
				_id: id
			}
		}
		let res = await axios.post(`http://localhost:4000/account/favorites/mars/fetch`, acc);
		console.log(res);
		if(res.status !== 200) {
			this.setState({ liked: false });
		} else {
			this.setState({ liked: true });
		}
    
  };
  toggleLike = async () => {
    const urlComponents = this.state.photo.img_src.split("/");
    const id = urlComponents[urlComponents.length - 1];
    if(!this.state.liked){
			const newFav = {
        _id: this.props.location.state.email,
        data: {
					_id: id,
					url: this.state.photo.img_src,
					date: this.state.photo.earth_date,
					comment: "",
          api: "mars",
          array_id: this.state.photo.id
				}
			};
			axios.put('http://localhost:4000/account/favorites/mars/add', newFav)
				.then(response => {
					console.log(response);
				})
				.catch(err => {
					console.log(err);
				});
			addPhotoNotification(id);
		}
		else if(this.state.liked){
			axios.delete('http://localhost:4000/account/favorites/mars/delete', {
				// for delete, all data must be wrapped in data
        data: {
					_id: this.props.location.state.email,
					data: {
						_id: id
					}
				}
			})
			.then(response => {
				console.log(response);
			})
			.catch(err => {
				console.log("didn't delete");
			});
			removePhotoNotification(id);
		}
		this.setState({ liked: !this.state.liked });

  };
  lastTap = null;
  handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY) {
      this.toggleLike();
    } else {
      this.lastTap = now;
    }
  };
  render() {
    return (
      <DocumentTitle title="Mars Image Details">
        <div id="singlePhotoPage"  onClick={this.props.onClick}>
          {this.state.loading ? (
            <Loading />
          ) : (
            <div>
              {this.state.photos.length === 0 || !this.state.idExists ? (
                <ErrorPage url={this.props.location.pathname} />
              ) : (
                <div key={this.state.photo.id} className="container">
                  <div className="row">
                    <NavLink
                      to={{
                        pathname: "/mars",
                        state: {
                          email: this.props.location.state.email,
                          earth_date: this.state.photo.earth_date
                        }
                      }}
                    >
                       <a id="back-button" className="btn col-12"><i className="icon-circle-arrow-left"></i></a>
                    </NavLink>
                  </div>
                  <div className="row">
                    <div className="col-lg-7 col-md-7 col-sm-12 single-photo">
                      <img
                        className="col-12"
                        onClick={this.handleDoubleTap}
                        src={this.state.photo.img_src}
                        alt={this.state.photo.camera ? this.state.photo.camera.full_name : "mars image"}
                      />
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-12 single-photo-details">
                      <h2>Details</h2>
                      <p>
                        <strong>Date Taken: </strong>
                        {formatDisplayDate(this.state.photo.earth_date)}
                      </p>
                      {this.state.photo.rover ? 
                        <p>
                          <strong>Rover: </strong>
                          {this.state.photo.rover.name }
                        </p> : <p/> 
                      }
                      {this.state.photo.camera ?
                        <p>
                          <strong>Camera: </strong>
                          {this.state.photo.camera.full_name}
                        </p> : <p/>
                      }
                      {this.state.photo.rover ? 
                        <div>
                          <p>
                            <strong>Launch Date: </strong>
                            {formatDisplayDate(this.state.photo.rover.launch_date)}
                          </p> 
                          <p>
                            <strong>Landing Date: </strong>
                            {formatDisplayDate(this.state.photo.rover.landing_date)}
                          </p>
                          <p>
                            <strong>Status: </strong>
                            {this.state.photo.rover.status}
                          </p>
                        </div> : <div/>
                      }
                      <p className="icon-holder" onClick={this.toggleLike}>
                        <img
                          src={
                            this.state.liked
                              ? require("./images/filledHeart.png")
                              : require("./images/emptyHeart.png")
                          }
                          className="heart-icon"
                          alt="heart icon"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DocumentTitle>
    );
  }
}
