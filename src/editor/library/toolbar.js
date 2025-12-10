/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	library,
	help,
	fullScreen,
	closeIcon,
	largeMode,
	mediumMode,
	smallMode,
} from '@maxi-icons';
import onRequestInsertPattern from './utils/onRequestInsertPattern';
import { Button, TextControl } from '@components';
import { isValidEmail, authConnect } from '@editor/auth';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { SearchClient as TypesenseSearchClient } from 'typesense';
import { isNil, isEmpty } from 'lodash';

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
	const middlewareUrl = process.env.REACT_APP_MAXI_BLOCKS_AUTH_MIDDLEWARE_URL;
	const middlewareKey = process.env.REACT_APP_MAXI_BLOCKS_AUTH_MIDDLEWARE_KEY;

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
const ToolbarButton = props => {
	const { label, onClick, icon, className, isSelected } = props;

	const classes = classnames('maxi-cloud-toolbar__button', className);

	return (
		<button
			className={classes}
			onClick={onClick}
			aria-pressed={isSelected}
			type='button'
		>
			{icon}
			<span>{label === 'Pro' ? __('Cloud', 'maxi-blocks') : label}</span>
		</button>
	);
};

const LibraryToolbar = props => {
	const {
		type,
		onChange,
		onRequestClose,
		title = '',
		cost = '',
		toneUrl,
		isMaxiProActive,
		isMaxiProExpired,
		isPro,
		isBeta,
		gutenbergCode,
		onInsert,
		isSwapChecked,
		useSCStyles,
		onChangeTone,
		userName,
		onLogOut,
		onClickConnect,
		showNotValidEmail,
		showAuthError,
		onClickConnectCode,
	} = props;

	const apiKey = process.env.REACT_APP_TYPESENSE_API_KEY;
	const apiHost = process.env.REACT_APP_TYPESENSE_API_URL;
	const [userEmail, setUserEmail] = useState(false);
	const [clickCount, setClickCount] = useState(0);
	const [isVerifying, setIsVerifying] = useState(false);
	const [authErrorMessage, setAuthErrorMessage] = useState('');
	const [authMessage, setAuthMessage] = useState('');

	// Listen for authentication events
	useEffect(() => {
		const handleAuthError = event => {
			setAuthErrorMessage(
				event.detail.error || __('Authentication failed', 'maxi-blocks')
			);
			setAuthMessage('');
			setIsVerifying(false);
		};

		const handleAuthSuccess = event => {
			setAuthErrorMessage('');
			setAuthMessage('');
			setIsVerifying(false);
			if (onClickConnect) {
				onClickConnect(event.detail.email);
			}
		};

		window.addEventListener('maxiEmailAuthError', handleAuthError);
		window.addEventListener('maxiEmailAuthSuccess', handleAuthSuccess);

		return () => {
			window.removeEventListener('maxiEmailAuthError', handleAuthError);
			window.removeEventListener(
				'maxiEmailAuthSuccess',
				handleAuthSuccess
			);
		};
	}, [onClickConnect]);

	// Check for network license status
	const licenseSettings = window.maxiLicenseSettings || {};
	const { isMultisite, hasNetworkLicense } = licenseSettings;
	const isNetworkLicenseActive = isMultisite && hasNetworkLicense;

	const client = new TypesenseSearchClient({
		nodes: [
			{
				host: apiHost,
				port: '443',
				protocol: 'https',
			},
		],
		apiKey,
		connectionTimeoutSeconds: 2,
	});

	const buttons = [
		{ label: __('Style Cards', 'maxi-blocks'), value: 'styleCards' },
		{ label: __('Pages', 'maxi-blocks'), value: 'pages' },
		{ label: __('Block Patterns', 'maxi-blocks'), value: 'patterns' },
		{ label: __('Global', 'maxi-blocks'), value: 'global' },
		{ label: __('Blocks', 'maxi-blocks'), value: 'blocks' },
		{ label: __('Preview', 'maxi-blocks'), value: 'preview' },
	];

	function addClass(elements, className) {
		for (let i = 0; i < elements.length; i += 1) {
			const element = elements[i];
			if (element.classList) {
				element.classList.add(className);
			} else {
				element.className += ` ${className}`;
			}
		}
	}

	function removeClass(elements, className) {
		for (let i = 0; i < elements.length; i += 1) {
			const element = elements[i];
			if (element.classList) {
				element.classList.remove(className);
			} else {
				element.className = element.className.replace(
					new RegExp(
						`(^|\\b)${className.split(' ').join('|')}(\\b|$)`,
						'gi'
					),
					' '
				);
			}
		}
	}

	document.addEventListener('fullscreenchange', event => {
		if (!document.fullscreenElement) {
			removeClass(
				document.getElementsByClassName('maxi-cloud-toolbar'),
				'maxi-cloud-toolbar__fullwidth'
			);
			removeClass(
				document.getElementsByClassName(
					'maxi-cloud-toolbar__button-fullwidth'
				),
				'maxi-cloud-toolbar__button_active'
			);
		} else {
			addClass(
				document.getElementsByClassName('maxi-cloud-toolbar'),
				'maxi-cloud-toolbar__fullwidth'
			);
			addClass(
				document.getElementsByClassName(
					'maxi-cloud-toolbar__button-fullwidth'
				),
				'maxi-cloud-toolbar__button_active'
			);
		}
	});

	const goFullScreen = () => {
		const modal = document.getElementsByClassName(
			'maxi-library-modal maxi-library-modal__preview'
		)[0];

		const elem = modal?.getElementsByClassName(
			'components-modal__content'
		)[0];

		if (!document.fullscreenElement) {
			elem.requestFullscreen().catch(err => {
				console.warn(
					`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
				);
			});
		} else {
			document.exitFullscreen();
		}
	};

	const { getSelectedBlockClientId } = select('core/block-editor');
	const clientId = getSelectedBlockClientId();

	const openRelatedPattern = () => {
		let relatedSerial = toneUrl.toLowerCase();

		if (toneUrl.includes('/')) {
			const parts = toneUrl.replace(/:$/, '').split('/');
			relatedSerial = parts.pop() || parts.pop();
		}

		const searchParameters = {
			q: relatedSerial,
			query_by: 'post_number',
			per_page: 1,
		};

		let fullWidth = false;
		if (document.fullscreenElement) {
			fullWidth = true;
		}

		client
			.collections('post')
			.documents()
			.search(searchParameters)
			.then(result => {
				const relatedHit = result?.hits[0]?.document;

				window.setTimeout(() => {
					if (fullWidth) {
						const modal = document.getElementsByClassName(
							'maxi-library-modal maxi-preview'
						)[0];
						const elem = modal?.getElementsByClassName(
							'components-modal__content'
						)[0];
						elem.requestFullscreen().catch(err => {
							console.warn(
								`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
							);
						});
					}
				}, 100);

				onChangeTone(relatedHit);
			});
	};

	const goResponsive = mode => {
		const modal = document.getElementsByClassName(
			'maxi-library-modal__preview'
		)[0];

		if (!modal) return;

		const previewIframe = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-iframe_wrap'
		)[0];

		const previewIframeContainer = modal?.getElementsByClassName(
			'maxi-cloud-container'
		)[0];

		const previewIframeWrap = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-iframe_main-wrap'
		)[0];

		const previewIframeSpace = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-iframe_space'
		)[0];

		const previewModalContent = modal?.getElementsByClassName(
			'components-modal__content'
		)[0];

		if (!previewIframe) return;

		let iframeWidth = '100%';
		let iframeHeight = '100%';

		const labelTablet = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-tablet__label'
		)[0];

		const labelMobile = modal?.getElementsByClassName(
			'maxi-cloud-container__preview-mobile__label'
		)[0];

		function addClass(elements, className) {
			for (let i = 0; i < elements.length; i += 1) {
				const element = elements[i];
				if (element.classList) {
					element.classList.add(className);
				} else {
					element.className += ` ${className}`;
				}
			}
		}

		function removeClass(elements, className) {
			for (let i = 0; i < elements.length; i += 1) {
				const element = elements[i];
				if (element.classList) {
					element.classList.remove(className);
				} else {
					element.className = element.className.replace(
						new RegExp(
							`(^|\\b)${className.split(' ').join('|')}(\\b|$)`,
							'gi'
						),
						' '
					);
				}
			}
		}

		switch (mode) {
			case 't':
				iframeWidth = '768px';
				iframeHeight = '1024px';
				previewIframe.style.outline = '#96b0cb  30px solid';
				previewIframe.style['border-radius'] = '15px';
				labelTablet.style.display = 'block';
				labelMobile.style.display = 'none';
				previewIframeSpace.style.height = '20px';
				previewIframeContainer.style.overflowY = 'scroll';
				previewIframe.style.margin = '50px auto 35px auto';
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-desktop'
					),
					'maxi-cloud-toolbar__button_active'
				);
				addClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-tablet'
					),
					'maxi-cloud-toolbar__button_active'
				);
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-mobile'
					),
					'maxi-cloud-toolbar__button_active'
				);
				break;
			case 'm':
				iframeWidth = '390px';
				iframeHeight = '844px';
				previewIframe.style.outline = '#96b0cb  30px solid';
				previewIframe.style['border-radius'] = '15px';
				labelTablet.style.display = 'none';
				labelMobile.style.display = 'block';
				previewIframeSpace.style.height = '20px';
				previewIframe.style.margin = '50px auto 35px auto';
				previewIframeContainer.style.overflowY = 'scroll';
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-desktop'
					),
					'maxi-cloud-toolbar__button_active'
				);
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-tablet'
					),
					'maxi-cloud-toolbar__button_active'
				);
				addClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-mobile'
					),
					'maxi-cloud-toolbar__button_active'
				);
				break;
			default:
				previewIframe.style.outline = 'none';
				previewIframe.style['border-radius'] = 0;
				labelTablet.style.display = 'none';
				labelMobile.style.display = 'none';
				previewIframeSpace.style.height = '0px';
				previewModalContent.style.overflowY = 'hidden';
				previewIframe.style.margin = '0 auto 35px auto';
				previewIframeContainer.style.overflowY = 'hidden';
				addClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-desktop'
					),
					'maxi-cloud-toolbar__button_active'
				);
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-tablet'
					),
					'maxi-cloud-toolbar__button_active'
				);
				removeClass(
					document.getElementsByClassName(
						'maxi-cloud-toolbar__button-mobile'
					),
					'maxi-cloud-toolbar__button_active'
				);
				break;
		}

		previewIframe.style.width = iframeWidth;
		previewIframe.style.height = iframeHeight;
		previewIframeWrap.style.left = 0;
		previewIframeWrap.style.right = 0;
	};

	/**
	 * Handles authentication based on input type (email or purchase code)
	 */
	const onClickAuth = async () => {
		const inputValue = userEmail;
		if (!inputValue || isVerifying) return;

		// Clear any previous messages
		setAuthErrorMessage('');
		setAuthMessage('');

		const inputType = detectInputType(inputValue);

		if (inputType === 'email') {
			// Use WordPress AJAX email auth flow (same as admin.js and starter sites)
			if (isValidEmail(inputValue)) {
				// Open the login tab first
				const encodedEmail = encodeURIComponent(inputValue);
				const url = `https://my.maxiblocks.com/login?plugin&email=${encodedEmail}`;
				window.open(url, '_blank')?.focus();

				setIsVerifying(true);

				try {
					// Use the WordPress AJAX authentication flow
					const authResult = await authConnect(true, inputValue);

					if (authResult && authResult.success) {
						// Authentication completed immediately (existing valid auth)
						setIsVerifying(false);
						setAuthMessage('');
						if (onClickConnect) {
							onClickConnect(inputValue);
						}
					} else if (authResult && authResult.error) {
						// Handle immediate errors
						setIsVerifying(false);
						setAuthErrorMessage(
							authResult.error_message ||
								'Authentication failed. Please check your credentials.'
						);
					} else {
						// Authentication initiated, user needs to log in
						setAuthMessage(
							'Please log into your MaxiBlocks account to complete activation'
						);
						// Events will handle completion/errors
					}
				} catch (error) {
					setIsVerifying(false);
					setAuthErrorMessage(
						'Authentication failed. Please check your credentials.'
					);
				}
			} else if (onClickConnect) {
				// Invalid email - let parent handle validation and show error
				onClickConnect(inputValue);
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
			{type !== 'preview' && type !== 'switch-tone' && (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a className='maxi-cloud-toolbar__logo'>{library}</a>
			)}
			{(type === 'preview' || type === 'switch-tone') && (
				<>
					<div className='maxi-cloud-toolbar__buttons-group'>
						<ToolbarButton
							label={__('Back', 'maxi-blocks')}
							onClick={onRequestClose}
						/>
						<h2>{title}</h2>
						<span className='maxi-cloud-toolbar__line'>|</span>
						<span>
							{cost === 'Pro' ? __('Cloud', 'maxi-blocks') : cost}
						</span>
						{!isNil(toneUrl) && !isEmpty(toneUrl) && (
							<ToolbarButton
								onClick={() => {
									openRelatedPattern();
								}}
								label={__('Switch tone', 'maxi-blocks')}
							/>
						)}
					</div>
					<div className='maxi-cloud-toolbar__responsive-buttons'>
						<ToolbarButton
							className='maxi-cloud-toolbar__button-fullwidth'
							onClick={goFullScreen}
							icon={fullScreen}
							label={__('Full screen', 'maxi-blocks')}
						/>
						<ToolbarButton
							className='maxi-cloud-toolbar__button-desktop maxi-cloud-toolbar__button_active'
							onClick={() => {
								goResponsive('d');
							}}
							icon={largeMode}
							label={__('Desktop', 'maxi-blocks')}
						/>
						<ToolbarButton
							className='maxi-cloud-toolbar__button-tablet'
							onClick={() => {
								goResponsive('t');
							}}
							icon={mediumMode}
							label={__('Tablet', 'maxi-blocks')}
						/>
						<ToolbarButton
							className='maxi-cloud-toolbar__button-mobile'
							onClick={() => {
								goResponsive('m');
							}}
							icon={smallMode}
							label={__('Mobile', 'maxi-blocks')}
						/>
					</div>
				</>
			)}
			{type === 'all' && (
				<div>
					{buttons.map(button => (
						<ToolbarButton
							key={`maxi-cloud-toolbar__button__${button.value}`}
							label={button.label}
							onClick={() => onChange(button.value)}
							isSelected={type === button.value}
						/>
					))}
				</div>
			)}
			{type === 'patterns' && isMaxiProActive && userName && (
				<div className='maxi-cloud-toolbar__sign-in'>
					<h5 className='maxi-cloud-container__patterns__top-menu__text_pro'>
						{__('✓ Active: ', 'maxi-blocks')}
						<span
							className='maxi-username'
							title={
								isValidEmail(userName)
									? clickCount % 2 !== 0
										? __('Click to hide', 'maxi-blocks')
										: __('Click to show', 'maxi-blocks')
									: undefined
							}
							onClick={
								isValidEmail(userName)
									? event => {
											setClickCount(
												prevCount => prevCount + 1
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
							label={__('Deactivate Cloud', 'maxi-blocks')}
							onClick={() => {
								onLogOut(true);
								onLogOut();
							}}
						>
							{__('Deactivate Cloud', 'maxi-blocks')}
						</Button>
					)}
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
						<span className='maxi-username'>{userName}</span>
					</h5>
					<Button
						key='maxi-cloud-toolbar__button__sing-out'
						className='maxi-cloud-container__patterns__top-menu__button-go-pro'
						label={__('Deactivate Cloud', 'maxi-blocks')}
						onClick={onLogOut}
					>
						{__('Deactivate Cloud', 'maxi-blocks')}
					</Button>
				</div>
			)}
			{type === 'patterns' && !isMaxiProActive && !userName && (
				<div className='maxi-cloud-toolbar__sign-in'>
					{isNetworkLicenseActive ? (
						<div className='maxi-cloud-toolbar__network-license-info'>
							<h5 className='maxi-cloud-container__patterns__top-menu__text_pro'>
								{__('✓ Active: Network License', 'maxi-blocks')}{' '}
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
										'Pro user email / purchase code / license key',
										'maxi-blocks'
									)}
									value={userEmail}
									onChange={value => {
										setUserEmail(value);
										setAuthErrorMessage(''); // Clear auth error when user types
										setAuthMessage(''); // Clear auth message when user types
									}}
								/>
								{showNotValidEmail && (
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
								{authErrorMessage && (
									<span>{authErrorMessage}</span>
								)}
								{authMessage && <span>{authMessage}</span>}
							</div>
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
						</>
					)}
				</div>
			)}

			{type !== 'preview' && type !== 'switch-tone' && (
				<a
					href='https://maxiblocks.com/go/help-center'
					target='_blank'
					rel='noopener noreferrer'
					className='maxi-cloud-toolbar__help-button'
				>
					{help}
					{__('Help', 'maxi-blocks')}
				</a>
			)}
			{(type === 'preview' || type === 'switch-tone') && (
				<div className='maxi-cloud-toolbar__buttons-group_close'>
					{(!isPro || isBeta || (isMaxiProActive && userName)) && (
						<ToolbarButton
							label={__('Insert', 'maxi-blocks')}
							onClick={async () => {
								onInsert();

								await onRequestInsertPattern(
									gutenbergCode,
									isSwapChecked,
									useSCStyles,
									clientId
								);
							}}
						/>
					)}
					<ToolbarButton onClick={onRequestClose} icon={closeIcon} />
				</div>
			)}
		</div>
	);
};

export default LibraryToolbar;
