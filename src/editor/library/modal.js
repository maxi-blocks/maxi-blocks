/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { RawHTML, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import CloudLibrary from '.';
import { Icon } from '../../components';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

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
		layerId,
		openFirstTime,
		onOpen = null,
		onRemove,
		onSelect,
		...rest
	} = props;

	const [isOpen, changeIsOpen] = useState(openFirstTime);

	const { getBlockAttributes } = select('core/block-editor');

	const attributes = rest || getBlockAttributes(clientId);

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
						{isEmpty(attributes['icon-content'])
							? __('Add Icon', 'maxi-blocks')
							: __('Replace Icon', 'maxi-blocks')}
					</Button>
				)}
				{isOpen && (
					<CloudLibrary
						layerId={layerId}
						cloudType={type}
						onClose={onClick}
						blockStyle={style}
						onSelect={onSelect}
					/>
				)}
			</div>
			{attributes &&
				type === 'button-icon' &&
				attributes['icon-content'] && (
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
							{attributes['icon-content']}
						</RawHTML>
					</div>
				)}
			{attributes &&
				type === 'sidebar-block-shape' &&
				attributes.shapeSVGElement && (
					<div className='maxi-library-modal__action-section__preview'>
						<RawHTML className='maxi-library-modal__action-section__preview__shape'>
							{attributes.shapeSVGElement}
						</RawHTML>
					</div>
				)}
			{attributes &&
				type === 'bg-shape' &&
				attributes['background-layers-status'] &&
				!isEmpty(
					attributes['background-layers'][layerId][
						'background-svg-SVGElement'
					]
				) && (
					<div className='maxi-library-modal__action-section__preview'>
						<Icon
							className='maxi-library-modal__action-section__preview--remove'
							icon={remove}
							onClick={() => {
								const newBgLayers = cloneDeep(
									attributes['background-layers']
								);

								delete newBgLayers[layerId][
									'background-svg-SVGElement'
								];
								delete newBgLayers[layerId][
									'background-svg-SVGMediaID'
								];
								delete newBgLayers[layerId][
									'background-svg-SVGMediaURL'
								];
								delete newBgLayers[layerId][
									'background-svg-SVGData'
								];

								onRemove({
									'background-layers': [...newBgLayers],
								});
							}}
						/>
						<RawHTML className='maxi-library-modal__action-section__preview__shape'>
							{
								attributes['background-layers'][layerId][
									'background-svg-SVGElement'
								]
							}
						</RawHTML>
					</div>
				)}
			{attributes &&
				type === 'bg-shape' &&
				!attributes['background-layers-status'] &&
				!isEmpty(attributes['background-svg-SVGElement']) && (
					<div className='maxi-library-modal__action-section__preview'>
						<Icon
							className='maxi-library-modal__action-section__preview--remove'
							icon={remove}
							onClick={() =>
								onRemove({
									'background-svg-SVGElement': '',
								})
							}
						/>
						<RawHTML className='maxi-library-modal__action-section__preview__shape'>
							{attributes['background-svg-SVGElement']}
						</RawHTML>
					</div>
				)}
			{attributes && type === 'image-shape' && attributes.SVGElement && (
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
						{attributes.SVGElement}
					</RawHTML>
				</div>
			)}
		</div>
	);
};

export default MaxiModal;
