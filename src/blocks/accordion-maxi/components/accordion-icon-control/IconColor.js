/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ColorControl } from '@components';
import { getAttributeValue, getColorRGBAString } from '@extensions/styles';
import { setSVGContent, setSVGContentHover } from '@extensions/svg';

const IconColor = props => {
	const { prefix, colorType, isHover = false, onChange, blockStyle } = props;

	return (
		<ColorControl
			label={__(`Icon ${colorType}`, 'maxi-blocks')}
			className='maxi-icon-styles-control--color'
			color={getAttributeValue({
				target: `${colorType}-color`,
				props,
				isHover,
				prefix,
			})}
			prefix={`${prefix}${colorType}-`}
			paletteColor={getAttributeValue({
				target: `${colorType}-palette-color`,
				props,
				isHover,
				prefix,
			})}
			paletteOpacity={getAttributeValue({
				target: `${colorType}-palette-opacity`,
				props,
				isHover,
				prefix,
			})}
			paletteStatus={getAttributeValue({
				target: `${colorType}-palette-status`,
				props,
				isHover,
				prefix,
			})}
			paletteSCStatus={getAttributeValue({
				target: `${colorType}-palette-sc-status`,
				props,
				isHover,
				prefix,
			})}
			onChange={({
				color,
				paletteColor,
				paletteStatus,
				paletteSCStatus,
				paletteOpacity,
			}) => {
				const lineColorStr = getColorRGBAString(
					paletteSCStatus
						? {
								firstVar: `color-${paletteColor}`,
								opacity: paletteOpacity,
								blockStyle,
						  }
						: {
								firstVar: `${prefix}${colorType}`,
								secondVar: `color-${paletteColor}`,
								opacity: paletteOpacity,
								blockStyle,
						  }
				);

				onChange({
					[`${prefix}${colorType}-color${isHover ? '-hover' : ''}`]:
						color,
					[`${prefix}${colorType}-palette-color${
						isHover ? '-hover' : ''
					}`]: paletteColor,
					[`${prefix}${colorType}-palette-status${
						isHover ? '-hover' : ''
					}`]: paletteStatus,
					[`${prefix}${colorType}-palette-sc-status${
						isHover ? '-hover' : ''
					}`]: paletteSCStatus,
					[`${prefix}${colorType}-palette-opacity${
						isHover ? '-hover' : ''
					}`]: paletteOpacity,
					[`${prefix}content`]: isHover
						? setSVGContentHover(
								props[`${prefix}content`],
								paletteStatus ? lineColorStr : color,
								colorType
						  )
						: setSVGContent(
								props[`${prefix}content`],
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
