/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SpacingControl from '@components/spacing-control';
import { getGroupAttributes, getLastBreakpointAttribute } from '@extensions/styles';

/**
 * Component
 */
const marginPadding = ({
	props,
	prefix = '',
	customLabel,
	disableMargin = false,
}) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	const fullWidth = getLastBreakpointAttribute({
		target: `${prefix}full-width`,
		breakpoint: deviceType,
		attributes,
	});

	return {
		label: customLabel ?? __('Margin / Padding', 'maxi-blocks'),
		content: (
			<>
				<SpacingControl
					{...getGroupAttributes(
						attributes,
						['margin', 'padding'],
						false,
						prefix
					)}
					attributes={attributes}
					prefix={prefix}
					breakpoint={deviceType}
					onChange={obj => maxiSetAttributes(obj)}
					disableMargin={disableMargin}
				/>
			</>
		),
	};
};

export default marginPadding;
