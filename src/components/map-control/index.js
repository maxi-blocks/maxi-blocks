/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl, TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ColorControl from '../color-control';
import SvgStrokeWidthControl from '../svg-stroke-width-control';
import InfoBox from '../info-box';
import OpacityControl from '../opacity-control';
import SvgColor from '../svg-color';
import {
	getDefaultAttribute,
	getColorRGBAString,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { uniqueId } from 'lodash';
import ReactDOMServer from 'react-dom/server';

/**
 * Styles and icons
 */
import './editor.scss';
import * as mapMarkers from '../../icons/map-icons/markers';
import * as mapPopups from '../../icons/map-icons/popups';

/**
 * Component
 */
const MapControl = props => {
	const { className, onChange, hasApiKey = false } = props;

	const classes = classnames('maxi-map-control', className);

	return (
		<div className={classes}>
			{!hasApiKey && (
				<InfoBox
					message={__(
						'You have not set your Google map API key, please navigate to the Maxi Block Options and set it',
						'maxi-blocks'
					)}
					links={[
						{
							title: __('Maxi Block Options', 'maxi-blocks'),
							href: '/wp-admin/admin.php?page=maxi-blocks.php',
						},
					]}
				/>
			)}
			<SelectControl
				label={__('Map service provider', 'maxi-blocks')}
				value={props['map-provider']}
				options={[
					{
						label: __('Open Street Map', 'maxi-blocks'),
						value: 'openstreetmap',
					},
					{
						label: __('Google Maps Api', 'maxi-blocks'),
						value: 'googlemaps',
					},
				]}
				onChange={val => onChange({ 'map-provider': val })}
			/>
			<AdvancedNumberControl
				label={__('Minimum zoom', 'maxi-blocks')}
				min={1}
				max={21}
				initial={1}
				step={1}
				value={props['map-min-zoom']}
				onChangeValue={val => onChange({ 'map-min-zoom': val })}
				onReset={() =>
					onChange({
						'map-min-zoom': getDefaultAttribute('map-min-zoom'),
					})
				}
			/>
			<AdvancedNumberControl
				label={__('Maximum zoom', 'maxi-blocks')}
				min={2}
				max={22}
				initial={1}
				step={1}
				value={props['map-max-zoom']}
				onChangeValue={val => onChange({ 'map-max-zoom': val })}
				onReset={() =>
					onChange({
						'map-max-zoom': getDefaultAttribute('map-max-zoom'),
					})
				}
			/>
			{props['map-provider'] === 'googlemaps' && (
				<>
					<TextControl
						label={__('Latitude', 'maxi-blocks')}
						value={props['map-latitude']}
						onChange={val => onChange({ 'map-latitude': val })}
					/>
					<TextControl
						label={__('Longitude', 'maxi-blocks')}
						value={props['map-longitude']}
						onChange={val => onChange({ 'map-longitude': val })}
					/>
				</>
			)}

			<TextControl
				className='maxi-map-control__full-width-text'
				label={__('Marker Text', 'maxi-blocks')}
				value={props['map-marker-text']}
				onChange={val => onChange({ 'map-marker-text': val })}
			/>
			<TextControl
				className='maxi-map-control__full-width-text'
				label={__('Marker Address', 'maxi-blocks')}
				value={props['map-marker-address']}
				onChange={val => onChange({ 'map-marker-address': val })}
			/>
			<ColorControl
				label={__('Marker Address', 'maxi-blocks')}
				color={props['map-marker-address-color']}
				prefix='map-marker-address-'
				paletteColor={props['map-marker-address-palette-color']}
				paletteStatus={props['map-marker-address-palette-status']}
				onChange={({ color, paletteColor, paletteStatus }) =>
					onChange({
						'map-marker-address-color': color,
						'map-marker-address-palette-color': paletteColor,
						'map-marker-address-palette-status': paletteStatus,
					})
				}
				disableOpacity
			/>
		</div>
	);
};

export const MapMarkersControl = props => {
	const { onChange, parentBlockStyle, changeSVGContent, svgAttributes } =
		props;

	return (
		<>
			<div className='maxi-map-control__markers'>
				{Object.keys(mapMarkers).map((item, index) => (
					<div
						key={`map-marker-${uniqueId()}`}
						data-item={index + 1}
						onClick={e =>
							onChange({
								'map-marker': +e.currentTarget.dataset.item,
								'map-marker-icon':
									ReactDOMServer.renderToString(
										mapMarkers[item]
									),
							})
						}
						className={`maxi-map-control__markers__item ${
							props['map-marker'] - 1 === index
								? 'maxi-map-control__markers__item--active'
								: null
						}`}
					>
						{mapMarkers[item]}
					</div>
				))}
			</div>
			<OpacityControl
				label={__('Icon opacity', 'maxi-blocks')}
				opacity={props['map-marker-opacity']}
				onChange={val => {
					onChange({
						'map-marker-opacity': val,
					});
					changeSVGContent(val, 'opacity');
				}}
			/>
			<AdvancedNumberControl
				label={__('Icon size', 'maxi-blocks')}
				min={15}
				max={40}
				initial={20}
				step={1}
				value={props['map-marker-scale']}
				onChangeValue={val => {
					onChange({ 'map-marker-scale': val });
					changeSVGContent(val, ' width');
				}}
				onReset={() => {
					const defaultAttr = getDefaultAttribute('map-marker-scale');
					onChange({
						'map-marker-scale': defaultAttr,
					});
					changeSVGContent(defaultAttr, ' width');
				}}
			/>
			{/* <ToggleSwitch
				label={__('Set custom icon colours', 'maxi-block')}
				selected={props['map-marker-custom-color-status']}
				onChange={val =>
					onChange({
						'map-marker-custom-color-status': val,
					})
				}
			/>
			{props['map-marker-custom-color-status'] && (
				<>
					<ColorControl
						label={__('Marker Fill', 'maxi-blocks')}
						disableOpacity
						color={props['map-marker-fill-color']}
						prefix='map-marker-fill-'
						onChange={({ color }) =>
							onChange({ 'map-marker-fill-color': color })
						}
						disablePalette
					/>
					<ColorControl
						label={__('Marker Stroke', 'maxi-blocks')}
						disableOpacity
						color={props['map-marker-stroke-color']}
						prefix='map-marker-stroke-'
						onChange={({ color }) =>
							onChange({ 'map-marker-stroke-color': color })
						}
						disablePalette
					/>
				</>
			)} */}
			<SvgColor
				{...svgAttributes}
				type='fill'
				label={__('Icon', 'maxi-blocks')}
				onChange={obj => {
					onChange(obj);

					const fillColorStr = getColorRGBAString({
						firstVar: 'icon-fill',
						secondVar: `color-${obj['svg-fill-palette-color']}`,
						opacity: obj['svg-fill-palette-opacity'],
						blockStyle: parentBlockStyle,
					});

					changeSVGContent(
						obj['svg-fill-palette-status']
							? fillColorStr
							: obj['svg-fill-color'],
						'fill',
						'map-marker-icon'
					);
				}}
			/>
		</>
	);
};

export const MapPopupsControl = props => {
	const {
		onChange,
		parentBlockStyle,
		deviceType,
		changeSVGContent,
		changeSVGStrokeWidth,
		svgAttributes,
	} = props;
	const prefix = 'popup-';

	return (
		<>
			<div className='maxi-map-control__popups'>
				{Object.keys(mapPopups).map((item, index) => (
					<div
						key={`map-marker-${uniqueId()}`}
						data-item={index + 1}
						onClick={e =>
							onChange({
								'map-popup': +e.currentTarget.dataset.item,
								'map-popup-icon': ReactDOMServer.renderToString(
									mapPopups[item]
								),
							})
						}
						className={`maxi-map-control__popups__item ${
							props['map-marker'] - 1 === index
								? 'maxi-map-control__popups__item--active'
								: null
						}`}
					>
						{mapPopups[item]}
					</div>
				))}
			</div>
			<SvgColor
				{...svgAttributes}
				type='fill'
				label={__('Marker background', 'maxi-blocks')}
				onChange={obj => {
					onChange(obj);

					const fillColorStr = getColorRGBAString({
						firstVar: 'icon-',
						secondVar: `color-${
							obj[`${prefix}svg-fill-palette-color`]
						}`,
						opacity: obj[`${prefix}svg-fill-palette-opacity`],
						blockStyle: parentBlockStyle,
					});

					changeSVGContent(
						obj[`${prefix}svg-fill-palette-status`]
							? fillColorStr
							: obj[`${prefix}svg-fill-color`],
						'fill',
						'map-popup-icon'
					);
				}}
				prefix='popup-'
				disableOpacity={false}
			/>
			<SvgColor
				{...svgAttributes}
				type='line'
				label={__('Marker border', 'maxi-blocks')}
				onChange={obj => {
					onChange(obj);

					const fillColorStr = getColorRGBAString({
						firstVar: 'icon-line',
						secondVar: `color-${
							obj[`${prefix}svg-line-palette-color`]
						}`,
						opacity: obj[`${prefix}svg-line-palette-opacity`],
						blockStyle: parentBlockStyle,
					});

					changeSVGContent(
						obj[`${prefix}svg-line-palette-status`]
							? fillColorStr
							: obj[`${prefix}svg-line-color`],
						'stroke',
						'map-popup-icon'
					);
				}}
				prefix='popup-'
				disableOpacity={false}
			/>
			<SvgStrokeWidthControl
				{...svgAttributes}
				prefix={`${prefix}svg-`}
				onChange={obj => {
					onChange(obj);
					changeSVGStrokeWidth(
						obj[`${prefix}svg-stroke-${deviceType}`]
					);
				}}
				breakpoint={deviceType}
			/>
		</>
	);
};

export default MapControl;
