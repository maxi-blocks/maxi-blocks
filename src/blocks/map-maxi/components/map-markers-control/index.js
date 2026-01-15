/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { RawHTML, renderToString } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	DefaultStylesControl,
	ResponsiveTabsControl,
	SvgColor,
} from '@components';
import { setSVGContentWithBlockStyle } from '@extensions/svg';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
	getColorRGBAString,
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
		onChangeValue={(val, meta) => {
			onChange({
				[`svg-width-${deviceType}`]: val,
				meta,
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

	const {
		'svg-fill-palette-status': fillPaletteStatus,
		'svg-fill-palette-sc-status': fillPaletteSCStatus,
		'svg-fill-palette-color': fillPaletteColor,
		'svg-fill-palette-opacity': fillPaletteOpacity,
		'svg-fill-color': fillDirectColor,
		'svg-line-palette-status': linePaletteStatus,
		'svg-line-palette-sc-status': linePaletteSCStatus,
		'svg-line-palette-color': linePaletteColor,
		'svg-line-palette-opacity': linePaletteOpacity,
		'svg-line-color': lineDirectColor,
	} = svgAttributes;

	const fillPaletteColorVar =
		fillPaletteColor != null ? `color-${fillPaletteColor}` : null;
	const fillPaletteSCColor = fillPaletteColorVar;
	const resolvedFill =
		fillPaletteColorVar && (fillPaletteStatus || fillPaletteSCStatus)
			? getColorRGBAString(
					fillPaletteSCStatus
						? {
								firstVar: fillPaletteSCColor,
								opacity: fillPaletteOpacity,
								blockStyle,
						  }
						: {
								firstVar: 'icon-fill',
								secondVar: fillPaletteColorVar,
								opacity: fillPaletteOpacity,
								blockStyle,
						  }
			  )
			: fillDirectColor || 'var(--maxi-icon-block-orange)';

	const linePaletteColorVar =
		linePaletteColor != null ? `color-${linePaletteColor}` : null;
	const linePaletteSCColor = linePaletteColorVar;
	const resolvedStroke =
		linePaletteColorVar && (linePaletteStatus || linePaletteSCStatus)
			? getColorRGBAString(
					linePaletteSCStatus
						? {
								firstVar: linePaletteSCColor,
								opacity: linePaletteOpacity,
								blockStyle,
						  }
						: {
								firstVar: 'icon-stroke',
								secondVar: linePaletteColorVar,
								opacity: linePaletteOpacity,
								blockStyle,
						  }
			  )
			: lineDirectColor || '#081219';

	const applyMarkerColors = svgContent =>
		setSVGContentWithBlockStyle(svgContent, resolvedFill, resolvedStroke);

	const markerPresets = Object.values(mapMarkers).map((value, rawIndex) => {
		const index = rawIndex + 1;
		const rawContent = renderToString(value);
		const coloredContent = applyMarkerColors(rawContent);

		return {
			label: __(`Default marker ${index}`, 'maxi-blocks'),
			content: <RawHTML>{coloredContent}</RawHTML>,
			activeItem: index === mapMarker,
			onChange: () =>
				onChange({
					'map-marker': index,
					'map-marker-icon': applyMarkerColors(rawContent),
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
