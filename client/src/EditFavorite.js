import React from "react";
import ErrorPage from "./ErrorPage";
import Loading from "./Loading";
import { NavLink } from "react-router-dom";
import { formatDisplayDate } from "./Formatting";
import { fetchRover, fetchAPOD } from "./NasaAPIs";
import CommentBox from "./CommentBox";
import {
  removePhotoNotification,
  updateCommentNotification,
  deleteCommentNotification
} from "./Notifications";
import PopupWarning from "./PopupWarning";
import DocumentTitle from "react-document-title";
import axios from 'axios';

const API = "https://itp404-final-project-yangphil.herokuapp.com/api/favorites";

export default class EditFavorite extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      id: this.props.match.params.id,
      idExists: false,
      loading: false,
      photo: {}, // photo is the JSON data from my api
      rawPhoto: {}, // rawPhoto is the actual JSON data from nasa api
      liked: true,
      comment: "Click to add a comment", // default comment
      deleteConfirmed: false,
      hidePopup: true
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    
    const acc = {
      _id: this.props.location.state.email,
      data: {
        _id: this.state.id
      }
    }
    let response = await axios.post(`/account/favorites/${this.props.location.state.api}/fetch`, acc);
    
    if(response.status === 200) {
      this.setState({ photo: response.data, idExists: true });
      if (response.data.comment || !response.data.comment.trim()) {
        this.setState({ comment: response.data.comment });
      } else {
        this.setState({ comment: "" });
      }
      if(this.props.location.state.api === "apod") {
        const rawPhoto = await fetchAPOD(response.data.date);
        this.setState({ rawPhoto });
      } else {
        const nasaRes = await fetchRover(response.data.date);
          nasaRes.map(photo => {
            if (photo.id === response.data.array_id) {
              this.setState({ rawPhoto: photo });
            } 
          });
      } 
    } else {
      this.setState({ idExists: false });
    }
    this.setState({ loading: false });
  }

  toggleLike = async () => {
    await axios.delete(`/account/favorites/${this.state.photo.api}/delete`, {
				// for delete, all data must be wrapped in data
        data: {
					_id: this.props.location.state.email,
					data: {
						_id: this.state.photo._id
					}
				}
			})
			.then(response => {
				// console.log(response);
			})
			.catch(err => {
				// console.log("didn't delete");
			});
  
    this.setState({ liked: !this.state.liked });
    removePhotoNotification(this.state.photo._id);
    this.setState({ hidePopup: true });
    this.props.history.push({
      pathname: '/favorites',
      state: {
        email: this.props.location.state.email
      }
    });
  }

  lastTap = null;
  handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY) {
      this.openWarning();
    } else {
      this.lastTap = now;
    }
  };
  handleCommentUpdate = async newComment => {
    const id = this.state.photo._id;
    if (!newComment.trim()) {
      newComment = "";
      deleteCommentNotification(id);
    } else {
      updateCommentNotification(id);
    }
    this.setState({ comment: newComment });
    axios.post(`/account/favorites/${this.state.photo.api}/edit`, {
      _id: this.props.location.state.email,
      data: {
        _id: id,
        comment: newComment
      }
    });
    // if (this.state.photo.api === "mars") {
    //   await fetch(`${API}/mars/${id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json " },
    //     body: JSON.stringify({
    //       comment: newComment
    //     })
    //   });
    // } else {
    //   await fetch(`${API}/apod/${id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json " },
    //     body: JSON.stringify({
    //       comment: newComment
    //     })
    //   });
    // }
  };
  openWarning = () => {
    this.setState({ hidePopup: false });
  };
  handleWarning = option => {
    if (option === "ok") {
      this.toggleLike();
    } else {
      this.setState({ hidePopup: true });
    }
  };
  render() {
    return (
      <DocumentTitle title="Edit Favorite">
        <div id="singlePhotoPage" onClick={this.props.onClick}>
          <PopupWarning
            hide={this.state.hidePopup}
            text="Remove from Favorites?"
            handlePopup={this.handleWarning}
            email={this.props.location.state.email}
          />
          {this.state.loading ? (
            <Loading />
          ) : (
            <div>
              {this.state.idExists === false ? (
                <ErrorPage url={this.props.location.pathname} />
              ) : (
                <div className="container">
                  <div className="row">
                    <NavLink to={{
                      pathname: "/favorites",
                      state: {
                        email: this.props.location.state.email
                      }
                    }}>
                      <a id="back-button" href="" className="btn col-12"><i className="icon-circle-arrow-left"></i></a>
                    </NavLink>
                  </div>
                  <div className="row">
                    <div className="col-lg-7 col-md-7 col-sm-12 single-photo">
                      <img
                        className="col-12"
                        src={this.state.photo.url}
                        alt={this.state.photo.comment}
                        onClick={this.handleDoubleTap}
                      />
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-12 single-photo-details">
                      {this.state.photo.api === "mars" ? (
                        <div>
                          <h2>Details</h2>
                          <p>
                            <strong>Date Taken: </strong>
                            {formatDisplayDate(this.state.rawPhoto.earth_date)}
                          </p>
                          <p>
                            <strong>Rover: </strong>
                            {this.state.rawPhoto.rover.name}
                          </p>
                          <p>
                            <strong>Camera: </strong>
                            {this.state.rawPhoto.camera.full_name}
                          </p>
                          <p>
                            <strong>Launch Date: </strong>
                            {formatDisplayDate(
                              this.state.rawPhoto.rover.launch_date
                            )}
                          </p>
                          <p>
                            <strong>Landing Date: </strong>
                            {formatDisplayDate(
                              this.state.rawPhoto.rover.landing_date
                            )}
                          </p>
                          <p>
                            <strong>Status: </strong>
                            {this.state.rawPhoto.rover.status}
                          </p>
                          {/* <div className="icon-holder" onClick={this.toggleLike}>
                                                    <img
                                                        src={this.state.liked ? require('./images/filledHeart.png') : require('./images/emptyHeart.png')}
                                                        className="heart-icon"
                                                        alt="heart icon"
                                                    />
                                                </div> */}
                          <p className="icon-holder" onClick={this.openWarning}>
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
                          <p>
                            <strong>Comment:</strong>
                          </p>
                          <div className="margin-top-20">
                            <CommentBox
                              value={this.state.comment}
                              onEnter={this.handleCommentUpdate}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p id="apod-date">
                            {formatDisplayDate(this.state.rawPhoto.date)}
                          </p>
                          <p>
                            <strong>{this.state.rawPhoto.title}</strong>
                          </p>
                          <p>{this.state.rawPhoto.explanation}</p>
                          {this.state.rawPhoto.copyright ? (
                            <p>Credit: {this.state.rawPhoto.copyright}</p>
                          ) : (
                            <p></p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {this.state.photo.api === "apod" ? (
                    <div>
                      <div className="col-12 apod-details">
                        <p className="icon-holder" onClick={this.openWarning}>
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
                        <p>
                          <strong>Comment:</strong>
                        </p>
                        <CommentBox
                          value={this.state.comment}
                          onEnter={this.handleCommentUpdate}
                        />
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DocumentTitle>
    );
  }
}
