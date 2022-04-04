/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import AdvancedNumberControl from '../../../advanced-number-control';
import SelectControl from '../../../select-control';
import SettingTabsControl from '../../../setting-tabs-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '../../../../icons';
import { getDefaultAttribute } from '../../../../extensions/styles';
import { openSidebarAccordion } from '../../../../extensions/inspector-path';

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
		>
			<div className='toolbar-item__image-size__popover'>
				<SelectControl
					label={__('Image Size', 'maxi-blocks')}
					value={
						imageSize || imageSize === 'custom' ? imageSize : 'full'
					} // is still necessary?
					options={getImageSizeOptions()}
					onChange={imageSize => onChangeImageSize(imageSize)}
				/>
				{isFirstOnHierarchy && (
					<SettingTabsControl
						label={__('Full Width', 'maxi-blocks')}
						type='buttons'
						selected={fullWidth}
						items={[
							{
								label: __('Yes', 'maxi-blocks'),
								value: 'full',
							},
							{
								label: __('No', 'maxi-blocks'),
								value: 'normal',
							},
						]}
						onChange={fullWidth => onChangeFullWidth(fullWidth)}
					/>
				)}
				<AdvancedNumberControl
					label={__('Width', 'maxi-blocks')}
					value={imgWidth}
					onChangeValue={val => {
						onChangeSize({
							imgWidth:
								val !== undefined && val !== '' ? val : '',
						});
					}}
					min={0}
					max={100}
					onReset={() =>
						onChangeSize({
							imgWidth: getDefaultAttribute('imgWidth'),
						})
					}
					initialPosition={getDefaultAttribute('imgWidth')}
				/>
				<div className='toolbar-image-size-buttons'>
					<Button
						className='toolbar-image-size-buttons__edit-image'
						onClick={() => {
							openSidebarAccordion(0, 'image dimension');
						}}
					>
						{__('Edit Image', 'maxi-blocks')}
					</Button>
					<Button
						className='toolbar-image-size-buttons__add-caption'
						onClick={() => {
							openSidebarAccordion(0, 'caption');
						}}
					>
						{__('Add Caption', 'maxi-blocks')}
					</Button>
				</div>
			</div>
		</ToolbarPopover>
	);
};

export default ImageSize;
