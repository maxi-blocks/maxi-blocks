/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';

/**
 * Component
 */
const SvgStrokeWidthControl = props => {
	const { defaultStroke, stroke, onChange } = props;

	return (
		<AdvancedNumberControl
			label={__('Stroke Width', 'maxi-blocks')}
			value={stroke}
			onChangeValue={val => {
				onChange(val !== undefined && val !== '' ? val : '');
			}}
			min={0.1}
			max={5}
			step={0.1}
			onReset={() => onChange(defaultStroke)}
			initialPosition={defaultStroke}
		/>
	);
};

export default SvgStrokeWidthControl;
