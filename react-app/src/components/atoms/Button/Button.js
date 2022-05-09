import React from 'react';

import "./Button.scss";

const Button = (props) => {

    return <button className={`button ${props.className || ''}`} title={props.title} type={props.type} onClick={props.onClick}>
        {props.text}
    </button>;
};

export default Button;
