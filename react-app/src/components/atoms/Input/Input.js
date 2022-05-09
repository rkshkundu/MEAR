import React from "react";

import './Input.scss';

const Input = (props) => {
    return (
        <input type={props.type} className="input" value={props.value} placeholder={props.placeholder} onChange={props.onChange} />
    );
};

export default Input;