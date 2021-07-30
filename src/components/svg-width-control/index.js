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
const SvgWidthControl = props => {
	const { onChange } = props;

	const width = props['svg-width'];
	const defaultWidth = getDefaultAttribute('svg-width');

	return (
		<AdvancedNumberControl
			label={__('Width', 'maxi-blocks')}
			value={width}
			onChangeValue={val => {
				onChange({
					'svg-width': val !== undefined && val !== '' ? val : '',
				});
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
