/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import { setSVGStrokeWidth } from '../../extensions/svg';

/**
 * Component
 */
const SvgStrokeWidthControl = props => {
	const { onChange, breakpoint, prefix, content, isHover = false } = props;

	const stroke =
		props[`${prefix}stroke-${breakpoint}${isHover ? '-hover' : ''}`];
	const defaultStroke = getDefaultAttribute(`${prefix}stroke-${breakpoint}`);

	return (
		<AdvancedNumberControl
			label={__('Stroke width', 'maxi-blocks')}
			value={stroke || defaultStroke}
			placeholder={
				breakpoint !== 'general'
					? getLastBreakpointAttribute({
							target: `${prefix}stroke`,
							breakpoint,
							attributes: props,
							isHover,
					  })
					: null
			}
			onChangeValue={rawVal => {
				const val = rawVal !== undefined && rawVal !== '' ? rawVal : '';

				onChange({
					[`${prefix}stroke-${breakpoint}${isHover ? '-hover' : ''}`]:
						val !== undefined && val !== '' ? val : '',
					[`${prefix === 'svg-' ? '' : prefix}content`]:
						setSVGStrokeWidth(content, val),
				});
			}}
			min={0.1}
			max={5}
			step={0.1}
			onReset={() =>
				onChange({
					[`${prefix}stroke-${breakpoint}${isHover ? '-hover' : ''}`]:
						defaultStroke,
				})
			}
			defaultValue={defaultStroke}
			initialPosition={defaultStroke}
		/>
	);
};

export default SvgStrokeWidthControl;
