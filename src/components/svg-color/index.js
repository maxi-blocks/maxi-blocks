/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import {
	getAttributeKey,
	getAttributesValue,
} from '../../extensions/attributes';
import { getColorRGBAString } from '../../extensions/styles';
import { setSVGContent, setSVGContentHover } from '../../extensions/svg';

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
		const { color, paletteColor, paletteStatus } = val;

		const isNeededType = isHover
			? svgType === 'Filled'
			: type === 'line'
			? svgType !== 'Shape'
			: svgType !== 'Line';

		const paletteStr = type === 'line' ? 'stroke' : 'fill';
		const colorStr =
			isNeededType &&
			getColorRGBAString({
				firstVar: `icon-${paletteStr}`,
				secondVar: `color-${paletteColor}`,
				opacity: 1,
				blockStyle,
			});
		const onChangeObject = {
			[getAttributeKey('_cc', isHover, `svg-${type}-`)]: color,
			[getAttributeKey('_pc', isHover, `svg-${type}-`)]: paletteColor,
			[getAttributeKey('_ps', isHover, `svg-${type}-`)]: paletteStatus,
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
			color={getAttributesValue({
				target: 'svg-line-color',
				props,
				isHover,
			})}
			prefix='svg-line-'
			avoidBreakpointForDefault
			paletteColor={getAttributesValue({
				target: 'svg-line-palette-color',
				props,
				isHover,
			})}
			paletteStatus={getAttributesValue({
				target: 'svg-line-palette-status',
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
			color={getAttributesValue({
				target: 'svg-fill-color',
				props,
				isHover,
			})}
			prefix='svg-fill-'
			avoidBreakpointForDefault
			paletteColor={getAttributesValue({
				target: 'svg-fill-palette-color',
				props,
				isHover,
			})}
			paletteStatus={getAttributesValue({
				target: 'svg-fill-palette-status',
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
