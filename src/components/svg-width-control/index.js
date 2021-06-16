/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';

/**
 * Component
 */
const SvgWidthControl = props => {
	const { defaultWidth, width, onChange } = props;

	return (
		<SizeControl
			label={__('Stroke Width', 'maxi-blocks')}
			placeholder=''
			disableUnit
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
