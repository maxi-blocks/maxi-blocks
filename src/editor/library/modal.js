/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { RawHTML, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import CloudLibrary from '.';
import { Icon } from '../../components';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import { SCaddMore, toolbarReplaceImage, remove } from '../../icons';

/**
 * Layout modal window with tab panel.
 */
const MaxiModal = props => {
	const {
		type,
		clientId,
		empty,
		style,
		openFirstTime,
		onOpen = null,
		onRemove,
		onSelect,
		icon,
	} = props;

	const [isOpen, changeIsOpen] = useState(openFirstTime);

	const onClick = () => {
		changeIsOpen(!isOpen);

		if (onOpen) onOpen({ openFirstTime: !isOpen });
	};

	return (
		<div className='maxi-library-modal__action-section'>
			<div className='maxi-library-modal__action-section__buttons'>
				{type === 'patterns' && (
					<Button
						key={`maxi-block-library__modal-button--${clientId}`}
						isPrimary
						className='maxi-block-library__modal-button'
						onClick={onClick}
					>
						{__('Launch the Library', 'maxi-blocks')}
					</Button>
				)}
				{type === 'sc' && (
					<Button
						className='maxi-style-cards__sc__more-sc--add-more'
						onClick={onClick}
					>
						<Icon icon={SCaddMore} />
					</Button>
				)}
				{type === 'svg' && empty && (
					<div className='maxi-svg-icon-block__placeholder'>
						<Button
							isPrimary
							key={`maxi-block-library__modal-button--${clientId}`}
							className='maxi-block-library__modal-button'
							onClick={onClick}
						>
							{__('Select SVG Icon', 'maxi-blocks')}
						</Button>
					</div>
				)}
				{type === 'svg' && !empty && (
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
						{__('Load Shape Library', 'maxi-blocks')}
					</Button>
				)}
				{type === 'button-icon' && (
					<Button
						className='maxi-library-modal__action-section__buttons__load-library'
						onClick={onClick}
					>
						{isEmpty(icon)
							? __('Add Icon', 'maxi-blocks')
							: __('Replace Icon', 'maxi-blocks')}
					</Button>
				)}
				{isOpen && (
					<CloudLibrary
						cloudType={type}
						onClose={onClick}
						blockStyle={style}
						onSelect={onSelect}
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
		</div>
	);
};

export default MaxiModal;
