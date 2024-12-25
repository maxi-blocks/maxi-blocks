/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { renderToString } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	DefaultStylesControl,
	ResponsiveTabsControl,
	SvgColor,
} from '@components';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * Icons
 */
import * as mapMarkers from '@maxi-icons/map-icons/markers';

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
				isReset: true,
			});
		}}
		optionType='string'
	/>
);

const MapMarkersControl = props => {
	const {
		blockStyle,
		deviceType,
		'map-marker': mapMarker,
		onChangeInline,
		onChange,
	} = props;
	const svgAttributes = {
		...getGroupAttributes(props, 'svg'),
		...getGroupAttributes(props, 'svgHover'),
	};

	const markerPresets = Object.values(mapMarkers).map((value, rawIndex) => {
		const index = rawIndex + 1;

		return {
			label: __(`Default marker ${index}`, 'maxi-blocks'),
			content: value,
			activeItem: index === mapMarker,
			onChange: () =>
				onChange({
					'map-marker': index,
					'map-marker-icon': renderToString(value),
				}),
		};
	});

	return (
		<div className='maxi-map-markers-control'>
			<DefaultStylesControl
				className='maxi-map-markers-control__marker-presets'
				items={markerPresets}
			/>
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
		</div>
	);
};

export default MapMarkersControl;
