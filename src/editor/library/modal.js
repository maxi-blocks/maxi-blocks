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
} from '@editor/auth';
import useObserveBlockSize from './hooks';

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
	const { clientId, onClick } = props;

	const { isBlockSmall, isBlockSmaller } = useObserveBlockSize(ref, true);

	return (
		<Button
			key={`maxi-svg-icon-library__modal-button--${clientId}`}
			isPrimary
			className={classNames(
				'maxi-svg-icon-library__modal-button__placeholder',
				isBlockSmall &&
					'maxi-svg-icon-library__modal-button__placeholder--small',
				isBlockSmaller &&
					'maxi-svg-icon-library__modal-button__placeholder--smaller'
			)}
			onClick={onClick}
		>
			<Icon
				className='maxi-library-block__select__icon'
				icon={selectIcon}
			/>
			{!isBlockSmall && __('Cloud library', 'maxi-blocks')}
		</Button>
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

	// Update state when store data changes
	useEffect(() => {
		if (hasProData) {
			setIsMaxiProActive(isProSubActive());
			setIsMaxiProExpired(isProSubExpired());
			setUserName(getUserName());
		}
	}, [proStatus, hasProData, type]);

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

			if (verificationResult.success && verificationResult.valid) {
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

				console.log('Purchase code authentication successful');
			} else {
				console.error(
					'Purchase code verification failed:',
					verificationResult.error || verificationResult.message
				);
				setShowAuthError(true);
			}
		} catch (error) {
			console.error('Purchase code authentication error:', error);
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
