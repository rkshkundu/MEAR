import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';     

import "./Login.scss";
import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";

import Loader from '../../atoms/Loader/Loader';
import ErrorChip from '../../atoms/ErrorChip/ErrorChip';

import StateContext from '../../../context/state-context';
import useApiHook from '../../../hooks/api-hook';

const Login = () => {
    const navigate = useNavigate();
	const contextState = useContext(StateContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { sendRequest } = useApiHook();
    
    const LoginHandler = async () => {
        if (contextState.isLoggedIn) {
            navigate('/addpost');
		} else {
            const logInResponse = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/users/login`,
				'POST',
				{ 'Content-Type': 'application/json' },
				JSON.stringify({
					email,
					password,
				})
			);

            if(logInResponse) {
                setEmail('');
                setPassword('');
                
                console.log('Login done successfully!!!', logInResponse);
                contextState.login(logInResponse.id, logInResponse.token);
                navigate('/addpost');
            }
		}
        
    }

    const emailChangeHandler = event => {
        setEmail(event.target.value);
    }

    const passwordChangeHandler = event => {
        setPassword(event.target.value);
    }

    return (
        <div className="login-wrapper">
            <Input value={email} type="email" placeholder="Email" onChange={emailChangeHandler} />
            <Input value={password} type="password" placeholder="Password" onChange={passwordChangeHandler} />
            <div className="login-btn">
                <Button text="Login" type="button" onClick={LoginHandler}/>
            </div>
        </div>
    );
}

export default Login;