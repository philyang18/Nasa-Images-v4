import React from 'react';
import { fetchFavorites } from './NasaAPIs';
import { NavLink } from 'react-router-dom';
 
export default class Favorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mars: [],
            apod: []
        };
    }
    componentDidMount = async () => {
        const favorites = await fetchFavorites();
        this.setState({ mars: favorites.mars, apod: favorites.apod });
        console.log(favorites.mars);
    }   

    render() {
        return (
            <div id="favoritesPage" className="container">
                <h1 className="page-title">Favorite Photos</h1>	
                <h3 className="column-title col-12"><strong>Photo of the Day</strong></h3>
                <div className="photo-container">
                    <div className="row photo-section">
                        {this.state.apod.map( favorite => {
                            return (
                                <div className="mars-photo col-lg-3 col-md-4 col-sm-6" key={favorite.id}>
                                    <NavLink to={`/favorites/edit/${favorite.id}`}>
                                        <img src={favorite.url} alt={favorite.comment}/>
                                    </NavLink>
                                </div>
                            ); 
                        })}
                    </div>
                </div>
                
                <div className="photo-container">
                <h3 className="column-title col-12"><strong>Mars</strong></h3>
                    <div className="row photo-section">
                        {this.state.mars.map( favorite => {
                            return (
                                <div className="mars-photo col-lg-3 col-md-4 col-sm-6" key={favorite.id}>
                                    <NavLink to={`/favorites/edit/${favorite.id}`}>
                                        <img src={favorite.url} alt={favorite.comment}/>
                                    </NavLink>
                                </div>
                            ); 
                        })}
                    </div>
                    
                </div>
            </div>
        );
    }
}