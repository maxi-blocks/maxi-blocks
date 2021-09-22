/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import ClipPath from '../clip-path-control';
import { getDefaultAttribute, getAttributeKey } from '../../extensions/styles';

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
		isHover,
		prefix,
		clientId,
		isButton = false,
	} = props;

	const colorOptions = cloneDeep(props.colorOptions);

	return (
		<>
			<ColorControl
				label={__('Background', 'maxi-blocks')}
				color={
					colorOptions[
						getAttributeKey('background-color', isHover, prefix)
					]
				}
				defaultColor={getDefaultAttribute(
					getAttributeKey('background-color', isHover, prefix)
				)}
				paletteStatus={
					colorOptions[
						getAttributeKey(
							'background-palette-color-status',
							isHover,
							prefix
						)
					]
				}
				paletteColor={
					colorOptions[
						getAttributeKey(
							'background-palette-color',
							isHover,
							prefix
						)
					]
				}
				paletteOpacity={
					colorOptions[
						getAttributeKey(
							'background-palette-opacity',
							isHover,
							prefix
						)
					]
				}
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
								prefix
							)
						] = paletteColor;
					if (paletteColor)
						colorOptions[
							getAttributeKey(
								'background-palette-color',
								isHover,
								prefix
							)
						] = paletteColor;
					if (paletteOpacity)
						colorOptions[
							getAttributeKey(
								'background-palette-opacity',
								isHover,
								prefix
							)
						] = paletteOpacity;
					if (color)
						colorOptions[
							getAttributeKey('background-color', isHover, prefix)
						] = color;

					onChange({
						[getAttributeKey(
							'background-palette-color-status',
							isHover,
							prefix
						)]: paletteStatus,
						[getAttributeKey(
							'background-palette-color',
							isHover,
							prefix
						)]: paletteColor,
						[getAttributeKey(
							'background-palette-opacity',
							isHover,
							prefix
						)]: paletteOpacity,
						[getAttributeKey('background-color', isHover, prefix)]:
							color,
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
				showPalette
				isHover={isHover}
				clientId={clientId}
			/>
			{!disableClipPath && (
				<ClipPath
					clipPath={
						colorOptions[
							getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix
							)
						]
					}
					onChange={val => {
						colorOptions[
							getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix
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
