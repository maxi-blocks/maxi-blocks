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
	getDefaultAttribute,
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getDefaultLayerAttr } from './utils';
import getActiveAttributes from '../../extensions/active-indicators';

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
		disableClipPath,
		isHover = false,
		prefix = '',
		clientId,
		breakpoint,
		isGeneral = false,
		isLayer = false,
		globalProps,
	} = props;

	const colorOptions = cloneDeep(props.colorOptions);

	const getDefaultAttr = target => {
		if (isLayer) return getDefaultLayerAttr('colorOptions', target);

		return getDefaultAttribute(
			getAttributeKey(target, isHover, prefix, breakpoint)
		);
	};

	return (
		<>
			<ColorControl
				label={__('Background', 'maxi-blocks')}
				color={getLastBreakpointAttribute(
					`${prefix}background-color`,
					breakpoint,
					colorOptions,
					isHover
				)}
				defaultColor={getDefaultAttr('background-color')}
				paletteStatus={getLastBreakpointAttribute(
					`${prefix}background-palette-color-status`,
					breakpoint,
					colorOptions,
					isHover
				)}
				paletteColor={getLastBreakpointAttribute(
					`${prefix}background-palette-color`,
					breakpoint,
					colorOptions,
					isHover
				)}
				paletteOpacity={getLastBreakpointAttribute(
					`${prefix}background-palette-opacity`,
					breakpoint,
					colorOptions,
					isHover
				)}
				onChange={({
					color,
					paletteColor,
					paletteStatus,
					paletteOpacity,
				}) => {
					onChange({
						[getAttributeKey(
							'background-palette-color-status',
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
						...(isGeneral && {
							[getAttributeKey(
								'background-palette-color-status',
								isHover,
								prefix,
								'general'
							)]: paletteStatus,
							[getAttributeKey(
								'background-palette-color',
								isHover,
								prefix,
								'general'
							)]: paletteColor,
							[getAttributeKey(
								'background-palette-opacity',
								isHover,
								prefix,
								'general'
							)]: paletteOpacity,
							[getAttributeKey(
								'background-color',
								isHover,
								prefix,
								'general'
							)]: color,
						}),
					});
				}}
				globalProps={globalProps}
				isHover={isHover}
				clientId={clientId}
				deviceType={breakpoint}
			/>
			{!disableClipPath && (
				<ClipPath
					clipPath={getLastBreakpointAttribute(
						`${prefix}background-color-clip-path`,
						breakpoint,
						colorOptions,
						isHover
					)}
					onChange={val => {
						onChange({
							[getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix,
								breakpoint
							)]: val,
							...(isGeneral && {
								[getAttributeKey(
									'background-color-clip-path',
									isHover,
									prefix,
									'general'
								)]: val,
							}),
						});
					}}
				/>
			)}
		</>
	);
};

const ColorLayer = props => {
	const { breakpoint, ...rest } = props;

	return (
		<ResponsiveTabsControl
			breakpoint={breakpoint}
			active={getActiveAttributes(props?.colorOptions, 'breakpoints')}
		>
			<ColorLayerContent {...rest} />
		</ResponsiveTabsControl>
	);
};

export default ColorLayer;
