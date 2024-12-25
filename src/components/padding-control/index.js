/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
			label={__('Padding', 'maxi-blocks')}
			onChange={onChange}
			breakpoint={breakpoint}
			target='padding'
			optionType='string'
			disableAuto
			enableAxisUnits
		/>
	);
};

export default PaddingControl;
