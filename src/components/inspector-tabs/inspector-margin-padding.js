/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AxisControl from '../axis-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const marginPadding = ({ props, prefix }) => {
	const { attributes, deviceType, setAttributes } = props;

	return {
		label: __('Margin / Padding', 'maxi-blocks'),
		content: (
			<>
				<AxisControl
					{...getGroupAttributes(attributes, 'margin', false, prefix)}
					prefix={prefix}
					label={__('Margin', 'maxi-blocks')}
					onChange={obj => setAttributes(obj)}
					breakpoint={deviceType}
					target='margin'
					optionType='string'
				/>
				<AxisControl
					{...getGroupAttributes(
						attributes,
						'padding',
						false,
						prefix
					)}
					prefix={prefix}
					label={__('Padding', 'maxi-blocks')}
					onChange={obj => setAttributes(obj)}
					breakpoint={deviceType}
					target='padding'
					disableAuto
				/>
			</>
		),
	};
};

export default marginPadding;
