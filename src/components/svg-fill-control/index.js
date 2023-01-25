/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import ImageShape from '../image-shape';
import MediaUploaderControl from '../media-uploader-control';
import ToggleSwitch from '../toggle-switch';
import { injectImgSVG, getSVGHasImage } from '../../extensions/svg';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep, isEmpty, isNil } from 'lodash';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { ResponsiveTabsControl } from '..';

/**
 * Component
 */
const ColorContent = ({
	SVGOptions,
	SVGData,
	breakpoint,
	isHover,
	id,
	value,
	onChange,
	clientId,
}) => {
	return (
		<ColorControl
			label={__('Fill', 'maxi-blocks')}
			prefix='background-svg-'
			paletteStatus={getLastBreakpointAttribute({
				target: 'background-svg-palette-status',
				breakpoint,
				attributes: SVGOptions,
				isHover,
			})}
			paletteColor={getLastBreakpointAttribute({
				target: 'background-svg-palette-color',
				breakpoint,
				attributes: SVGOptions,
				isHover,
			})}
			paletteOpacity={getLastBreakpointAttribute({
				target: 'background-svg-palette-opacity',
				breakpoint,
				attributes: SVGOptions,
				isHover,
			})}
			color={getLastBreakpointAttribute({
				target: 'color',
				breakpoint,
				attributes: value,
				isHover,
			})}
			onChange={({
				paletteStatus,
				paletteColor,
				paletteOpacity,
				color,
			}) => {
				SVGData[id][
					getAttributeKey('color', isHover, false, breakpoint)
				] = color;

				onChange({
					'background-svg-SVGElement': injectImgSVG(
						SVGOptions['background-svg-SVGElement'],
						SVGData
					).outerHTML,
					'background-svg-SVGData': SVGData,
					[getAttributeKey(
						'background-svg-palette-status',
						isHover,
						false,
						breakpoint
					)]: paletteStatus,
					[getAttributeKey(
						'background-svg-palette-color',
						isHover,
						false,
						breakpoint
					)]: paletteColor,
					[getAttributeKey(
						'background-svg-palette-opacity',
						isHover,
						false,
						breakpoint
					)]: paletteOpacity,
					[getAttributeKey(
						'background-svg-color',
						isHover,
						false,
						breakpoint
					)]: color,
				});
			}}
			isHover={isHover}
			clientId={clientId}
		/>
	);
};

const SVGFillControl = props => {
	const {
		onChange,
		className,
		clientId,
		isHover,
		SVGOptions,
		breakpoint = '',
	} = props;

	const classes = classnames('maxi-svg-fill-control', className);

	const SVGElement = SVGOptions['background-svg-SVGElement'];
	const SVGData = cloneDeep(
		SVGOptions[getAttributeKey('background-svg-SVGData', isHover)] ||
			SVGOptions['background-svg-SVGData']
	);

	const bgImage = Object.values(SVGData)[0]?.imageURL;
	const [useImage, changeUseImage] = useState(!isEmpty(bgImage));

	const [oldImageID, changeOldImageID] = useState(0);
	const [oldImageURL, changeOldImageURL] = useState('');

	const getFillItem = ([id, value]) => {
		return (
			<>
				<ToggleSwitch
					label={__('Use background image', 'maxi-blocks')}
					selected={useImage}
					onChange={val => {
						changeUseImage(val);
						const tempSVGData = cloneDeep(SVGData);

						if (!val) {
							!isNil(tempSVGData[id].imageID) &&
								changeOldImageID(tempSVGData[id].imageID);
							!isEmpty(tempSVGData[id].imageURL) &&
								changeOldImageURL(tempSVGData[id].imageURL);

							tempSVGData[id].imageID = '';
							tempSVGData[id].imageURL = '';
						}

						if (val) {
							tempSVGData[id].imageID = !isNil(oldImageID)
								? oldImageID
								: 0;
							tempSVGData[id].imageURL = !isEmpty(oldImageURL)
								? oldImageURL
								: '';
						}

						const resEl = injectImgSVG(
							SVGElement,
							tempSVGData,
							!val
						);

						onChange({
							'background-svg-SVGElement': resEl.outerHTML,
							'background-svg-SVGData': tempSVGData,
							'background-svg-palette-color':
								props.SVGOptions[
									'background-svg-palette-color'
								],
							'background-svg-palette-status':
								props.SVGOptions[
									'background-svg-palette-status'
								],
						});
					}}
				/>
				{!useImage && (
					<ResponsiveTabsControl breakpoint={breakpoint}>
						<ColorContent
							breakpoint={breakpoint}
							SVGOptions={SVGOptions}
							SVGData={SVGData}
							isHover={isHover}
							id={id}
							value={value}
							onChange={onChange}
							clientId={clientId}
						/>
					</ResponsiveTabsControl>
				)}
				{useImage && (
					<>
						{!isHover && (
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
										'background-svg-SVGElement':
											resEl.outerHTML,
										'background-svg-SVGData': SVGData,
										'background-svg-palette-color':
											props.SVGOptions[
												'background-svg-palette-color'
											],
										'background-svg-palette-status':
											props.SVGOptions[
												'background-svg-palette-status'
											],
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
										'background-svg-SVGElement':
											resEl.outerHTML,
										'background-svg-SVGData': SVGData,
										'background-svg-palette-color':
											props.SVGOptions[
												'background-svg-palette-color'
											],
										'background-svg-palette-status':
											props.SVGOptions[
												'background-svg-palette-status'
											],
									});
								}}
							/>
						)}
						{getSVGHasImage(SVGElement) && (
							<ImageShape
								{...SVGOptions}
								onChange={obj => {
									['SVGElement', 'SVGData'].forEach(el => {
										if (el in obj) {
											obj[`background-svg-${el}`] =
												obj[el];

											delete obj[el];
										}
									});

									onChange(obj);
								}}
								icon={SVGElement}
								breakpoint={breakpoint}
								prefix='background-svg-'
								disableModal
							/>
						)}
					</>
				)}
			</>
		);
	};

	return (
		<div className={classes}>{getFillItem(Object.entries(SVGData)[0])}</div>
	);
};

export default SVGFillControl;
