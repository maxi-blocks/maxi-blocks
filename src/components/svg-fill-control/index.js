/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import MediaUploaderControl from '../media-uploader-control';
import SettingTabsControl from '../setting-tabs-control';
import { injectImgSVG } from '../../extensions/svg/utils';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const SVGFillControl = props => {
	const {
		SVGElement,
		onChange,
		onChangePalette,
		className,
		clientId,
		isHover,
	} = props;

	const classes = classnames('maxi-svg-fill-control', className);

	const SVGData = cloneDeep(props.SVGData);

	const getFillItem = ([id, value], i = 0) => {
		return (
			<SettingTabsControl
				disablePadding
				items={[
					{
						label: __('Color', 'maxi-blocks'),
						content: (
							<ColorControl
								label={__('Fill', 'maxi-blocks')}
								color={value.color}
								onChange={val => {
									SVGData[id].color = val;
									const resEl = injectImgSVG(
										SVGElement,
										SVGData
									);

									onChange({
										SVGElement: resEl.outerHTML,
										SVGData,
									});
								}}
								showPalette
								palette={{
									...getGroupAttributes(props, 'palette'),
								}}
								isHover={isHover}
								colorPaletteType='svg-background'
								onChangePalette={val => onChangePalette(val)}
								clientId={clientId}
							/>
						),
					},
					{
						label: __('Image', 'maxi-blocks'),
						content: (
							<MediaUploaderControl
								allowedTypes={['image']}
								mediaID={value.imageID}
								onSelectImage={imageData => {
									SVGData[id].imageID = imageData.id;
									SVGData[id].imageURL = imageData.url;
									const resEl = injectImgSVG(
										SVGElement,
										SVGData
									);

									onChange({
										SVGElement: resEl.outerHTML,
										SVGData,
									});
								}}
								onRemoveImage={() => {
									SVGData[id].imageID = '';
									SVGData[id].imageURL = '';

									const resEl = injectImgSVG(
										SVGElement,
										SVGData,
										true
									);

									onChange({
										SVGElement: resEl.outerHTML,
										SVGData,
									});
								}}
							/>
						),
					},
				]}
			/>
		);
	};

	const getFillItems = () => {
		const response = Object.entries(SVGData).map(([id, value], i) => {
			return {
				label: i,
				content: getFillItem([id, value], i),
			};
		});

		return response;
	};

	return (
		<div className={classes}>
			{Object.keys(SVGData).length > 1 && (
				<SettingTabsControl items={getFillItems()} />
			)}
			{Object.keys(SVGData).length === 1 &&
				getFillItem(Object.entries(SVGData)[0])}
		</div>
	);
};

export default SVGFillControl;
