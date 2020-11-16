/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { __ } = wp.i18n;
const { Button, SelectControl, RangeControl, RadioControl } = wp.components;
const { useSelect, useDispatch } = wp.data;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import openSidebar from '../../../../extensions/dom';

/**
 * External dependencies
 */
import { capitalize, isNil, isObject, trim } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '../../../../icons';

/**
 * ImageSize
 */
const ImageSize = props => {
	const {
		blockName,
		size,
		defaultSize,
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

	const sizeValue = !isObject(size) ? JSON.parse(size) : size;

	const defaultSizeValue = !isObject(defaultSize)
		? JSON.parse(defaultSize)
		: defaultSize;

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
				<Fragment>
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
					<RangeControl
						label={__('Width', 'maxi-blocks')}
						value={Number(trim(sizeValue.general.width))}
						onChange={width => {
							isNil(width)
								? (sizeValue.general.width =
										defaultSizeValue.general.width)
								: (sizeValue.general.width = width);

							onChangeSize(JSON.stringify(sizeValue));
						}}
						allowReset
						// initialPosition={}
					/>
					<div className='toolbar-image-size-buttons'>
						<Button
							className='toolbar-image-size-buttons__edit-image'
							onClick={() =>
								openGeneralSidebar('edit-post/block').then(() =>
									openSidebar('width height')
								)
							}
						>
							Edit Image
						</Button>
						<Button
							className='toolbar-image-size-buttons__add-caption'
							onClick={() =>
								openGeneralSidebar('edit-post/block').then(() =>
									openSidebar('caption')
								)
							}
						>
							Add Caption
						</Button>
					</div>
				</Fragment>
			}
		/>
	);
};

export default ImageSize;
