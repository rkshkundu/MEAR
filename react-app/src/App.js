import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.scss';
import Home from './components/organisms/Home/Home';
import Header from './components/molecules/Header/Header';
import Container from './components/atoms/Container/Container';
import Loader from './components/atoms/Loader/Loader';
import ErrorChip from './components/atoms/ErrorChip/ErrorChip';
import StateContext from './context/state-context';

//code splitting or lazy loading
const AddPost = React.lazy(() =>
	import('./components/organisms/AddPost/AddPost')
);
const PageNotFound = React.lazy(() =>
	import('./components/atoms/PageNotFound/PageNotFound')
);
const SignUp = React.lazy(() => import('./components/organisms/SignUp/SignUp'));
const Login = React.lazy(() => import('./components/organisms/Login/Login'));

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [userId, setUserId] = useState(null);
	const [userToken, setUserToken] = useState(null);

	const login = useCallback((uid, token) => {
		//makes user looged in, save userid and token in contextapi and localstorage
		setIsLoggedIn(true);
		setUserId(uid);
		setUserToken(token);
		localStorage.setItem('user', JSON.stringify({ userId: uid, token: token }));
	}, []);

	const logout = useCallback(() => {
		//clear context store and localstorage
		setIsLoggedIn(false);
		setUserId(null);
		setUserToken(null);
		localStorage.clear();
	}, []);

	const showLoading = useCallback((loadingVal) => {
		//make loading true/false
		setLoading(loadingVal);
	}, []);

	const showError = useCallback((errorVal) => {
		//show/hdie error chip
		setError(errorVal || false);
	}, []);

	useEffect(() => {
		//make user logged in if token is stored in localstorage
		const storedData = JSON.parse(localStorage.getItem('user'));
		if (storedData && storedData.token) {
			login(storedData.userId, storedData.token);
		}
	}, []);

	let routes;

	if (isLoggedIn) {
		//routes after logged in
		routes = (
			<React.Fragment>
				<Route path="/" element={<Home />} exact />
				<Route path="/addpost" element={<AddPost />} exact />
				<Route path="/updatepost/:pid" element={<AddPost />} exact />
			</React.Fragment>
		);
	} else {
		//routes if user is not log in
		routes = (
			<React.Fragment>
				<Route path="/" element={<Home />} exact />
				<Route path="/signup" element={<SignUp />} exact />
				<Route path="/login" element={<Login />} exact />
			</React.Fragment>
		);
	}

	return (
		<StateContext.Provider
			value={{
				isLoggedIn,
				userId,
				userToken,
				showError,
				showLoading,
				login,
				logout,
			}}
		>
			<Router>
				<Header />
				<Container>
					<main>
						<Suspense fallback={<div><Loader /></div>}>
							<Routes>
								{routes}
								<Route path="/404" element={<PageNotFound />} exact />
								<Route path="*" element={<PageNotFound />} />
							</Routes>
						</Suspense>
					</main>
				</Container>
				{error && <ErrorChip message={error} />}
				{loading && <Loader />}
			</Router>
		</StateContext.Provider>
	);
};

export default App;
