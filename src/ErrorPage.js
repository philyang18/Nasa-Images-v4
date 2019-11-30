import React from 'react';

export default function(props) {
    var { url } = props;
    if (!url) {
        url = props.location.pathname;
    }
    return(
        <div className="container loading-error">
            <div className="row">
                <p className="col-12">The URL </p>
                <p className="col-12"> {url} </p> 
                <p className="col-12"> was not found!</p>
            </div>
        </div>
    );
}