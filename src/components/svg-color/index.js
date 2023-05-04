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
			[getAttributeKey('_cc', isHover, `s${type.slice(0, 2)}-`)]: color,
			[getAttributeKey('_pc', isHover, `s${type.slice(0, 2)}-`)]:
				paletteColor,
			[getAttributeKey('_ps', isHover, `s${type.slice(0, 2)}-`)]:
				paletteStatus,
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
				target: 'sli_cc',
				props,
				isHover,
			})}
			prefix='sli-'
			avoidBreakpointForDefault
			paletteColor={getAttributesValue({
				target: 'sli_pc',
				props,
				isHover,
			})}
			paletteStatus={getAttributesValue({
				target: 'sli_ps',
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
				target: 'sfi_cc',
				props,
				isHover,
			})}
			prefix='sfi-'
			avoidBreakpointForDefault
			paletteColor={getAttributesValue({
				target: 'sfi_pc',
				props,
				isHover,
			})}
			paletteStatus={getAttributesValue({
				target: 'sfi_ps',
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
