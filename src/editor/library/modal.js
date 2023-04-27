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
import { resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
// eslint-disable-next-line import/no-cycle
import CloudLibrary from '.';
import { Icon, BaseControl, Button } from '../../components';
import {
	authConnect,
	isProSubActive,
	isProSubExpired,
	isValidEmail,
	getUserName,
	logOut,
	getMaxiCookieKey,
} from '../auth';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import classNames from 'classnames';

/**
 * Icons
 */
import { toolbarReplaceImage, remove, cloudLib, selectIcon } from '../../icons';

/**
 * Cloud Content Placeholder
 */
const CloudPlaceholder = forwardRef((props, ref) => {
	const { clientId, onClick } = props;

	const [isBlockSmall, setIsBlockSmall] = useState(null);
	const [isBlockSmaller, setIsBlockSmaller] = useState(null);

	const resizeObserver = new ResizeObserver(entries => {
		const newIsSmallBlock = entries[0].contentRect.width < 120;
		const newIsSmallerBlock = entries[0].contentRect.width < 38;

		if (newIsSmallBlock !== isBlockSmall) setIsBlockSmall(newIsSmallBlock);
		if (newIsSmallerBlock !== isBlockSmaller)
			setIsBlockSmaller(newIsSmallerBlock);
	});

	useEffect(() => {
		resizeObserver.observe(
			ref.current?.closest('.maxi-block-library__placeholder')
		);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

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
			{!isBlockSmall && __('Template library', 'maxi-blocks')}
		</Button>
	);
});

/**
 * Icon Content Placeholder
 */
const SVGIconPlaceholder = forwardRef((props, ref) => {
	const { uniqueID, clientId, onClick } = props;

	const [isBlockSmall, setIsBlockSmall] = useState(null);
	const [isBlockSmaller, setIsBlockSmaller] = useState(null);

	const resizeObserver = new ResizeObserver(entries => {
		const newIsSmallBlock = entries[0].contentRect.width < 120;
		const newIsSmallerBlock = entries[0].contentRect.width < 38;

		if (newIsSmallBlock !== isBlockSmall) setIsBlockSmall(newIsSmallBlock);
		if (newIsSmallerBlock !== isBlockSmaller)
			setIsBlockSmaller(newIsSmallerBlock);
	});

	useEffect(() => {
		resizeObserver.observe(ref.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

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

	const [isMaxiProActive, setIsMaxiProActive] = useState(isProSubActive());
	const [isMaxiProExpired, setIsMaxiProExpired] = useState(isProSubExpired());
	const [userName, setUserName] = useState(getUserName());
	const [showNotValidEmail, setShowNotValidEmail] = useState(false);

	useEffect(() => {
		setIsMaxiProActive(isProSubActive());
	}, [type]);

	useEffect(() => {
		setIsMaxiProExpired(isProSubExpired());
	}, [type]);

	const onClickConnect = email => {
		const isValid = isValidEmail(email);
		if (isValid) {
			setShowNotValidEmail(false);
			document.addEventListener(
				'visibilitychange',
				function userIsBack() {
					if (!document.hidden) {
						authConnect(false, email).then(() => {
							setIsMaxiProActive(isProSubActive());
							setIsMaxiProExpired(isProSubExpired());
							setUserName(getUserName());
						});
					}
				}
			);

			authConnect(true, email).then(response => {
				const { receiveMaxiProStatus } =
					resolveSelect('maxiBlocks/pro');

				receiveMaxiProStatus().then(data => {
					if (typeof data === 'string') {
						const proJson = JSON.parse(data);
						const info = proJson[email];
						const maxiCookie = getMaxiCookieKey();
						if (info && maxiCookie) {
							const { key } = maxiCookie;
							let name = info?.name;
							if (!name || name !== '' || name !== '1')
								name = email;
							const isActive =
								info &&
								info?.key === key &&
								info?.status === 'yes';
							const isExpired =
								info &&
								info?.key === key &&
								info?.status === 'expired';
							setUserName(name);
							setIsMaxiProActive(isActive);
							setIsMaxiProExpired(isExpired);
						}
					}
				});
			});
		} else setShowNotValidEmail(true);
	};

	const onLogOut = () => {
		logOut();
		setIsMaxiProActive(false);
		setIsMaxiProExpired(false);
		setUserName('');
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
						<span>{__('Browse style cards', 'maxi-blocks')}</span>
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
								showNotValidEmail={showNotValidEmail}
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
				<div className='maxi-library-modal__action-section__preview'>
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
							showNotValidEmail={showNotValidEmail}
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
