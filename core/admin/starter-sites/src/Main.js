/**
 * WordPress dependencies
 */
import React, { useState } from 'react';

/**
 * Internal dependencies
 */
import {
	authConnect,
	isProSubActive,
	isProSubExpired,
	isValidEmail,
	getUserName,
	logOut,
} from './auth';
import CloudLibrary from './library';
import './Main.css';

const Main = ({ type, isQuickStart }) => {
	const [isMaxiProActive, setIsMaxiProActive] = useState(isProSubActive());
	const [isMaxiProExpired, setIsMaxiProExpired] = useState(isProSubExpired());
	const [userName, setUserName] = useState(getUserName());
	const [showNotValidEmail, setShowNotValidEmail] = useState(false);

	const onClickConnect = async email => {
		const isValid = isValidEmail(email);
		if (isValid) {
			setShowNotValidEmail(false);

			await authConnect(false, email);
			setIsMaxiProActive(isProSubActive());
			setIsMaxiProExpired(isProSubExpired());
			setUserName(getUserName());

			const intervalId = setInterval(async () => {
				const result = await authConnect(false, email);
				if (result) {
					setIsMaxiProActive(isProSubActive());
					setIsMaxiProExpired(isProSubExpired());
					setUserName(getUserName());
					clearInterval(intervalId);

					// Store the modal state before reload
					if (isQuickStart) {
						localStorage.setItem(
							'maxiStarterSitesModalOpen',
							'true'
						);
					}

					window.location.reload();
				}
			}, 1000);
		} else {
			setShowNotValidEmail(true);
		}
	};

	const onLogOut = redirect => {
		logOut(redirect);
		setIsMaxiProActive(false);
		setIsMaxiProExpired(false);
		setUserName('');
	};

	return (
		<div className='Main maxi-library-modal'>
			<CloudLibrary
				cloudType={type}
				url=''
				title='Starter sites'
				prefix=''
				cardId=''
				isMaxiProActive={isMaxiProActive}
				isMaxiProExpired={isMaxiProExpired}
				onClickConnect={onClickConnect}
				showNotValidEmail={showNotValidEmail}
				userName={userName}
				onLogOut={onLogOut}
				isQuickStart={isQuickStart}
			/>
		</div>
	);
};

export default Main;
