import React from 'react';

const Image = (props) => {
	
    return (
        <img className={props.className} src={props.imagePath} alt={props.altText} />
    );
};

export default Image;
