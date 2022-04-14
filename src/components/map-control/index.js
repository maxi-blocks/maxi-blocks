/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl, TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import AxisControl from '../axis-control';
import BoxShadowControl from '../box-shadow-control';
import BackgroundControl from '../background-control';
import ColorControl from '../color-control';
import InfoBox from '../info-box';
import ToggleSwitch from '../toggle-switch';
import OpacityControl from '../opacity-control';
import SettingTabsControl from '../setting-tabs-control';
import SvgColor from '../svg-color';
import {
	getDefaultAttribute,
	getColorRGBAString,
	getGroupAttributes,
	getLastBreakpointAttribute,
	setHoverAttributes,
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
	const { onChange, parentBlockStyle, deviceType, changeSVGContent } = props;

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
			{props['map-provider'] === 'openstreetmap' ? (
				<>
					<OpacityControl
						label={__('Icon opacity', 'maxi-blocks')}
						opacity={props['svg-fill-palette-opacity']}
						onChange={val => {
							onChange({
								'svg-fill-palette-opacity': val,
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
						value={getLastBreakpointAttribute({
							target: 'svg-width',
							breakpoint: deviceType,
							attributes: props,
						})}
						onChangeValue={val => {
							onChange({
								[`svg-width-${deviceType}`]: val,
							});

							changeSVGContent(val, ' width');
						}}
						onReset={() => {
							const defaultAttr =
								getDefaultAttribute('svg-width-general');
							onChange({
								[`svg-width-${deviceType}`]: defaultAttr,
							});
							changeSVGContent(defaultAttr, ' width');
						}}
					/>
					<SvgColor
						{...props}
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
								'fill'
							);
						}}
					/>
				</>
			) : (
				<>
					<OpacityControl
						label={__('Marker Opacity', 'maxi-blocks')}
						opacity={props['map-marker-opacity']}
						onChange={val =>
							onChange({
								'map-marker-opacity': val,
							})
						}
					/>
					<AdvancedNumberControl
						label={__('Marker Scale', 'maxi-blocks')}
						min={1}
						max={10}
						initial={1}
						step={1}
						value={props['map-marker-scale']}
						onChangeValue={val =>
							onChange({ 'map-marker-scale': val })
						}
						onReset={() =>
							onChange({
								'map-marker-scale':
									getDefaultAttribute('map-marker-scale'),
							})
						}
					/>
					<ToggleSwitch
						label={__('Custom Maker Colours', 'maxi-block')}
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
									onChange({
										'map-marker-stroke-color': color,
									})
								}
								disablePalette
							/>
						</>
					)}
				</>
			)}
		</>
	);
};

export const MapPopupsControl = props => {
	const { onChange, clientId, deviceType, attributes } = props;
	const prefix = 'popup-';
	const hoverStatus = attributes[`${prefix}box-shadow-status-hover`];

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
			<BackgroundControl
				{...getGroupAttributes(
					attributes,
					['background', 'backgroundColor'],
					false,
					prefix
				)}
				prefix={prefix}
				onChange={obj => onChange(obj)}
				disableNoneStyle
				disableImage
				disableGradient
				disableVideo
				disableSVG
				disableClipPath
				clientId={clientId}
				breakpoint={deviceType}
			/>
			<ColorControl
				label={__('Border', 'maxi-blocks')}
				color={getLastBreakpointAttribute({
					target: `${prefix}border-color`,
					breakpoint: deviceType,
					attributes,
				})}
				prefix={`${prefix}border-`}
				useBreakpointForDefault
				paletteStatus={getLastBreakpointAttribute({
					target: `${prefix}border-palette-status`,
					breakpoint: deviceType,
					attributes,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: `${prefix}border-palette-color`,
					breakpoint: deviceType,
					attributes,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: `${prefix}border-palette-opacity`,
					breakpoint: deviceType,
					attributes,
				})}
				onChange={({
					paletteColor,
					paletteStatus,
					paletteOpacity,
					color,
				}) => {
					onChange({
						[`${prefix}border-palette-status-${deviceType}`]:
							paletteStatus,
						[`${prefix}border-palette-color-${deviceType}`]:
							paletteColor,
						[`${prefix}border-palette-opacity-${deviceType}`]:
							paletteOpacity,
						[`${prefix}border-color-${deviceType}`]: color,
					});
				}}
				disableImage
				disableVideo
				disableGradient
				deviceType={deviceType}
				clientId={clientId}
			/>
			<AxisControl
				{...getGroupAttributes(
					attributes,
					'borderWidth',
					false,
					prefix
				)}
				target={`${prefix}border`}
				auxTarget='width'
				label={__('Border width', 'maxi-blocks')}
				onChange={obj => onChange(obj)}
				breakpoint={deviceType}
				allowedUnits={['px', 'em', 'vw']}
				minMaxSettings={{
					px: {
						min: 0,
						max: 99,
					},
					em: {
						min: 0,
						max: 10,
					},
					vw: {
						min: 0,
						max: 10,
					},
				}}
				disableAuto
			/>
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<BoxShadowControl
								{...getGroupAttributes(
									attributes,
									'boxShadow',
									false,
									prefix
								)}
								prefix={prefix}
								onChange={obj => onChange(obj)}
								breakpoint={deviceType}
								clientId={clientId}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable Box Shadow Hover',
										'maxi-blocks'
									)}
									selected={hoverStatus}
									className='maxi-box-shadow-status-hover'
									onChange={val =>
										onChange({
											...(val &&
												setHoverAttributes(
													{
														...getGroupAttributes(
															attributes,
															'boxShadow',
															false,
															prefix
														),
													},
													{
														...getGroupAttributes(
															attributes,
															'boxShadow',
															true,
															prefix
														),
													}
												)),
											[`${prefix}box-shadow-status-hover`]:
												val,
										})
									}
								/>
								{hoverStatus && (
									<BoxShadowControl
										{...getGroupAttributes(
											attributes,
											'boxShadow',
											true,
											prefix
										)}
										prefix={prefix}
										onChange={obj => onChange(obj)}
										breakpoint={deviceType}
										isHover
										clientId={clientId}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}box-shadow-status-hover`],
					},
				]}
			/>
		</>
	);
};

export default MapControl;
