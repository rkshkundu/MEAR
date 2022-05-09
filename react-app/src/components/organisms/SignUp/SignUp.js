import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import './SignUp.scss';

import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import Loader from '../../atoms/Loader/Loader';
import ErrorChip from '../../atoms/ErrorChip/ErrorChip';

import StateContext from '../../../context/state-context';
import useApiHook from '../../../hooks/api-hook';

const SignUp = () => {
	const navigate = useNavigate();
	const contextState = useContext(StateContext);
	
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	
	const { sendRequest } = useApiHook();

	const signUpHandler = async () => {
		if (contextState.isLoggedIn) {
            navigate('/addpost');
		} else {
			if (password !== confirmPassword) {
				console.error('Password dont match!!!');
				return;
			}
        
            const signUpResponse = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/users/signup`,
				'POST',
				{ 'Content-Type': 'application/json' },
				JSON.stringify({
					name,
					email,
					password,
				})
			);

            if(signUpResponse) {
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                console.log('Signup done successfully!!!', signUpResponse);
                contextState.login(signUpResponse.id, signUpResponse.token);
                navigate('/addpost');
            }
		}
	};

	const nameChangeHandler = (event) => {
		setName(event.target.value);
	};

	const emailChangeHandler = (event) => {
		setEmail(event.target.value);
	};

	const passwordChangeHandler = (event) => {
		setPassword(event.target.value);
	};

	const confirmPasswordChangeHandler = (event) => {
		setConfirmPassword(event.target.value);
	};

	return (
		<div className="signup-wrapper">
			<Input
				value={name}
				type="text"
				placeholder="Name"
				onChange={nameChangeHandler}
			/>
			<Input
				value={email}
				type="email"
				placeholder="Email"
				onChange={emailChangeHandler}
			/>
			<Input
				value={password}
				type="password"
				placeholder="Password"
				onChange={passwordChangeHandler}
			/>
			<Input
				value={confirmPassword}
				type="password"
				placeholder="Confirm Password"
				onChange={confirmPasswordChangeHandler}
			/>
			<div className="signup-btn">
				<Button text="Sign Up" type="button" onClick={signUpHandler} />
			</div>
		</div>
	);
};

export default SignUp;
