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
import { SvgColor } from '../svg-color';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
	setHoverAttributes,
} from '../../extensions/styles';
import { setSVGContent } from '../../extensions/svg';

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
		</div>
	);
};

export const MapMarkersControl = props => {
	const { onChange, deviceType } = props;

	const getMarkerItemClasses = (mapMarker, index) => {
		const classes = classnames(
			'maxi-map-control__markers__item',
			mapMarker - 1 === index && 'maxi-map-control__markers__item--active'
		);

		return classes;
	};

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
						className={getMarkerItemClasses(
							props['map-marker'],
							index
						)}
					>
						{mapMarkers[item]}
					</div>
				))}
			</div>
			<OpacityControl
				label={__('Icon opacity', 'maxi-blocks')}
				opacity={props['svg-fill-palette-opacity']}
				onChange={val =>
					onChange({
						'svg-fill-palette-opacity': val,
						'map-marker-icon': setSVGContent(
							props['map-marker-icon'],
							val,
							'opacity'
						),
					})
				}
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
						'map-marker-icon': setSVGContent(
							props['map-marker-icon'],
							val,
							' width'
						),
					});
				}}
				onReset={() => {
					const defaultAttr =
						getDefaultAttribute('svg-width-general');
					onChange({
						[`svg-width-${deviceType}`]: defaultAttr,
						'map-marker-icon': setSVGContent(
							props['map-marker-icon'],
							defaultAttr,
							' width'
						),
					});
				}}
			/>
			<SvgColor
				{...props}
				type='fill'
				label={__('Icon', 'maxi-blocks')}
				onChangeFill={({ content, ...rest }) => {
					onChange({
						'map-marker-icon': content,
						...rest,
					});
				}}
				content={props['map-marker-icon']}
			/>
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
