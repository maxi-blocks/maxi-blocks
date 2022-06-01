/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import ClipPath from '../clip-path-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import { getDefaultLayerAttr } from './utils';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const ColorLayerContent = props => {
	const {
		onChange,
		onChangeInline,
		disableClipPath,
		isHover = false,
		prefix = '',
		clientId,
		breakpoint,
		isLayer = false,
		globalProps,
		isToolbar = false,
	} = props;

	const colorOptions = cloneDeep(props.colorOptions);

	const getDefaultAttr = () => {
		const prefix = 'background-';

		if (isLayer) {
			const defaultColor = {};
			defaultColor.paletteStatus = getDefaultLayerAttr(
				'colorOptions',
				`${prefix}palette-status`
			);
			defaultColor.paletteColor = getDefaultLayerAttr(
				'colorOptions',
				`${prefix}palette-color`
			);
			defaultColor.paletteOpacity = getDefaultLayerAttr(
				'colorOptions',
				`${prefix}palette-opacity`
			);
			defaultColor.color = getDefaultLayerAttr(
				'colorOptions',
				`${prefix}color`
			);

			return defaultColor;
		}

		return null;
	};

	return (
		<>
			<ColorControl
				label={__('Background', 'maxi-blocks')}
				color={getLastBreakpointAttribute({
					target: `${prefix}background-color`,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				prefix={`${prefix}background-`}
				defaultColorAttributes={getDefaultAttr()}
				paletteStatus={getLastBreakpointAttribute({
					target: `${prefix}background-palette-status`,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: `${prefix}background-palette-color`,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: `${prefix}background-palette-opacity`,
					breakpoint,
					attributes: colorOptions,
					isHover,
				})}
				onChangeInline={({ color }) => {
					onChangeInline({
						'background-color': color,
					});
				}}
				onChange={({
					color,
					paletteColor,
					paletteStatus,
					paletteOpacity,
				}) => {
					onChange({
						[getAttributeKey(
							'background-palette-status',
							isHover,
							prefix,
							breakpoint
						)]: paletteStatus,
						[getAttributeKey(
							'background-palette-color',
							isHover,
							prefix,
							breakpoint
						)]: paletteColor,
						[getAttributeKey(
							'background-palette-opacity',
							isHover,
							prefix,
							breakpoint
						)]: paletteOpacity,
						[getAttributeKey(
							'background-color',
							isHover,
							prefix,
							breakpoint
						)]: color,
					});
				}}
				globalProps={globalProps}
				isHover={isHover}
				clientId={clientId}
				deviceType={breakpoint}
				isToolbar={isToolbar}
			/>
			{!disableClipPath && (
				<ClipPath
					onChange={onChange}
					{...getGroupAttributes(
						props,
						'clipPath',
						false,
						'background-color-'
					)}
					{...colorOptions}
					isHover={isHover}
					prefix='background-color-'
					breakpoint={breakpoint}
				/>
			)}
		</>
	);
};

const ColorLayer = props => {
	const { breakpoint, disableResponsiveTabs = false, ...rest } = props;

	if (disableResponsiveTabs)
		return <ColorLayerContent breakpoint={breakpoint} {...rest} />;

	return (
		<ResponsiveTabsControl breakpoint={breakpoint}>
			<ColorLayerContent {...rest} />
		</ResponsiveTabsControl>
	);
};

export default ColorLayer;
