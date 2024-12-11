/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import CloudLibrary from '.';
import {
	authConnect,
	isProSubActive,
	isProSubExpired,
	isValidEmail,
	getUserName,
	logOut,
} from '../auth';
/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';

/**
 * Layout modal window with tab panel.
 */
const MaxiModal = props => {
	const {
		type,
		onOpen = null,
		onClose,
		url,
		title,
		cost,
		cardId,
		prefix = '',
		templates,
		pages,
		patterns,
		sc,
		contentXML,
	} = props;

	const [isOpenDetails, changeIsOpenDetails] = useState(false);
	const [isOpenImport, changeIsOpenImport] = useState(false);

	const [isMaxiProActive, setIsMaxiProActive] = useState(isProSubActive());
	const [isMaxiProExpired, setIsMaxiProExpired] = useState(isProSubExpired());
	const [userName, setUserName] = useState(getUserName());
	const [showNotValidEmail, setShowNotValidEmail] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkStatus = async () => {
			try {
				const [active, expired, name] = await Promise.all([
					isProSubActive(),
					isProSubExpired(),
					getUserName(),
				]);

				setIsMaxiProActive(active);
				setIsMaxiProExpired(expired);
				setUserName(name || '');
			} catch (error) {
				console.error('Error checking status:', error);
			} finally {
				setIsLoading(false);
			}
		};

		checkStatus();
	}, []);

	const isCurrentStarterSite =
		title === window.maxiStarterSites?.currentStarterSite;

	const onClickConnect = async email => {
		const isValid = isValidEmail(email);
		if (isValid) {
			setShowNotValidEmail(false);
			setIsLoading(true);

			await authConnect(false, email);
			setIsMaxiProActive(isProSubActive());
			setIsMaxiProExpired(isProSubExpired());
			setUserName(getUserName());

			const intervalId = setInterval(async () => {
				const result = await authConnect(false, email);
				console.log('result', result);
				if (result) {
					setIsMaxiProActive(isProSubActive());
					setIsMaxiProExpired(isProSubExpired());
					setUserName(getUserName());
					clearInterval(intervalId);
				}
			}, 1000);

			setTimeout(() => {
				clearInterval(intervalId);
				setIsLoading(false);
			}, 30000);
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

	const onClickOpenModalDetails = () => {
		changeIsOpenDetails(!isOpenDetails);
		changeIsOpenImport(false);
		if (onOpen) onOpen({ openFirstTime: !isOpenDetails });
		if (onClose) onClose();
	};

	const onClickOpenModalImport = () => {
		changeIsOpenImport(true);
		changeIsOpenDetails(false);
		if (onOpen) onOpen({ openFirstTime: true });
	};

	const handleClose = (params = {}) => {
		changeIsOpenImport(false);
		changeIsOpenDetails(false);

		if (params.openImport) {
			setTimeout(() => {
				changeIsOpenImport(true);
			}, 0);
		}

		if (onClose) onClose();
	};

	const onClickLiveDemo = () => {
		window.open(url, '_blank');
	};

	return (
		<div className='maxi-library-modal__action-section'>
			<div className='maxi-library-modal__action-section__buttons'>
				{type === 'preview' && (
					<>
						<button
							type='button'
							className='maxi-cloud-masonry-card__button'
							onClick={onClickOpenModalDetails}
						>
							{__('Details', 'maxi-blocks')}
						</button>
						<button
							type='button'
							className='maxi-cloud-masonry-card__button'
							onClick={onClickLiveDemo}
						>
							{__('Live Demo', 'maxi-blocks')}
						</button>
						<button
							type='button'
							className='maxi-cloud-masonry-card__button'
							onClick={onClickOpenModalImport}
						>
							{isCurrentStarterSite
								? __('Reset', 'maxi-blocks')
								: __('Import', 'maxi-blocks')}
						</button>
					</>
				)}
				{isOpenDetails && !isOpenImport && (
					<div
						className='components-modal__screen-overlay maxi-open-preview'
						id='maxi-modal'
					>
						<div className='maxi-library-modal maxi-preview'>
							<CloudLibrary
								cloudType={type}
								onClose={handleClose}
								url={url}
								title={title}
								cost={cost}
								cardId={cardId}
								prefix={prefix}
								className={`maxi-library-modal__${type}`}
								templates={templates}
								pages={pages}
								patterns={patterns}
								sc={sc}
								contentXML={contentXML}
								isMaxiProActive={isMaxiProActive}
								isMaxiProExpired={isMaxiProExpired}
								onClickConnect={onClickConnect}
								showNotValidEmail={showNotValidEmail}
								userName={userName}
								onLogOut={onLogOut}
								isLoading={isLoading}
							/>
						</div>
					</div>
				)}
				{isOpenImport && !isOpenDetails && (
					<div
						className='components-modal__screen-overlay maxi-open-preview'
						id='maxi-modal-import'
					>
						<div className='maxi-library-modal maxi-preview maxi-modal-import'>
							<CloudLibrary
								cloudType={type}
								onClose={handleClose}
								url={url}
								title={title}
								cost={cost}
								cardId={cardId}
								prefix={prefix}
								className={`maxi-library-modal__${type}`}
								templates={templates}
								pages={pages}
								patterns={patterns}
								isImport={true}
								sc={sc}
								contentXML={contentXML}
								isMaxiProActive={isMaxiProActive}
								isMaxiProExpired={isMaxiProExpired}
								onClickConnect={onClickConnect}
								showNotValidEmail={showNotValidEmail}
								userName={userName}
								onLogOut={onLogOut}
								isLoading={isLoading}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MaxiModal;
