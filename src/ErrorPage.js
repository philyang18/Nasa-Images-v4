import React from 'react';

export default function(props) {
    const { url } = props;
    return(
        <div classnName="mars-photo-error">
            <p>The URL:</p>
            <p>{url}</p> 
            <p>was not found!</p>
        </div>
    );
}