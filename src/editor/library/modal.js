/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	RawHTML,
	useEffect,
	useState,
	forwardRef,
	useRef,
} from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
// eslint-disable-next-line import/no-cycle
import CloudLibrary from '.';
import { Icon, BaseControl, Button } from '@components';
import {
	authConnect,
	isProSubActive,
	isProSubExpired,
	isValidEmail,
	getUserName,
	logOut,
	processLocalPurchaseCodeActivation,
	checkAndHandleDomainMigration,
} from '@editor/auth';
import useObserveBlockSize from './hooks';
import { isSVGColorLight } from './util';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import classNames from 'classnames';

/**
 * Icons
 */
import { toolbarReplaceImage, remove, cloudLib, selectIcon } from '@maxi-icons';

/**
 * Cloud Content Placeholder
 */
const CloudPlaceholder = forwardRef((props, ref) => {
	const { clientId, onClick } = props;

	const { isBlockSmall, isBlockSmaller } = useObserveBlockSize(ref, true);

	return (
		<Button
			key={`maxi-block-library__modal-button--${clientId}`}
			isPrimary
			className={classNames(
				'maxi-block-library__modal-button__placeholder',
				isBlockSmall &&
					'maxi-block-library__modal-button__placeholder--small',
				isBlockSmaller &&
					'maxi-block-library__modal-button__placeholder--smaller'
			)}
			onClick={onClick}
		>
			<Icon
				className='maxi-library-block__select__icon'
				icon={cloudLib}
			/>
			{!isBlockSmall && __('Cloud library', 'maxi-blocks')}
		</Button>
	);
});

/**
 * SVG Icon Placeholder
 */
const SVGIconPlaceholder = forwardRef((props, ref) => {
	const { uniqueID, clientId, onClick } = props;

	const { isBlockSmall, isBlockSmaller } = useObserveBlockSize(ref);

	return (
		<div
			className={classNames(
				'maxi-svg-icon-block__placeholder',
				isBlockSmall && 'maxi-svg-icon-block__placeholder--small',
				isBlockSmaller && 'maxi-svg-icon-block__placeholder--smaller'
			)}
			key={`maxi-svg-icon-block__placeholder--${uniqueID}`}
		>
			<Button
				isPrimary
				key={`maxi-block-library__modal-button--${clientId}`}
				className='maxi-block-library__modal-button'
				onClick={onClick}
			>
				<Icon
					className='maxi-icon-block__select__icon'
					icon={selectIcon}
				/>
				{!isBlockSmall && __('Select icon', 'maxi-blocks')}
			</Button>
		</div>
	);
});
/**
 * Layout modal window with tab panel.
 */
