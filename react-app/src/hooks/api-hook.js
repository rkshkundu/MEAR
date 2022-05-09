import { useCallback, useRef, useEffect, useContext } from 'react';
import StateContext from '../context/state-context';

//custom hook name starts with 'use' keyword
const useApiHook = () => {
	const contextState = useContext(StateContext);
	const activeApiCalls = useRef([]);

	const sendRequest = useCallback(
		async (url, method = 'GET', headers = {}, body = null) => {
			contextState.showLoading(true);
			contextState.showError('');

			const apiAbortCtrl = new AbortController();
			activeApiCalls.current.push(apiAbortCtrl);

			try {
				const response = await fetch(url, {
					method,
					body,
					headers,
					signal: apiAbortCtrl.signal, //it will stop parallel api call
				});

				const responseData = await response.json();
				if (!response.ok) {
				    throw new Error(responseData.message || 'Error in api call!!!');
				}

				contextState.showLoading(false);
				return responseData;
			} catch (error) {
                contextState.showLoading(false);
				contextState.showError(error.message || JSON.stringify(error));
                throw new Error(error);
			}
		},
		[]
	);

	useEffect(() => {
        return () => {
            activeApiCalls.current.forEach(abortCtrl => abortCtrl.abort()); //clean up function
        }
    }, []);

	return { sendRequest };
};

export default useApiHook;
