/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ColorControl } from '../../../../components';
import {
	getAttributeKey,
	getAttributesValue,
	getColorRGBAString,
} from '../../../../extensions/styles';
import { setSVGContent, setSVGContentHover } from '../../../../extensions/svg';

const IconColor = props => {
	const { prefix, colorType, isHover = false, onChange, blockStyle } = props;
	return (
		<ColorControl
			label={__(`Icon ${colorType}`, 'maxi-blocks')}
			className='maxi-icon-styles-control--color'
			color={getAttributesValue({
				target: `${colorType}-color`,
				props,
				isHover,
				prefix,
			})}
			prefix={`${prefix}${colorType}-`}
			paletteColor={getAttributesValue({
				target: `${colorType}-palette-color`,
				props,
				isHover,
				prefix,
			})}
			paletteOpacity={getAttributesValue({
				target: `${colorType}-palette-opacity`,
				props,
				isHover,
				prefix,
			})}
			paletteStatus={getAttributesValue({
				target: `${colorType}-palette-status`,
				props,
				isHover,
				prefix,
			})}
			onChange={({
				color,
				paletteColor,
				paletteStatus,
				paletteOpacity,
			}) => {
				const lineColorStr = getColorRGBAString({
					firstVar: `${prefix}${colorType}`,
					secondVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle,
				});

				const palettePrefix = `${prefix}${colorType}-`;

				onChange({
					[getAttributeKey('color', isHover, palettePrefix)]: color,
					[getAttributeKey('palette-color', isHover, palettePrefix)]:
						paletteColor,
					[getAttributeKey('palette-status', isHover, palettePrefix)]:
						paletteStatus,
					[getAttributeKey(
						'palette-opacity',
						isHover,
						palettePrefix
					)]: paletteOpacity,
					[getAttributeKey('content', isHover, prefix)]: isHover
						? setSVGContentHover(
								getAttributesValue({
									target: 'content',
									prefix,
									props,
								}),
								paletteStatus ? lineColorStr : color,
								colorType
						  )
						: setSVGContent(
								getAttributesValue({
									target: 'content',
									prefix,
									props,
								}),
								paletteStatus ? lineColorStr : color,
								colorType
						  ),
				});
			}}
			isHover={isHover}
		/>
	);
};

export default IconColor;
