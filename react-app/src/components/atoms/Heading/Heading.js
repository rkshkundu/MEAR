import React from 'react';

const Heading = (props) => {
	let Level = props.level || 'h4'
    
    return (
        <Level className={props.className}>
            {props.text}
        </Level>
    );
};

export default Heading;
