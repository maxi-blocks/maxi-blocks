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

/**
 * Internal dependencies
 */
import CloudLibrary from '.';
import { Icon, BaseControl, Button } from '../../components';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import classNames from 'classnames';

/**
 * Icons
 */
import { toolbarReplaceImage, remove, cloudLib } from '../../icons';

/**
 * Content
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
		cardId,
		prefix = '',
		label = '',
	} = props;

	const ref = useRef(null);
	const [isOpen, changeIsOpen] = useState(openFirstTime || forceIsOpen);

	const onClick = () => {
		changeIsOpen(!isOpen);

		if (onOpen) onOpen({ openFirstTime: !isOpen });
		if (onClose) onClose();
	};

	useEffect(() => {
		if (isOpen || forceIsOpen) changeIsOpen(true);
	}, [isOpen, forceIsOpen]);

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
					<CloudLibrary
						cloudType={type}
						onClose={onClick}
						blockStyle={style}
						onSelect={onSelect}
						url={url}
						title={title}
						cardId={cardId}
						prefix={prefix}
						className={`maxi-library-modal__${type}`}
					/>
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
			{type === 'search-icon' && !isEmpty(icon) && (
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
		</div>
	);
};

export default MaxiModal;
