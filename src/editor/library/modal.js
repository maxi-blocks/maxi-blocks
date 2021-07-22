/**
 * Layout modal window with tab panel.
 */

import CloudLibrary from '.';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Component, RawHTML } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { Icon } from '../../components';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Icons
 */
import { SCaddMore, toolbarReplaceImage, remove } from '../../icons';

class MaxiModal extends Component {
	state = {
		isOpen: this.props.openFirstTime,
	};

	render() {
		const { isOpen } = this.state;

		const { type, clientId, empty, style, layerId } = this.props;

		const { getBlockAttributes, getSelectedBlockClientId } =
			select('core/block-editor');

		const attributes = getBlockAttributes(getSelectedBlockClientId());

		const onClick = () => {
			this.setState({
				isOpen: !isOpen,
			});

			dispatch('core/block-editor').updateBlockAttributes(clientId, {
				openFirstTime: !isOpen,
			});
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
					{type === 'block-shape' && empty && (
						<div className='maxi-shape-block__placeholder'>
							<Button
								isPrimary
								key={`maxi-block-library__modal-button--${clientId}`}
								className='maxi-block-library__modal-button'
								onClick={onClick}
							>
								{__('Select Shape', 'maxi-blocks')}
							</Button>
						</div>
					)}
					{type === 'block-shape' && (
						<Button
							className='maxi-shape-block__replace-icon'
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
									dispatch(
										'core/block-editor'
									).updateBlockAttributes(
										getSelectedBlockClientId(),
										{
											'icon-content': '',
										}
									)
								}
							/>
							<RawHTML>{attributes['icon-content']}</RawHTML>
						</div>
					)}
				{attributes &&
					type === 'sidebar-block-shape' &&
					attributes.shapeSVGElement && (
						<div className='maxi-library-modal__action-section__preview'>
							<RawHTML>{attributes.shapeSVGElement}</RawHTML>
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

									dispatch(
										'core/block-editor'
									).updateBlockAttributes(
										getSelectedBlockClientId(),
										{
											'background-layers': [
												...newBgLayers,
											],
										}
									);
								}}
							/>
							<RawHTML>
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
									dispatch(
										'core/block-editor'
									).updateBlockAttributes(
										getSelectedBlockClientId(),
										{
											'background-svg-SVGElement': '',
										}
									)
								}
							/>
							<RawHTML>
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
								dispatch(
									'core/block-editor'
								).updateBlockAttributes(
									getSelectedBlockClientId(),
									{
										SVGElement: '',
										SVGData: {},
									}
								)
							}
						/>
						<RawHTML>{attributes.SVGElement}</RawHTML>
					</div>
				)}
			</div>
		);
	}
}
export default MaxiModal;
