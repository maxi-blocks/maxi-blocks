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
	const { onChange, breakpoint } = props;

	const stroke = props[`svg-stroke-${breakpoint}`];
	const defaultStroke = getDefaultAttribute(`svg-stroke-${breakpoint}`);

	return (
		<AdvancedNumberControl
			label={__('Stroke Width', 'maxi-blocks')}
			value={stroke}
			placeholder={
				breakpoint !== 'general'
					? getLastBreakpointAttribute(
							'svg-stroke',
							breakpoint,
							props
					  )
					: null
			}
			onChangeValue={val => {
				onChange({
					[`svg-stroke-${breakpoint}`]:
						val !== undefined && val !== '' ? val : '',
				});
			}}
			min={0.1}
			max={5}
			step={0.1}
			onReset={() =>
				onChange({
					[`svg-stroke-${breakpoint}`]: defaultStroke,
				})
			}
			initialPosition={defaultStroke}
		/>
	);
};

export default SvgStrokeWidthControl;
