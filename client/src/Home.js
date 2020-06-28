import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return(
            <div id="home-page">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1>NASA IMAGES</h1>
                            {this.props.location.state === undefined ? 
                                <h2>Login / Signup</h2> :
                                <div id="home-link-container" className="row">
                                    <h2 className="col-6">APOD</h2>
                                    <h2 className="col-6">Mars</h2>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}