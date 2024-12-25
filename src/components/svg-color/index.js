/**
 * Internal dependencies
 */
import ColorControl from '@components/color-control';
import { getAttributeValue, getColorRGBAString } from '@extensions/styles';
import { setSVGContent, setSVGContentHover } from '@extensions/svg';

/**
 * SvgColor
 */
const SvgColor = props => {
	const {
		type,
		label,
		onChangeInline = null,
		onChangeFill,
		onChangeStroke,
		onChangeHoverFill,
		onChangeHoverStroke,
		isHover = false,
		svgType,
		blockStyle,
		content,
	} = props;

	const onChange = val => {
		const { color, paletteColor, paletteStatus, paletteSCStatus } = val;

		const isNeededType = isHover
			? svgType === 'Filled'
			: type === 'line'
			? svgType !== 'Shape'
			: svgType !== 'Line';

		const paletteStr = type === 'line' ? 'stroke' : 'fill';
		const colorStr =
			isNeededType &&
			getColorRGBAString(
				paletteSCStatus
					? {
							firstVar: `color-${paletteColor}`,
							opacity: 1,
							blockStyle,
					  }
					: {
							firstVar: `icon-${paletteStr}`,
							secondVar: `color-${paletteColor}`,
							opacity: 1,
							blockStyle,
					  }
			);
		const onChangeObject = {
			[`svg-${type}-color${isHover ? '-hover' : ''}`]: color,
			[`svg-${type}-palette-color${isHover ? '-hover' : ''}`]:
				paletteColor,
			[`svg-${type}-palette-status${isHover ? '-hover' : ''}`]:
				paletteStatus,
			[`svg-${type}-palette-sc-status${isHover ? '-hover' : ''}`]:
				paletteSCStatus,
			content: (isHover ? setSVGContentHover : setSVGContent)(
				content,
				paletteStatus ? colorStr : color,
				paletteStr
			),
		};

		if (type === 'line') {
			(isHover ? onChangeHoverStroke : onChangeStroke)(onChangeObject);
		} else {
			(isHover ? onChangeHoverFill : onChangeFill)(onChangeObject);
		}
	};

	return type === 'line' ? (
		<ColorControl
			label={label}
			isHover={isHover}
			className='maxi-color-control__SVG-line-color'
			color={getAttributeValue({
				target: 'svg-line-color',
				props,
				isHover,
			})}
			prefix='svg-line-'
			avoidBreakpointForDefault
			paletteColor={getAttributeValue({
				target: 'svg-line-palette-color',
				props,
				isHover,
			})}
			paletteStatus={getAttributeValue({
				target: 'svg-line-palette-status',
				props,
				isHover,
			})}
			paletteSCStatus={getAttributeValue({
				target: 'svg-line-palette-sc-status',
				props,
				isHover,
			})}
			onChangeInline={({ color }) =>
				onChangeInline &&
				onChangeInline({ stroke: color }, '[data-stroke]')
			}
			onChange={onChange}
			globalProps={{
				target: `${isHover ? 'hover-' : ''}line`,
				type: 'icon',
			}}
			disableOpacity
		/>
	) : (
		<ColorControl
			label={label}
			isHover={isHover}
			className='maxi-color-control__SVG-fill-color'
			color={getAttributeValue({
				target: 'svg-fill-color',
				props,
				isHover,
			})}
			prefix='svg-fill-'
			avoidBreakpointForDefault
			paletteColor={getAttributeValue({
				target: 'svg-fill-palette-color',
				props,
				isHover,
			})}
			paletteStatus={getAttributeValue({
				target: 'svg-fill-palette-status',
				props,
				isHover,
			})}
			paletteSCStatus={getAttributeValue({
				target: 'svg-fill-palette-sc-status',
				props,
				isHover,
			})}
			onChangeInline={({ color }) =>
				onChangeInline && onChangeInline({ fill: color }, '[data-fill]')
			}
			onChange={onChange}
			globalProps={{
				target: `${isHover ? 'hover-' : ''}fill`,
				type: 'icon',
			}}
			disableOpacity
		/>
	);
};

export default SvgColor;
