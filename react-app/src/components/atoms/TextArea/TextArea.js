import React from "react";

import './TextArea.scss';

const TextArea = (props) => {
    return (
        <textarea className="textarea" value={props.value} onChange={props.onChange} placeholder={props.placeholder}></textarea>
    );
};

export default TextArea;