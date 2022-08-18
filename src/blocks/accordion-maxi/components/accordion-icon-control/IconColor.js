/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ColorControl } from '../../../../components';
import { getColorRGBAString } from '../../../../extensions/styles';
import { setSVGContent, setSVGContentHover } from '../../../../extensions/svg';

const IconColor = props => {
	const { prefix, colorType, isHover = false, onChange, blockStyle } = props;
	return (
		<ColorControl
			label={__(`Icon ${colorType}`, 'maxi-blocks')}
			className='maxi-icon-styles-control--color'
			color={
				props[`${prefix}${colorType}-color${isHover ? '-hover' : ''}`]
			}
			prefix={`${prefix}${colorType}-`}
			paletteColor={
				props[
					`${prefix}${colorType}-palette-color${
						isHover ? '-hover' : ''
					}`
				]
			}
			paletteOpacity={
				props[
					`${prefix}${colorType}-palette-opacity${
						isHover ? '-hover' : ''
					}`
				]
			}
			paletteStatus={
				props[
					`${prefix}${colorType}-palette-status${
						isHover ? '-hover' : ''
					}`
				]
			}
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

				onChange({
					[`${prefix}${colorType}-color${isHover ? '-hover' : ''}`]:
						color,
					[`${prefix}${colorType}-palette-color${
						isHover ? '-hover' : ''
					}`]: paletteColor,
					[`${prefix}${colorType}-palette-status${
						isHover ? '-hover' : ''
					}`]: paletteStatus,
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
