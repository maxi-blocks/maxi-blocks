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
	getBlockStyle,
} from '../../extensions/styles';
import { getSCPropValue } from '../../extensions/style-cards';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const ColorLayer = props => {
	const { onChange, disableClipPath, isHover, prefix, clientId, type } =
		props;

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
				disablePalette={type === 'layer'}
				globalStatus={getSCPropValue(
					'background-color-global',
					getBlockStyle(clientId),
					'button'
				)}
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
