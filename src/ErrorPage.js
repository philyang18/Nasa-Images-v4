import React from 'react';

export default function(props) {
    var { url } = props;
    if (!url) {
        url = props.location.pathname;
    }
    return(
        <div className="loading-error">
            <p>The URL </p>
            <p> {url} </p> 
            <p> was not found!</p>
        </div>
    );
}