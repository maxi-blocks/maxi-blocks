/**
 * WordPress dependencies
 */
import React, { useState, useEffect } from 'react';
import { useSelect } from '@wordpress/data';

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
	processLocalPurchaseCodeActivation,
} from './auth';
import CloudLibrary from './library';
import './Main.css';

const Main = ({ type, isQuickStart }) => {
	// Use useSelect to properly subscribe to the WordPress data store
	const { proStatus, hasProData } = useSelect(select => {
		const proData = select('maxiBlocks/pro').receiveMaxiProStatus();
		return {
			proStatus: proData,
			hasProData: proData !== undefined && proData !== null,
		};
	}, []);

	// Initialize state based on store data, with fallbacks
	const [isMaxiProActive, setIsMaxiProActive] = useState(() => {
		return hasProData ? isProSubActive() : false;
	});
	const [isMaxiProExpired, setIsMaxiProExpired] = useState(() => {
		return hasProData ? isProSubExpired() : false;
	});
	const [userName, setUserName] = useState(() => {
		return hasProData ? getUserName() : '';
	});
	const [showNotValidEmail, setShowNotValidEmail] = useState(false);
	const [showAuthError, setShowAuthError] = useState(false);

	// Update state when store data changes
	useEffect(() => {
		if (hasProData) {
			setIsMaxiProActive(isProSubActive());
			setIsMaxiProExpired(isProSubExpired());
			setUserName(getUserName());
		}
	}, [proStatus, hasProData]);

	const onClickConnect = async email => {
		const isValid = isValidEmail(email);
		if (isValid) {
			setShowNotValidEmail(false);
			setShowAuthError(false);

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
			setShowAuthError(false);
		}
	};

	/**
	 * Handles purchase code authentication
	 * @param {string} purchaseCode - The purchase code to verify
	 * @param {Object} result - Verification result from middleware
	 */
	const onClickConnectCode = async (purchaseCode, result) => {
		setShowNotValidEmail(false);
		setShowAuthError(false);

		console.log(
			JSON.stringify({
				message: 'Processing purchase code result',
				purchaseCode,
				result,
			})
		);

		if (result.success && result.valid) {
			try {
				// Process successful verification
				const domain = window.location.hostname;
				processLocalPurchaseCodeActivation(
					purchaseCode,
					domain,
					result,
					'yes'
				);

				// Update state
				setIsMaxiProActive(isProSubActive());
				setIsMaxiProExpired(isProSubExpired());
				setUserName(getUserName());

				console.log(
					JSON.stringify({
						message: 'Purchase code activation successful',
						purchaseCode,
					})
				);

				// Store the modal state before reload
				if (isQuickStart) {
					localStorage.setItem('maxiStarterSitesModalOpen', 'true');
				}

				// Reload to refresh the entire interface
				window.location.reload();
			} catch (error) {
				console.error(
					'Error processing purchase code activation:',
					error
				);
				setShowAuthError(true);
			}
		} else {
			// Show error for invalid purchase code
			console.log(
				JSON.stringify({
					message: 'Purchase code verification failed',
					purchaseCode,
					error: result.error,
				})
			);
			setShowAuthError(true);
		}
	};

	const onLogOut = redirect => {
		logOut(redirect);
		setIsMaxiProActive(false);
		setIsMaxiProExpired(false);
		setUserName('');
		setShowNotValidEmail(false);
		setShowAuthError(false);
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
				onClickConnectCode={onClickConnectCode}
				showNotValidEmail={showNotValidEmail}
				showAuthError={showAuthError}
				userName={userName}
				onLogOut={onLogOut}
				isQuickStart={isQuickStart}
			/>
		</div>
	);
};

export default Main;