const MaxiModal = props => {
	const {
		type,
		clientId,
		style,
		openFirstTime,
		isOpen: forceIsOpen,
		onOpen = null,
		onRemove,
		onSelect,
		onClose,
		icon,
		forceHide = false,
		url,
		title,
		cost,
		toneUrl,
		cardId,
		prefix = '',
		label = '',
		isPro,
		isBeta,
		gutenbergCode,
		isSwapChecked,
		layerOrder,
	} = props;

	const ref = useRef(null);
	const [isOpen, changeIsOpen] = useState(
		openFirstTime || forceIsOpen || false
	);
	const [wasOpenedFirstTime, changeOpenedFirstTime] = useState(openFirstTime);

	useEffect(() => {
		if (forceIsOpen) changeIsOpen(forceIsOpen);
	}, [forceIsOpen]);

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

	// Update state when store data changes or when modal opens
	useEffect(() => {
		if (hasProData) {
			setIsMaxiProActive(isProSubActive());
			setIsMaxiProExpired(isProSubExpired());
			setUserName(getUserName());
		}
	}, [proStatus, hasProData, type, isOpen]);

	// Additional check for network license when modal opens
	useEffect(() => {
		if (isOpen) {
			const licenseSettings = window.maxiLicenseSettings || {};
			if (
				licenseSettings.isMultisite &&
				licenseSettings.hasNetworkLicense
			) {
				setIsMaxiProActive(true);
				setIsMaxiProExpired(false);
				setUserName(
					licenseSettings.networkLicenseName || 'Marketplace'
				);
			} else {
				// Check current authentication status and sync with server
				// This ensures the UI reflects the actual auth state
				const syncAuthState = async () => {
					// Force a check of the current auth state
					await authConnect(false);
					setIsMaxiProActive(isProSubActive());
					setIsMaxiProExpired(isProSubExpired());
					setUserName(getUserName());
				};
				syncAuthState();
			}
		}
	}, [isOpen]);

	const onClickConnect = async email => {
		const isValid = isValidEmail(email);
		if (isValid) {
			setShowNotValidEmail(false);
			setShowAuthError(false);

			await authConnect(false, email); // Initial call
			setIsMaxiProActive(isProSubActive());
			setIsMaxiProExpired(isProSubExpired());
			setUserName(getUserName());

			// Start a periodic check
			const intervalId = setInterval(async () => {
				const result = await authConnect(false, email);
				if (result) {
					// Assuming authConnect returns a truthy value on success
					setIsMaxiProActive(isProSubActive());
					setIsMaxiProExpired(isProSubExpired());
					setUserName(getUserName());
					clearInterval(intervalId); // Clear the interval once authenticated
				}
			}, 1000); // Check every 5 seconds, adjust as needed
		} else {
			setShowNotValidEmail(true);
			setShowAuthError(false);
		}
	};

	/**
	 * Handles purchase code authentication
	 * @param {string} purchaseCode       - The purchase code
	 * @param {Object} verificationResult - Result from middleware
	 */
	const onClickConnectCode = async (purchaseCode, verificationResult) => {
		try {
			setShowNotValidEmail(false);
			setShowAuthError(false);

			// Check if verification was successful
			if (
				verificationResult &&
				verificationResult.success &&
				verificationResult.valid
			) {
				// Get current domain
				const domain = window.location.hostname;

				// Save purchase code activation
				processLocalPurchaseCodeActivation(
					purchaseCode,
					domain,
					verificationResult,
					'yes'
				);

				// Update states
				setIsMaxiProActive(isProSubActive());
				setIsMaxiProExpired(isProSubExpired());
				setUserName(getUserName());
			} else {
				// Show authentication error for failed verification
				console.error(
					JSON.stringify({
						message: __(
							'Purchase code verification failed',
							'maxi-blocks'
						),
						error:
							verificationResult?.error ||
							verificationResult?.message ||
							__('Unknown error', 'maxi-blocks'),
					})
				);
				setShowAuthError(true);
			}
		} catch (error) {
			console.error(
				JSON.stringify({
					message: __(
						'Purchase code authentication error',
						'maxi-blocks'
					),
					error: error.message,
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

	const onClick = () => {
		changeIsOpen(!isOpen);

		if (onOpen) onOpen({ openFirstTime: !isOpen });
		if (onClose) onClose();
	};

	const onCloseModal = () => {
		changeIsOpen(false);
		changeOpenedFirstTime(false);
	};

	useEffect(() => {
		if (isOpen) {
			checkAndHandleDomainMigration();
		}
	}, [isOpen]);

	return (
		<div ref={ref} className='maxi-library-modal__action-section'>
			{!isEmpty(label) && (
				<BaseControl.VisualLabel className='maxi-library-modal__action-section__label'>
					{label}
				</BaseControl.VisualLabel>
			)}
			<div className='maxi-library-modal__action-section__buttons'>
				{type === 'patterns' && (
					<CloudPlaceholder
						ref={ref}
						clientId={clientId}
						onClick={onClick}
					/>
				)}
				{type === 'sc' && (
					<Button
						className='maxi-style-cards__sc__more-sc--add-more'
						onClick={onClick}
					>
						{__('Browse style cards', 'maxi-blocks')}
					</Button>
				)}
				{type === 'svg' && forceHide && (
					<SVGIconPlaceholder
						ref={ref}
						clientId={clientId}
						onClick={onClick}
					/>
				)}
				{type === 'svg' && !forceHide && (
					<Button
						className='maxi-svg-icon-block__replace-icon'
						onClick={onClick}
						icon={toolbarReplaceImage}
					/>
				)}
				{(type === 'bg-shape' ||
					type === 'image-shape' ||
					type === 'sidebar-block-shape') && (
					<Button
						className='maxi-library-modal__action-section__buttons__load-library'
						onClick={onClick}
					>
						{__('Load shape library', 'maxi-blocks')}
					</Button>
				)}
				{(type === 'button-icon' ||
					type === 'search-icon' ||
					type.includes('video-icon')) && (
					<Button
						className='maxi-library-modal__action-section__buttons__load-library'
						onClick={onClick}
					>
						{isEmpty(icon)
							? __('Add Icon', 'maxi-blocks')
							: __('Replace Icon', 'maxi-blocks')}
					</Button>
				)}
				{type === 'navigation-icon' && (
					<Button
						className='maxi-library-modal__action-section__buttons__load-library'
						onClick={onClick}
					>
						{isEmpty(icon)
							? __('Add icon', 'maxi-blocks')
							: __('Replace icon', 'maxi-blocks')}
					</Button>
				)}
				{(type === 'accordion-icon' ||
					type === 'accordion-icon-active') && (
					<>
						<Button
							className='maxi-library-modal__action-section__buttons__load-library'
							onClick={onClick}
						>
							{__('Load icon library', 'maxi-blocks')}
						</Button>
						{!isEmpty(icon) && (
							<div className='maxi-library-modal__action-section__preview'>
								<Icon
									className='maxi-library-modal__action-section__preview--remove'
									icon={remove}
									onClick={() =>
										onRemove({
											[type === 'accordion-icon'
												? 'icon-content'
												: 'active-icon-content']: '',
										})
									}
								/>
								<RawHTML className='maxi-library-modal__action-section__preview__icon'>
									{icon}
								</RawHTML>
							</div>
						)}
					</>
				)}
				{type === 'preview' && (
					<Button
						className='maxi-cloud-masonry-card__button'
						onClick={onClick}
					>
						{__('Preview', 'maxi-blocks')}
					</Button>
				)}
				{isOpen && (
					<div
						className='components-modal__screen-overlay maxi-open-preview'
						id='maxi-modal'
					>
						<div className='maxi-library-modal maxi-preview'>
							<CloudLibrary
								className={`maxi-library-modal__${type}`}
								cloudType={type}
								onClose={onClick}
								blockStyle={style}
								onSelect={onSelect}
								url={url}
								title={title}
								cost={cost}
								isPro={isPro}
								isBeta={isBeta}
								toneUrl={toneUrl}
								cardId={cardId}
								prefix={prefix}
								gutenbergCode={gutenbergCode}
								isSwapChecked={isSwapChecked}
								isMaxiProActive={isMaxiProActive}
								isMaxiProExpired={isMaxiProExpired}
								onClickConnect={onClickConnect}
								onClickConnectCode={onClickConnectCode}
								showNotValidEmail={showNotValidEmail}
								showAuthError={showAuthError}
								userName={userName}
								onLogOut={onLogOut}
								layerOrder={layerOrder}
							/>
						</div>
					</div>
				)}
			</div>
			{type === 'button-icon' && !isEmpty(icon) && (
				<div className='maxi-library-modal__action-section__preview'>
					<Icon
						className='maxi-library-modal__action-section__preview--remove'
						icon={remove}
						onClick={() =>
							onRemove({
								'icon-content': '',
								'icon-only': false,
							})
						}
					/>
					<RawHTML className='maxi-library-modal__action-section__preview__icon'>
						{icon}
					</RawHTML>
				</div>
			)}
			{(type === 'navigation-icon' || type === 'search-icon') &&
				!isEmpty(icon) && (
					<div className='maxi-library-modal__action-section__preview'>
						<Icon
							className='maxi-library-modal__action-section__preview--remove'
							icon={remove}
							onClick={() =>
								onRemove({
									[`${prefix}icon-content`]: '',
								})
							}
						/>
						<RawHTML className='maxi-library-modal__action-section__preview__icon'>
							{icon}
						</RawHTML>
					</div>
				)}
			{type === 'bg-shape' && !isEmpty(icon) && (
				<div
					className={classNames(
						'maxi-library-modal__action-section__preview',
						isSVGColorLight(icon) &&
							'maxi-library-modal__action-section__preview--light'
					)}
				>
					<Icon
						className='maxi-library-modal__action-section__preview--remove'
						icon={remove}
						onClick={() => {
							onRemove({
								'background-svg-SVGElement': '',
							});
						}}
					/>
					<RawHTML className='maxi-library-modal__action-section__preview__shape'>
						{icon}
					</RawHTML>
				</div>
			)}
			{type === 'image-shape' && !isEmpty(icon) && (
				<div className='maxi-library-modal__action-section__preview'>
					<Icon
						className='maxi-library-modal__action-section__preview--remove'
						icon={remove}
						onClick={() =>
							onRemove({
								SVGElement: '',
								SVGData: {},
							})
						}
					/>
					<RawHTML className='maxi-library-modal__action-section__preview__shape'>
						{icon}
					</RawHTML>
				</div>
			)}
			{type.includes('video-icon') && !isEmpty(icon) && (
				<div className='maxi-library-modal__action-section__preview'>
					<Icon
						className='maxi-library-modal__action-section__preview--remove'
						icon={remove}
						onClick={() =>
							onRemove({
								[`${prefix}icon-content`]: '',
							})
						}
					/>
					<RawHTML className='maxi-library-modal__action-section__preview__icon'>
						{icon}
					</RawHTML>
				</div>
			)}
			{type === 'switch-tone' && (isOpen || wasOpenedFirstTime) && (
				<div className='components-modal__screen-overlay maxi-open-preview maxi-switch-tone'>
					<div className='maxi-library-modal maxi-preview'>
						<CloudLibrary
							cloudType={type}
							onClose={onCloseModal}
							url={url}
							title={title}
							cost={cost}
							toneUrl={toneUrl}
							cardId={cardId}
							prefix={prefix}
							className={`maxi-library-modal__preview maxi-library-modal__${type}`}
							isPro={isPro}
							isBeta={isBeta}
							onSelect={onSelect}
							gutenbergCode={gutenbergCode}
							isSwapChecked={isSwapChecked}
							isMaxiProActive={isMaxiProActive}
							isMaxiProExpired={isMaxiProExpired}
							onClickConnect={onClickConnect}
							onClickConnectCode={onClickConnectCode}
							showNotValidEmail={showNotValidEmail}
							showAuthError={showAuthError}
							userName={userName}
							onLogOut={onLogOut}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default MaxiModal;
