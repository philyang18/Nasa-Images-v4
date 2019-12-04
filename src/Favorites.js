import React from "react";
import { fetchFavorites } from "./NasaAPIs";
import { NavLink } from "react-router-dom";
import Loading from "./Loading";
import DocumentTitle from "react-document-title";

export default class Favorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mars: [],
      apod: [],
      idToHide: "null",
      loading: false
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    const favorites = await fetchFavorites();
    this.setState({ mars: favorites.mars, apod: favorites.apod });
    if (this.props.location.idProps) {
      this.setState({ idToHide: this.props.location.idProps.id });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <DocumentTitle title="Favorites">
        <div id="favoritesPage" className="container">
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
                    if (favorite.id !== this.state.idToHide) {
                      return (
                        <div
                          className="mars-photo col-lg-3 col-md-4 col-sm-6"
                          key={favorite.id}
                        >
                          <NavLink to={`/favorites/edit/${favorite.id}`}>
                            <img src={favorite.url} alt={favorite.comment} />
                          </NavLink>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              <div className="photo-container">
                <h3 className="column-title col-12">
                  <strong>Mars</strong>
                </h3>
                <div className="row photo-section">
                  {this.state.mars.map(favorite => {
                    if (favorite.id !== this.state.idToHide) {
                      return (
                        <div
                          className="mars-photo col-lg-3 col-md-4 col-sm-6"
                          key={favorite.id}
                        >
                          <NavLink to={`/favorites/edit/${favorite.id}`}>
                            <img src={favorite.url} alt={favorite.comment} />
                          </NavLink>
                        </div>
                      );
                    }
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
