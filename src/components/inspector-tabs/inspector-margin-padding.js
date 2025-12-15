/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SpacingControl from '@components/spacing-control';

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

	return {
		label: customLabel ?? __('Margin / Padding', 'maxi-blocks'),
		content: (
			<>
				<SpacingControl
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
