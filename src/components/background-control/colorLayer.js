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
		isButton = false,
		breakpoint,
		isGeneral = false,
	} = props;

	const colorOptions = cloneDeep(props.colorOptions);

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
				defaultColor={getDefaultAttribute(
					getAttributeKey(
						'background-color',
						isHover,
						prefix,
						breakpoint
					)
				)}
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
				globalProps={
					isButton && {
						target: `${
							isHover ? 'hover-' : ''
						}background-color-global`,
						type: 'button',
					}
				}
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
						colorOptions[
							getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix,
								breakpoint
							)
						] = val;

						if (isGeneral)
							colorOptions[
								getAttributeKey(
									'background-color-clip-path',
									isHover,
									prefix,
									'general'
								)
							] = val;

						onChange(colorOptions);
					}}
				/>
			)}
		</>
	);
};

const ColorLayer = props => {
	const { breakpoint, ...rest } = props;

	return (
		<ResponsiveTabsControl breakpoint={breakpoint}>
			<ColorLayerContent {...rest} />
		</ResponsiveTabsControl>
	);
};

export default ColorLayer;
