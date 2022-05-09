import React from 'react';

const Anchor = (props) => {
	return <a className={props.className} href={props.path} target={props.target}>
        {props.text}
        {props.children}
    </a>;
};

export default Anchor;
