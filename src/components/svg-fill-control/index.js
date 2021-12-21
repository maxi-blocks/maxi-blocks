/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import ImageShape from '../image-shape';
import MediaUploaderControl from '../media-uploader-control';
import SettingTabsControl from '../setting-tabs-control';
import { injectImgSVG, getSVGHasImage } from '../../extensions/svg';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep } from 'lodash';
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
	isGeneral,
	onChange,
	clientId,
}) => (
	<ColorControl
		label={__('Fill', 'maxi-blocks')}
		paletteStatus={getLastBreakpointAttribute(
			'background-svg-palette-status',
			breakpoint,
			SVGOptions,
			isHover
		)}
		paletteColor={getLastBreakpointAttribute(
			'background-svg-palette-color',
			breakpoint,
			SVGOptions,
			isHover
		)}
		paletteOpacity={getLastBreakpointAttribute(
			'background-svg-palette-opacity',
			breakpoint,
			SVGOptions,
			isHover
		)}
		color={getLastBreakpointAttribute('color', breakpoint, value, isHover)}
		onChange={({ paletteStatus, paletteColor, paletteOpacity, color }) => {
			SVGData[id][getAttributeKey('color', isHover, false, breakpoint)] =
				color;

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
					'background-svg-palette-opacity',
					isHover,
					false,
					breakpoint
				)]: paletteOpacity,
				...(isGeneral && {
					[getAttributeKey(
						'background-svg-palette-status',
						isHover,
						false,
						'general'
					)]: paletteStatus,
					[getAttributeKey(
						'background-svg-palette-color',
						isHover,
						false,
						'general'
					)]: paletteColor,
					[getAttributeKey(
						'background-svg-palette-opacity',
						isHover,
						false,
						'general'
					)]: paletteOpacity,
					[getAttributeKey(
						'background-svg-palette-opacity',
						isHover,
						false,
						'general'
					)]: paletteOpacity,
				}),
			});
		}}
		isHover={isHover}
		clientId={clientId}
	/>
);

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

	const getFillItem = ([id, value]) => {
		return (
			<SettingTabsControl
				disablePadding
				callback={(item, i) => {
					const isColorSelected = i === 0;
					const tempSVGData = cloneDeep(SVGData);

					if (isColorSelected) {
						tempSVGData[id].imageID = '';
						tempSVGData[id].imageURL = '';
					}

					const resEl = injectImgSVG(
						SVGElement,
						tempSVGData,
						isColorSelected
					);

					onChange({
						'background-svg-SVGElement': resEl.outerHTML,
						'background-svg-SVGData': SVGData,
						'background-svg-palette-color':
							props.SVGOptions['background-svg-palette-color'],
						'background-svg-palette-status':
							props.SVGOptions['background-svg-palette-status'],
					});
				}}
				items={[
					!getSVGHasImage(SVGElement) && {
						label: __('Colour', 'maxi-blocks'),
						content: (
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
						),
					},
					(!isHover || getSVGHasImage(SVGElement)) && {
						label: __('Image', 'maxi-blocks'),
						content: (
							<>
								{!isHover && (
									<MediaUploaderControl
										allowedTypes={['image']}
										mediaID={value.imageID}
										onSelectImage={imageData => {
											SVGData[id].imageID = imageData.id;
											SVGData[id].imageURL =
												imageData.url;
											const resEl = injectImgSVG(
												SVGElement,
												SVGData
											);

											onChange({
												'background-svg-SVGElement':
													resEl.outerHTML,
												'background-svg-SVGData':
													SVGData,
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
												'background-svg-SVGData':
													SVGData,
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
									<ResponsiveTabsControl
										breakpoint={breakpoint}
									>
										<ImageShape
											{...SVGOptions}
											onChange={obj => {
												[
													'SVGElement',
													'SVGData',
												].forEach(el => {
													if (el in obj) {
														obj[
															`background-svg-${el}`
														] = obj[el];

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
									</ResponsiveTabsControl>
								)}
							</>
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
