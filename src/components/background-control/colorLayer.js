/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import ClipPath from '../clip-path-control';
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
const ColorLayer = props => {
	const {
		onChange,
		disableClipPath,
		isHover = false,
		prefix = '',
		clientId,
		isButton = false,
		breakpoint,
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
					colorOptions
				)}
				paletteOpacity={getLastBreakpointAttribute(
					getAttributeKey(
						'background-palette-opacity',
						isHover,
						prefix,
						breakpoint
					),
					breakpoint,
					colorOptions
				)}
				onChange={({
					color,
					paletteColor,
					paletteStatus,
					paletteOpacity,
				}) => {
					if (paletteStatus)
						colorOptions[
							getAttributeKey(
								'background-palette-color-status',
								isHover,
								prefix,
								breakpoint
							)
						] = paletteColor;
					if (paletteColor)
						colorOptions[
							getAttributeKey(
								'background-palette-color',
								isHover,
								prefix,
								breakpoint
							)
						] = paletteColor;
					if (paletteOpacity)
						colorOptions[
							getAttributeKey(
								'background-palette-opacity',
								isHover,
								prefix,
								breakpoint
							)
						] = paletteOpacity;
					if (color)
						colorOptions[
							getAttributeKey(
								'background-color',
								isHover,
								prefix,
								breakpoint
							)
						] = color;

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
					clipPath={
						colorOptions[
							getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix,
								breakpoint
							)
						]
					}
					onChange={val => {
						colorOptions[
							getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix,
								breakpoint
							)
						] = val;

						onChange(colorOptions);
					}}
				/>
			)}
		</>
	);
};

export default ColorLayer;
