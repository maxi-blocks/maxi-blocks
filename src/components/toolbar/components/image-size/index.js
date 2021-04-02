/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { Button, SelectControl, RadioControl } = wp.components;
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import openSidebar from '../../../../extensions/dom';
import RangeSliderControl from '../../../range-slider-control';

/**
 * External dependencies
 */
import { capitalize, isNil, trim } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '../../../../icons';
import { getDefaultAttribute } from '../../../../extensions/styles';

/**
 * ImageSize
 */
const ImageSize = props => {
	const {
		blockName,
		imgWidth,
		onChangeSize,
		imageSize,
		onChangeImageSize,
		mediaID,
		fullWidth,
		onChangeFullWidth,
		isFirstOnHierarchy,
	} = props;

	const { imageData } = useSelect(select => {
		const { getMedia } = select('core');
		return {
			imageData: getMedia(mediaID),
		};
	});

	const { openGeneralSidebar } = useDispatch('core/edit-post');

	if (blockName !== 'maxi-blocks/image-maxi') return null;

	const getImageSizeOptions = () => {
		const response = [];
		if (imageData) {
			let { sizes } = imageData.media_details;
			sizes = Object.entries(sizes).sort((a, b) => {
				return a[1].width - b[1].width;
			});
			sizes.forEach(size => {
				const name = capitalize(size[0]);
				const val = size[1];
				response.push({
					label: `${name} - ${val.width}x${val.height}`,
					value: size[0],
				});
			});
		}
		response.push({
			label: 'Custom',
			value: 'custom',
		});
		return response;
	};

	return (
		<ToolbarPopover
			className='toolbar-item__image-size'
			tooltip={__('Image size', 'maxi-blocks')}
			icon={toolbarSizing}
			content={
				<div className='toolbar-item__image-size__popover'>
					<SelectControl
						label={__('Image Size', 'maxi-blocks')}
						value={
							imageSize || imageSize === 'custom'
								? imageSize
								: 'full'
						} // is still necessary?
						options={getImageSizeOptions()}
						onChange={imageSize => onChangeImageSize(imageSize)}
					/>
					{isFirstOnHierarchy && (
						<RadioControl
							className='toolbar-item__popover__toggle-btn'
							label={__('Full Width', 'maxi-blocks')}
							selected={fullWidth}
							options={[
								{
									label: __('No', 'maxi-blocks'),
									value: 'normal',
								},
								{
									label: __('Yes', 'maxi-blocks'),
									value: 'full',
								},
							]}
							onChange={fullWidth => onChangeFullWidth(fullWidth)}
						/>
					)}
					<RangeSliderControl
						label={__('Width', 'maxi-blocks')}
						value={imgWidth}
						defaultValue={getDefaultAttribute('imgWidth')}
						onChange={val =>
							onChangeSize({
								imgWidth: val,
							})
						}
						allowReset
					/>
					<div className='toolbar-image-size-buttons'>
						<Button
							className='toolbar-image-size-buttons__edit-image'
							onClick={() =>
								openGeneralSidebar('edit-post/block').then(() =>
									openSidebar('image dimension')
								)
							}
						>
							{__('Edit Image', 'maxi-blocks')}
						</Button>
						<Button
							className='toolbar-image-size-buttons__add-caption'
							onClick={() =>
								openGeneralSidebar('edit-post/block').then(() =>
									openSidebar('caption')
								)
							}
						>
							{__('Add Caption', 'maxi-blocks')}
						</Button>
					</div>
				</div>
			}
		/>
	);
};

export default ImageSize;
