import React from "react";
import { fetchFavorites, BACK_SERVER_URL } from "./NasaAPIs";
import { NavLink } from "react-router-dom";
import Loading from "./Loading";
import DocumentTitle from "react-document-title";
import axios from "axios";

export default class Favorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mars: [],
      apod: [],
      loading: false
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    const fav = await axios.post(`${BACK_SERVER_URL}/account/favorites`, { _id: this.props.location.state.email });
    this.setState({mars: fav.data.mars, apod: fav.data.apod});
    
    this.setState({ loading: false });
  };

  render() {
    return (
      <DocumentTitle title="Favorites">
        <div id="favoritesPage" className="container" onClick={this.props.onClick}>
          <h1 className="page-title">Favorite Photos</h1>
          {this.state.loading ? (
            <Loading />
          ) : (
            <div>
              <h3 className="column-title col-12">
                <strong>Photo of the Day</strong>
              </h3>

              <div className="photo-container">
                <div className="row photo-section">
                  {this.state.apod.map(favorite => {
                    return (
                      <div
                        className="mars-photo col-lg-3 col-md-4 col-sm-6"
                        key={favorite._id}
                      >
                        <NavLink to={{
                          pathname: `/favorites/edit/${favorite._id}`,
                          state: {
                            email: this.props.location.state.email,
                            api: "apod"
                          }
                        }}>
                          <img src={favorite.url} alt={favorite.comment} />
                          </NavLink>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="photo-container">
                <h3 className="column-title col-12">
                  <strong>Mars</strong>
                </h3>
                <div className="row photo-section">
                  {this.state.mars.map(favorite => {
                    return (
                      <div
                        className="mars-photo col-lg-3 col-md-4 col-sm-6"
                        key={favorite._id}
                      >
                        <NavLink to={{
                          pathname: `/favorites/edit/${favorite._id}`,
                          state: {
                            email: this.props.location.state.email,
                            api: "mars"
                          }
                        }}>
                          <img src={favorite.url} alt={favorite.comment} />
                        </NavLink>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </DocumentTitle>
    );
  }
}
