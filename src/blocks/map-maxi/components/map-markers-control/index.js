/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SvgColor } from '../../../../components/svg-color';
import AdvancedNumberControl from '../../../../components/advanced-number-control';
import PresetsControl from '../presets-control';
import ResponsiveTabsControl from '../../../../components/responsive-tabs-control';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

/**
 * Icons
 */
import * as mapMarkers from '../../../../icons/map-icons/markers';

const MarkerSize = ({ deviceType, onChange, ...props }) => (
	<AdvancedNumberControl
		label={__('Marker size', 'maxi-blocks')}
		min={15}
		max={40}
		step={1}
		value={getLastBreakpointAttribute({
			target: 'svg-width',
			breakpoint: deviceType,
			attributes: props,
		})}
		defaultValue={getDefaultAttribute(`svg-width-${deviceType}`)}
		onChangeValue={val => {
			onChange({
				[`svg-width-${deviceType}`]: val,
			});
		}}
		onReset={() => {
			const defaultAttr = getDefaultAttribute(`svg-width-${deviceType}`);
			onChange({
				[`svg-width-${deviceType}`]: defaultAttr,
			});
		}}
		optionType='string'
	/>
);

const MapMarkersControl = props => {
	const { blockStyle, deviceType, onChangeInline, onChange } = props;
	const svgAttributes = {
		...getGroupAttributes(props, 'svg'),
		...getGroupAttributes(props, 'svgHover'),
	};

	return (
		<>
			<div className='maxi-map-markers-control'>
				<PresetsControl
					items={mapMarkers}
					onChange={(mapMarker, mapMarkerIcon) => {
						onChange({
							'map-marker': mapMarker,
							'map-marker-icon': mapMarkerIcon,
						});
					}}
					prop={props['map-marker']}
				/>
			</div>
			<SvgColor
				{...svgAttributes}
				type='fill'
				label={__('Marker fill', 'maxi-blocks')}
				onChangeInline={onChangeInline}
				onChangeFill={({ content, ...rest }) => {
					onChange({
						'map-marker-icon': content,
						...rest,
					});
				}}
				blockStyle={blockStyle}
				content={props['map-marker-icon']}
			/>
			<SvgColor
				{...svgAttributes}
				type='line'
				label={__('Marker stroke', 'maxi-blocks')}
				onChangeInline={onChangeInline}
				onChangeStroke={({ content, ...rest }) => {
					onChange({
						'map-marker-icon': content,
						...rest,
					});
				}}
				blockStyle={blockStyle}
				content={props['map-marker-icon']}
			/>
			<ResponsiveTabsControl breakpoint={deviceType}>
				<MarkerSize
					// giving only svg-width related attributes to the control
					{...Object.entries(getGroupAttributes(props, 'svg')).reduce(
						(acc, [key, value]) => {
							if (key.includes('svg-width-')) {
								acc[key] = value;
							}

							return acc;
						},
						{}
					)}
					onChange={onChange}
					deviceType={deviceType}
				/>
			</ResponsiveTabsControl>
		</>
	);
};

export default MapMarkersControl;
