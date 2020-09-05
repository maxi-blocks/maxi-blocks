/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import MediaUploaderControl from '../media-uploader-control';
import SettingTabsControl from '../setting-tabs-control';
import { injectImgSVG } from '../SVGControl/utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isObject } from 'lodash';

/**
 * Component
 */
const SVGFillControl = props => {
	const { SVGData, SVGElement, onChange, className } = props;

	const classes = classnames('maxi-svg-fill-control', className);

	const SVGValue = !isNil(SVGData)
		? !isObject(SVGData)
			? JSON.parse(SVGData)
			: SVGData
		: {};

	const getFillItems = () => {
		const response = Object.entries(SVGValue).map(([id, value], i) => {
			return {
				label: i,
				content: getFillItem([id, value], i),
			};
		});

		return response;
	};

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
								onColorChange={val => {
									SVGValue[id].color = val;
									const resEl = injectImgSVG(
										SVGElement,
										SVGValue
									);

									onChange({
										SVGElement: resEl.outerHTML,
										SVGData: JSON.stringify(SVGValue),
									});
								}}
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
									SVGValue[id].imageID = imageData.id;
									SVGValue[id].imageURL = imageData.url;
									const resEl = injectImgSVG(
										SVGElement,
										SVGValue
									);

									onChange({
										SVGElement: resEl.outerHTML,
										SVGData: JSON.stringify(SVGValue),
									});
								}}
								onRemoveImage={() => {
									SVGValue[id].imageID = '';
									SVGValue[id].imageURL = '';
									const resEl = injectImgSVG(
										SVGElement,
										SVGValue
									);

									onChange({
										SVGElement: resEl.outerHTML,
										SVGData: JSON.stringify(SVGValue),
									});
								}}
							/>
						),
					},
				]}
			/>
		);
	};

	return (
		<div className={classes}>
			{Object.keys(SVGValue).length > 1 && (
				<SettingTabsControl items={getFillItems()} />
			)}
			{Object.keys(SVGValue).length === 1 &&
				getFillItem(Object.entries(SVGValue)[0])}
		</div>
	);
};

export default SVGFillControl;
