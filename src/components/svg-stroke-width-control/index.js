/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';

/**
 * Component
 */
const SvgStrokeWidthControl = props => {
	const { onChange } = props;

	const stroke = props['svg-stroke'];
	const defaultStroke = getDefaultAttribute('svg-stroke');

	return (
		<AdvancedNumberControl
			label={__('Stroke Width', 'maxi-blocks')}
			value={stroke}
			onChangeValue={val => {
				onChange({
					'svg-stroke': val !== undefined && val !== '' ? val : '',
				});
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
