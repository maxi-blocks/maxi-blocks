/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AxisControl from '@components/axis-control';
import { getGroupAttributes } from '@extensions/styles';

const MarginControl = props => {
	const { breakpoint, fullWidth, noResponsiveTabs, onChange, prefix } = props;

	return (
		<AxisControl
			{...getGroupAttributes(props, 'margin', false, prefix)}
			prefix={prefix}
			label={__('Margin', 'maxi-blocks')}
			onChange={onChange}
			breakpoint={breakpoint}
			target='margin'
			optionType='string'
			fullWidth={fullWidth}
			noResponsiveTabs={noResponsiveTabs}
			minMaxSettings={{
				px: {
					min: -999,
					max: 999,
					step: 1,
				},
				em: {
					min: -999,
					max: 999,
					step: 0.1,
				},
				vw: {
					min: -999,
					max: 999,
					step: 0.1,
				},
				'%': {
					min: -999,
					max: 999,
					step: 0.1,
				},
			}}
			enableAxisUnits
		/>
	);
};

export default MarginControl;
