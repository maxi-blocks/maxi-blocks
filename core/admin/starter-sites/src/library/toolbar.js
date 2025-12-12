/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { library, help, closeIcon } from '../icons';
import { isValidEmail, authConnect } from '../auth';
import { Button, TextControl } from '../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import React, { useState } from 'react';

/**
 * Helper functions for auth
 */

/**
 * Detects if input is an email or purchase code
 * @param {string} input - The input string to check
 * @returns {string} - 'email' or 'code'
 */
const detectInputType = input => {
	if (!input || typeof input !== 'string') return 'email';

	const trimmedInput = input.trim();

	// If it contains @ or . (dot), it's likely an email
	const hasAtSymbol = trimmedInput.includes('@');
	const hasDot = trimmedInput.includes('.');

	if (hasAtSymbol || hasDot) {
		return 'email';
	}

	// Purchase codes are typically alphanumeric strings without @ or . symbols
	// and are usually longer than 6 characters
	const isAlphanumeric = /^[a-zA-Z0-9\-_]+$/.test(trimmedInput);
	const isLongEnough = trimmedInput.length >= 6;

	// If it doesn't have @ or . and looks like a code, treat as purchase code
	if (isAlphanumeric && isLongEnough) {
		return 'code';
	}

	// Default to email for other cases
	return 'email';
};

/**
 * Verifies purchase code with middleware
 * @param {string} purchaseCode - The purchase code to verify
 * @param {string} domain       - The domain to verify against
 * @returns {Promise<Object>} - Verification result
 */
const verifyPurchaseCode = async (purchaseCode, domain) => {
	const middlewareUrl = import.meta.env.VITE_MAXI_BLOCKS_AUTH_MIDDLEWARE_URL;
	const middlewareKey = import.meta.env.VITE_MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY;

	if (!middlewareUrl || !middlewareKey) {
		console.error('Missing middleware configuration');
		return { success: false, valid: false, error: 'Configuration error' };
	}

	// Get plugin version and multisite info from global settings
	const licenseSettings = window.maxiLicenseSettings || {};
	const pluginVersion =
		licenseSettings.maxi_version || licenseSettings.pluginVersion || '';
	const isMultisite = licenseSettings.isMultisite || false;

	try {
		const response = await fetch(middlewareUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: middlewareKey,
			},
			body: JSON.stringify({
				purchase_code: purchaseCode,
				domain,
				plugin_version: pluginVersion,
				multisite: isMultisite,
			}),
			signal: AbortSignal.timeout(5000), // 5 second timeout to prevent UI hanging
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();

		return result;
	} catch (error) {
		console.error('Purchase code verification error:', error);
		return { success: false, valid: false, error: error.message };
	}
};

/**
 * Gets current domain for purchase code verification
 * @returns {string} - Current domain
 */
