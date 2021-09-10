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

/**
 * Component
 */
const SvgStrokeWidthControl = props => {
	const { onChange, breakpoint, prefix } = props;

	const stroke = props[`${prefix}stroke-${breakpoint}`];
	const defaultStroke = getDefaultAttribute(`${prefix}stroke-${breakpoint}`);

	return (
		<AdvancedNumberControl
			label={__('Stroke Width', 'maxi-blocks')}
			value={stroke}
			placeholder={
				breakpoint !== 'general'
					? getLastBreakpointAttribute(
							`${prefix}stroke`,
							breakpoint,
							props
					  )
					: null
			}
			onChangeValue={val => {
				onChange({
					[`${prefix}stroke-${breakpoint}`]:
						val !== undefined && val !== '' ? val : '',
				});
			}}
			min={0.1}
			max={5}
			step={0.1}
			onReset={() =>
				onChange({
					[`${prefix}stroke-${breakpoint}`]: defaultStroke,
				})
			}
			initialPosition={defaultStroke}
		/>
	);
};

export default SvgStrokeWidthControl;
