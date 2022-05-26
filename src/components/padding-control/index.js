/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AxisControl from '../axis-control';
import { getGroupAttributes } from '../../extensions/styles';

const PaddingControl = props => {
	const { blockFullWidth, breakpoint, onChange, prefix } = props;

	return (
		<AxisControl
			{...getGroupAttributes(props, 'padding', false, prefix)}
			prefix={prefix}
			label={__('Padding', 'maxi-blocks')}
			onChange={onChange}
			breakpoint={breakpoint}
			target='padding'
			optionType='string'
			blockFullWidth={blockFullWidth}
			disableAuto
			enableAxisUnits
		/>
	);
};

export default PaddingControl;
