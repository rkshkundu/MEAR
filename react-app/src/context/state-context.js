import { createContext } from 'react';

const StateContext = createContext({
	isLoggedIn: false,
	userId: null,
	userToken: null,
	showError: () => {},
	showLoading: () => {},
	login: () => {},
	logout: () => {},
});

export default StateContext;
