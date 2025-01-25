/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { library, help, closeIcon } from '../icons';
import { isValidEmail } from '../auth';
import { Button, TextControl } from '../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import React, { useState } from 'react';

/**
 * Component
 */
const ToolbarButton = ({ label, onClick, icon, className, isSelected }) => {
	const classes = classnames('maxi-cloud-toolbar__button', className);

	return (
		<button
			type='button'
			className={classes}
			onClick={onClick}
			aria-pressed={isSelected}
		>
			{icon}
			<span>{label}</span>
		</button>
	);
};

const LibraryToolbar = ({
	type,
	onRequestClose,
	title = '',
	cost = '',
	isMaxiProActive,
	isMaxiProExpired,
	userName,
	onLogOut,
	onClickConnect,
	showNotValidEmail,
	isLoading,
	isOnboarding,
}) => {
	const [userEmail, setUserEmail] = useState(false);
	const [clickCount, setClickCount] = useState(0);
	const [emailNotValid, setEmailNotValid] = useState(showNotValidEmail);

	if (isLoading) {
		return (
			<div className='maxi-cloud-toolbar'>
				<div className='maxi-cloud-toolbar__loading'>
					{__('Loading...', 'maxi-blocks')}
				</div>
			</div>
		);
	}

	const handleClose = () => {
		if (onRequestClose) {
			onRequestClose();
		}
	};

	const onClickAuth = () => {
		if (showNotValidEmail) return;

		const encodedEmail = encodeURIComponent(userEmail);
		const url = `https://my.maxiblocks.com/login?plugin&email=${encodedEmail}`;
		window.open(url, '_blank')?.focus();

		if (userEmail) onClickConnect(userEmail);
	};

	return (
		<div className='maxi-cloud-toolbar'>
			{type !== 'preview' && (
				<p className='maxi-cloud-toolbar__logo'>
					{library}
					{type === 'starter-sites' &&
						__('Starter sites', 'maxi-blocks')}
				</p>
			)}
			{type === 'preview' ? (
				<>
					<div className='maxi-cloud-toolbar__buttons-group'>
						<ToolbarButton
							label={__('Back', 'maxi-blocks')}
							onClick={onRequestClose}
						/>
						<h2>{title}</h2>
						<span className='maxi-cloud-toolbar__line'>|</span>
						<span>{cost}</span>
					</div>
					<div className='maxi-cloud-toolbar__buttons-group_close'>
						<ToolbarButton onClick={handleClose} icon={closeIcon} />
					</div>
				</>
			) : (
				<div className='maxi-cloud-toolbar__content'>
					{type === 'starter-sites' && isMaxiProActive && userName && (
						<div className='maxi-cloud-toolbar__sign-in'>
							<h5 className='maxi-cloud-container__patterns__top-menu__text_pro'>
								{__('Signed in: ', 'maxi-blocks')}
								<span
									className='maxi-username'
									title={
										clickCount % 2 !== 0
											? __('Click to hide', 'maxi-blocks')
											: __('Click to show', 'maxi-blocks')
									}
									onClick={() => {
										setClickCount(prevCount => prevCount + 1);
									}}
								>
									{isValidEmail(userName)
										? clickCount % 2 !== 0
											? userName
											: '******@***.***'
										: userName}
								</span>
							</h5>
							<Button
								key='maxi-cloud-toolbar__button__sing-out'
								className='maxi-cloud-container__patterns__top-menu__button-go-pro'
								label={__('Sign out', 'maxi-blocks')}
								onClick={() => {
									onLogOut(true);
									onLogOut();
								}}
								disabled={isLoading}
							>
								{isLoading
									? __('Please wait...', 'maxi-blocks')
									: __('Sign out', 'maxi-blocks')}
							</Button>
						</div>
					)}
					{!isMaxiProActive && userName && isMaxiProExpired && (
						<div className='maxi-cloud-toolbar__sign-in'>
							<h5 className='maxi-cloud-container__patterns__top-menu__text_pro'>
								{__('Expired: ', 'maxi-blocks')}
								<span className='maxi-username'>{userName}</span>
							</h5>
							<Button
								key='maxi-cloud-toolbar__button__connect'
								className='maxi-cloud-container__patterns__top-menu__button-connect-pro'
								label={__('Sign in', 'maxi-blocks')}
								onClick={() => onClickAuth()}
							>
								{__('Sign in', 'maxi-blocks')}
							</Button>
						</div>
					)}
					{!isMaxiProActive && userName && !isMaxiProExpired && (
						<div className='maxi-cloud-toolbar__sign-in'>
							<h5 className='maxi-cloud-container__patterns__top-menu__text_pro'>
								<span className='maxi-username'>{userName}</span>
							</h5>
							<Button
								key='maxi-cloud-toolbar__button__sing-out'
								className='maxi-cloud-container__patterns__top-menu__button-go-pro'
								label={__('Sign out', 'maxi-blocks')}
								onClick={() => {
									onLogOut(true);
									onLogOut();
								}}
								disabled={isLoading}
							>
								{isLoading
									? __('Please wait...', 'maxi-blocks')
									: __('Sign out', 'maxi-blocks')}
							</Button>
						</div>
					)}
					{type === 'starter-sites' && !isMaxiProActive && !userName && (
						<div className='maxi-cloud-toolbar__sign-in'>
							<div className='maxi-cloud-container__patterns__top-menu__input'>
								<TextControl
									placeholder={__('Pro user email', 'maxi-blocks')}
									value={userEmail}
									onChange={value => setUserEmail(value)}
								/>
								{emailNotValid && (
									<span>
										{__('The email is not valid', 'maxi-blocks')}
									</span>
								)}
							</div>
							<Button
								key='maxi-cloud-toolbar__button__connect'
								className='maxi-cloud-container__patterns__top-menu__button-connect-pro'
								label={__('Sign in', 'maxi-blocks')}
								onClick={() => {
									if (isValidEmail(userEmail)) {
										setEmailNotValid(false);
										onClickAuth();
									} else {
										setEmailNotValid(true);
									}
								}}
							>
								{__('Sign in', 'maxi-blocks')}
							</Button>
						</div>
					)}
					<a
						className='maxi-cloud-toolbar__help-button'
						href='https://maxiblocks.com/go/help-desk'
						rel='noreferrer'
						target='_blank'
					>
						{help}
						{__('Help', 'maxi-blocks')}
					</a>
					{isOnboarding && (
						<div className='maxi-cloud-toolbar__buttons-group_close'>
							<ToolbarButton
								className='components-button is-small'
								onClick={() =>
									document
										.getElementById('maxi-starter-sites-root')
										?.classList.remove('modal-open')
								}
								icon={closeIcon}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default LibraryToolbar;
