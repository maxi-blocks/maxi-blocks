/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
import AxisControl from '@components/axis-control';
import { getGroupAttributes } from '@extensions/styles';

const PaddingControl = props => {
	const { breakpoint, onChange, prefix } = props;

	return (
		<AxisControl
			{...getGroupAttributes(props, 'padding', false, prefix)}
			prefix={prefix}
			label='Padding'
			onChange={onChange}
			breakpoint={breakpoint}
			target='padding'
			optionType='string'
			disableAuto
			enableAxisUnits
			disableRange
		/>
	);
};

export default PaddingControl;
