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
	getAttributesValue,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
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
			prefix='bsv'
			paletteStatus={getLastBreakpointAttribute({
				target: 'bsv_ps',
				breakpoint,
				attributes: SVGOptions,
				isHover,
			})}
			paletteColor={getLastBreakpointAttribute({
				target: 'bsv_pc',
				breakpoint,
				attributes: SVGOptions,
				isHover,
			})}
			paletteOpacity={getLastBreakpointAttribute({
				target: 'bsv_po',
				breakpoint,
				attributes: SVGOptions,
				isHover,
			})}
			color={getLastBreakpointAttribute({
				target: 'bsv_cc',
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
					getAttributeKey({ key: 'bsv_cc', isHover, breakpoint })
				] = color;

				onChange({
					bsv_se: injectImgSVG(SVGOptions.bsv_se, SVGData).outerHTML,
					bsv_sd: SVGData,
					[getAttributeKey({ key: 'bsv_ps', isHover, breakpoint })]:
						paletteStatus,
					[getAttributeKey({ key: 'bsv_pc', isHover, breakpoint })]:
						paletteColor,
					[getAttributeKey({ key: 'bsv_po', isHover, breakpoint })]:
						paletteOpacity,
					[getAttributeKey({ key: 'bsv_cc', isHover, breakpoint })]:
						color,
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

	const SVGElement = getAttributesValue({
		target: 'bsv_se',
		props: SVGOptions,
	});

	const SVGData = cloneDeep(
		SVGOptions[getAttributeKey({ key: 'bsv_sd', isHover })] ||
			SVGOptions.bsv_sd
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
							[getAttributeKey({ key: '_se', prefix: 'bsv' })]:
								resEl.outerHTML,
							[getAttributeKey({ key: '_sd', prefix: 'bsv' })]:
								tempSVGData,
							[getAttributeKey({ key: '_pc', prefix: 'bsv' })]:
								getAttributesValue({
									target: '_pc',
									prefix: 'bsv',
									props: props.SVGOptions,
								}),
							[getAttributeKey({ key: '_ps', prefix: 'bsv' })]:
								getAttributesValue({
									target: '_ps',
									prefix: 'bsv',
									props: props.SVGOptions,
								}),
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
										[getAttributeKey({
											key: '_se',
											prefix: 'bsv',
										})]: resEl.outerHTML,
										[getAttributeKey({
											key: '_sd',
											prefix: 'bsv',
										})]: SVGData,
										[getAttributeKey({
											key: '_pc',
											prefix: 'bsv',
										})]: getAttributesValue({
											target: '_pc',
											prefix: 'bsv',
											props: props.SVGOptions,
										}),
										[getAttributeKey({
											key: '_ps',
											prefix: 'bsv',
										})]: getAttributesValue({
											target: '_ps',
											prefix: 'bsv',
											props: props.SVGOptions,
										}),
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
										[getAttributeKey({
											key: '_se',
											prefix: 'bsv',
										})]: resEl.outerHTML,
										[getAttributeKey({
											key: '_sd',
											prefix: 'bsv',
										})]: SVGData,
										[getAttributeKey({
											key: '_pc',
											prefix: 'bsv',
										})]: getAttributesValue({
											target: '_pc',
											prefix: 'bsv',
											props: props.SVGOptions,
										}),
										[getAttributeKey({
											key: '_ps',
											prefix: 'bsv',
										})]: getAttributesValue({
											target: '_ps',
											prefix: 'bsv',
											props: props.SVGOptions,
										}),
									});
								}}
							/>
						)}
						{getSVGHasImage(SVGElement) && (
							<ImageShape
								{...SVGOptions}
								onChange={obj => {
									['_se', '_sd'].forEach(el => {
										if (el in obj) {
											obj[`bsv${el}`] = obj[el];

											delete obj[el];
										}
									});

									onChange(obj);
								}}
								icon={SVGElement}
								breakpoint={breakpoint}
								prefix='bsv-'
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
