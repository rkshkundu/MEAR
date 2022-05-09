import React, {useContext} from 'react';

import './ErrorChip.scss';
import Button from '../Button/Button';
import StateContext from '../../../context/state-context';

const ErrorChip = (props) => {
	const contextState = useContext(StateContext);

	const closeHandler = () => {
		contextState.showError(false);
	}
	
	return (
		<div className='error-wrapper'>
			<div className="error">
				<p className='error-message'>{props.message}</p>
				<Button text="x" title="Close" className="error-close"  type="button" onClick={closeHandler}/>
			</div>
		</div>
	);
};

export default ErrorChip; 