const getCurrentDomain = () => {
	try {
		return window.location.hostname;
	} catch (error) {
		console.error('Error getting domain:', error);
		return 'localhost';
	}
};

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
	showAuthError,
	onClickConnectCode,
	isLoading,
	isQuickStart,
}) => {
	const [userEmail, setUserEmail] = useState(false);
	const [clickCount, setClickCount] = useState(0);
	const [emailNotValid, setEmailNotValid] = useState(showNotValidEmail);
	const [isVerifying, setIsVerifying] = useState(false);
	const [authMessage, setAuthMessage] = useState('');

	// Check for network license status
	const licenseSettings = window.maxiLicenseSettings || {};
	const { isMultisite, hasNetworkLicense } = licenseSettings;
	const isNetworkLicenseActive = isMultisite && hasNetworkLicense;

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

	/**
	 * Handles authentication based on input type (email or purchase code)
	 */
	const onClickAuth = async () => {
		const inputValue = userEmail;
		if (!inputValue || isVerifying) return;

		const inputType = detectInputType(inputValue);

		if (inputType === 'email') {
			// Use WordPress AJAX email auth flow (same as admin.js and editor)
			if (isValidEmail(inputValue)) {
				setEmailNotValid(false);
				setAuthMessage('');
				setIsVerifying(true);

				try {
					// Use the WordPress AJAX authentication flow
					const authResult = await authConnect(true, inputValue);

					if (authResult) {
						// Authentication completed immediately (existing valid auth)
						setIsVerifying(false);
						setAuthMessage('');
						onClickConnect(inputValue);
					} else {
						// Authentication initiated, user needs to log in
						setAuthMessage(
							'Please log into your MaxiBlocks account to complete activation'
						);

						// Set up event listener for authentication completion
						const handleAuthSuccess = event => {
							if (event.detail.email === inputValue) {
								window.removeEventListener(
									'maxiEmailAuthSuccess',
									handleAuthSuccess
								);
								setIsVerifying(false);
								setAuthMessage('');
								onClickConnect(inputValue);
							}
						};

						// Set up event listener for authentication errors
						const handleAuthError = event => {
							if (event.detail.email === inputValue) {
								window.removeEventListener(
									'maxiEmailAuthError',
									handleAuthError
								);
								setIsVerifying(false);
								setAuthMessage(
									event.detail.message ||
										'Authentication failed. Please check your credentials.'
								);
							}
						};

						window.addEventListener(
							'maxiEmailAuthSuccess',
							handleAuthSuccess
						);

						window.addEventListener(
							'maxiEmailAuthError',
							handleAuthError
						);

						// Also listen for errors or timeout
						setTimeout(() => {
							window.removeEventListener(
								'maxiEmailAuthSuccess',
								handleAuthSuccess
							);
							window.removeEventListener(
								'maxiEmailAuthError',
								handleAuthError
							);
							if (isVerifying) {
								setIsVerifying(false);
								setAuthMessage(
									'Authentication timeout. Please try again.'
								);
							}
						}, 600000); // 10 minutes timeout
					}
				} catch (error) {
					setIsVerifying(false);
					setAuthMessage(
						'Authentication failed. Please check your credentials.'
					);
				}
			} else {
				// Invalid email - show error message
				setEmailNotValid(true);
				setAuthMessage('');
			}
		} else if (inputType === 'code') {
			// Use new purchase code auth flow
			setIsVerifying(true);

			try {
				const domain = getCurrentDomain();
				const result = await verifyPurchaseCode(inputValue, domain);

				if (onClickConnectCode) {
					// Always pass result to parent - let parent handle success/error
					onClickConnectCode(inputValue, result);
				}
			} finally {
				setIsVerifying(false);
			}
		}
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
								{__('✓ Active: ', 'maxi-blocks')}
								<span
									className='maxi-username'
									title={
										isValidEmail(userName)
											? clickCount % 2 !== 0
												? __(
														'Click to hide',
														'maxi-blocks'
												  )
												: __(
														'Click to show',
														'maxi-blocks'
												  )
											: undefined
									}
									onClick={
										isValidEmail(userName)
											? () => {
													setClickCount(
														prevCount =>
															prevCount + 1
													);
											  }
											: undefined
									}
									style={{
										cursor: isValidEmail(userName)
											? 'pointer'
											: 'default',
									}}
								>
									{isValidEmail(userName)
										? clickCount % 2 !== 0
											? userName
											: '******@***.***'
										: userName === 'Maxiblocks'
										? 'MaxiBlocks'
										: userName}
								</span>
								{isNetworkLicenseActive && (
									<span className='maxi-network-license-notice'>
										{' '}
										Visit the{' '}
										<a
											href={
												licenseSettings.networkAdminUrl ||
												'/wp-admin/network/admin.php?page=maxi-blocks-dashboard'
											}
											target='_blank'
											rel='noopener noreferrer'
										>
											Network License page
										</a>{' '}
										to manage.
									</span>
								)}
							</h5>
							{!isNetworkLicenseActive && (
								<Button
									key='maxi-cloud-toolbar__button__sing-out'
									className='maxi-cloud-container__patterns__top-menu__button-go-pro'
									label={__(
										'Deactivate Cloud',
										'maxi-blocks'
									)}
									onClick={() => {
										onLogOut(true);
										onLogOut();
									}}
									disabled={isLoading}
								>
									{isLoading
										? __('Please wait...', 'maxi-blocks')
										: __('Deactivate Cloud', 'maxi-blocks')}
								</Button>
							)}
						</div>
					)}
					{!isMaxiProActive && userName && isMaxiProExpired && (
						<div className='maxi-cloud-toolbar__sign-in'>
							<h5 className='maxi-cloud-container__patterns__top-menu__text_pro'>
								{__('Expired: ', 'maxi-blocks')}
								<span className='maxi-username'>
									{userName}
								</span>
							</h5>
							<Button
								key='maxi-cloud-toolbar__button__connect'
								className='maxi-cloud-container__patterns__top-menu__button-connect-pro'
								label={
									isVerifying
										? __('Verifying…', 'maxi-blocks')
										: __('Activate Cloud', 'maxi-blocks')
								}
								onClick={() => onClickAuth()}
								disabled={isVerifying}
							>
								{isVerifying
									? __('Verifying…', 'maxi-blocks')
									: __('Activate Cloud', 'maxi-blocks')}
							</Button>
						</div>
					)}
					{!isMaxiProActive && userName && !isMaxiProExpired && (
						<div className='maxi-cloud-toolbar__sign-in'>
							<h5 className='maxi-cloud-container__patterns__top-menu__text_pro'>
								<span className='maxi-username'>
									{userName}
								</span>
							</h5>
							<Button
								key='maxi-cloud-toolbar__button__sing-out'
								className='maxi-cloud-container__patterns__top-menu__button-go-pro'
								label={__('Deactivate Cloud', 'maxi-blocks')}
								onClick={() => {
									onLogOut(true);
									onLogOut();
								}}
								disabled={isLoading}
							>
								{isLoading
									? __('Please wait...', 'maxi-blocks')
									: __('Deactivate Cloud', 'maxi-blocks')}
							</Button>
						</div>
					)}
					{type === 'starter-sites' && !isMaxiProActive && !userName && (
						<div className='maxi-cloud-toolbar__sign-in'>
							{isNetworkLicenseActive ? (
								<div className='maxi-cloud-toolbar__network-license-info'>
									<h5 className='maxi-cloud-container__patterns__top-menu__text_pro'>
										{__(
											'✓ Active: Network License',
											'maxi-blocks'
										)}{' '}
										Visit the{' '}
										<a
											href={
												licenseSettings.networkAdminUrl ||
												'/wp-admin/network/admin.php?page=maxi-blocks-dashboard'
											}
											target='_blank'
											rel='noopener noreferrer'
										>
											Network License page
										</a>{' '}
										to manage.
									</h5>
								</div>
							) : (
								<>
									<div className='maxi-cloud-container__patterns__top-menu__input'>
										<TextControl
											placeholder={__(
												'Cloud user email / purchase code / license key',
												'maxi-blocks'
											)}
											value={userEmail}
											onChange={value =>
												setUserEmail(value)
											}
										/>
										{emailNotValid && (
											<span>
												{__(
													'The email is not valid',
													'maxi-blocks'
												)}
											</span>
										)}
										{showAuthError && (
											<span>
												{__(
													'Authentication failed. Please check your credentials.',
													'maxi-blocks'
												)}
											</span>
										)}
										{authMessage && (
											<span>{authMessage}</span>
										)}
									</div>
									<Button
										key='maxi-cloud-toolbar__button__connect'
										className='maxi-cloud-container__patterns__top-menu__button-connect-pro'
										label={
											isVerifying
												? __(
														'Verifying…',
														'maxi-blocks'
												  )
												: __(
														'Activate Cloud',
														'maxi-blocks'
												  )
										}
										onClick={() => onClickAuth()}
										disabled={isVerifying}
									>
										{isVerifying
											? __('Verifying…', 'maxi-blocks')
											: __(
													'Activate Cloud',
													'maxi-blocks'
											  )}
									</Button>
								</>
							)}
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
					{isQuickStart && (
						<div className='maxi-cloud-toolbar__buttons-group_close'>
							<ToolbarButton
								className='components-button is-small'
								onClick={() =>
									document
										.getElementById(
											'maxi-starter-sites-root'
										)
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
