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
const SvgWidthControl = props => {
	const { defaultWidth, width, onChange } = props;

	return (
		<AdvancedNumberControl
			label={__('Stroke Width', 'maxi-blocks')}
			value={width}
			onChangeValue={val => {
				onChange(val !== undefined && val !== '' ? val : '');
			}}
			min={10}
			max={500}
			step={1}
			onReset={() => onChange(defaultWidth)}
			initialPosition={defaultWidth}
		/>
	);
};

export default SvgWidthControl;
