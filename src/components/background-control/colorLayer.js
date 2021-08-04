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
				paletteColor={
					colorOptions[
						getAttributeKey(
							'background-palette-color',
							isHover,
							prefix
						)
					]
				}
				paletteStatus={
					colorOptions[
						getAttributeKey(
							'background-palette-color-status',
							isHover,
							prefix
						)
					]
				}
				onChange={({ color, paletteColor, paletteStatus }) => {
					if (color)
						colorOptions[
							getAttributeKey('background-color', isHover, prefix)
						] = color;
					if (paletteColor)
						colorOptions[
							getAttributeKey(
								'background-palette-color',
								isHover,
								prefix
							)
						] = paletteColor;
					if (paletteStatus)
						colorOptions[
							getAttributeKey(
								'background-palette-color-status',
								isHover,
								prefix
							)
						] = paletteColor;

					onChange({
						[getAttributeKey('background-color', isHover, prefix)]:
							color,
						[getAttributeKey(
							'background-palette-color',
							isHover,
							prefix
						)]: paletteColor,
						[getAttributeKey(
							'background-palette-color-status',
							isHover,
							prefix
						)]: paletteStatus,
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
