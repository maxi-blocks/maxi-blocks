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
import { injectImgSVG, getSVGHasImage } from '../../extensions/svg/utils';

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
const ColorContent = props => {
	const {
		SVGOptions,
		SVGData,
		breakpoint,
		isHover,
		id,
		value,
		isGeneral,
		onChange,
		clientId,
	} = props;

	const SVGElement = SVGOptions['background-svg-SVGElement'];

	return (
		<ColorControl
			label={__('Fill', 'maxi-blocks')}
			paletteStatus={getLastBreakpointAttribute(
				'background-palette-svg-color-status',
				breakpoint,
				SVGOptions,
				isHover
			)}
			paletteColor={getLastBreakpointAttribute(
				'background-palette-svg-color',
				breakpoint,
				SVGOptions,
				isHover
			)}
			paletteOpacity={getLastBreakpointAttribute(
				'background-palette-svg-opacity',
				breakpoint,
				SVGOptions,
				isHover
			)}
			color={getLastBreakpointAttribute(
				'color',
				breakpoint,
				value,
				isHover
			)}
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
					SVGElement: injectImgSVG(SVGElement, SVGData).outerHTML,
					SVGData,
					[getAttributeKey(
						'background-palette-svg-color-status',
						isHover,
						false,
						breakpoint
					)]: paletteStatus,
					[getAttributeKey(
						'background-palette-svg-color',
						isHover,
						false,
						breakpoint
					)]: paletteColor,
					[getAttributeKey(
						'background-palette-svg-opacity',
						isHover,
						false,
						breakpoint
					)]: paletteOpacity,
					[getAttributeKey(
						'background-palette-svg-opacity',
						isHover,
						false,
						breakpoint
					)]: paletteOpacity,
					...(isGeneral && {
						[getAttributeKey(
							'background-palette-svg-color-status',
							isHover,
							false,
							'general'
						)]: paletteStatus,
						[getAttributeKey(
							'background-palette-svg-color',
							isHover,
							false,
							'general'
						)]: paletteColor,
						[getAttributeKey(
							'background-palette-svg-opacity',
							isHover,
							false,
							'general'
						)]: paletteOpacity,
						[getAttributeKey(
							'background-palette-svg-opacity',
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
						'background-palette-svg-color':
							props.SVGOptions['background-palette-svg-color'],
						'background-palette-svg-color-status':
							props.SVGOptions[
								'background-palette-svg-color-status'
							],
					});
				}}
				forceTab={+getSVGHasImage(SVGElement)}
				items={[
					{
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
					{
						label: __('Image', 'maxi-blocks'),
						content: (
							<>
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
											'background-palette-svg-color':
												props.SVGOptions[
													'background-palette-svg-color'
												],
											'background-palette-svg-color-status':
												props.SVGOptions[
													'background-palette-svg-color-status'
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
											'background-palette-svg-color':
												props.SVGOptions[
													'background-palette-svg-color'
												],
											'background-palette-svg-color-status':
												props.SVGOptions[
													'background-palette-svg-color-status'
												],
										});
									}}
								/>
								{getSVGHasImage(SVGElement) && (
									<ImageShape
										{...SVGOptions}
										onChange={obj => {
											['SVGElement', 'SVGData'].forEach(
												el => {
													if (el in obj) {
														obj[
															`background-svg-${el}`
														] = obj[el];

														delete obj[el];
													}
												}
											);

											onChange(obj);
										}}
										icon={SVGElement}
										breakpoint={breakpoint}
										prefix='background-svg-'
										disableModal
									/>
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
