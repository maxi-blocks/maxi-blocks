/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import MarginControl from '@components/margin-control';
import PaddingControl from '@components/padding-control';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';

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
				{!disableMargin && (
					<MarginControl
						{...getGroupAttributes(
							attributes,
							'margin',
							false,
							prefix
						)}
						prefix={prefix}
						onChange={obj => maxiSetAttributes(obj)}
						breakpoint={deviceType}
						fullWidth={fullWidth}
					/>
				)}
				<PaddingControl
					{...getGroupAttributes(
						attributes,
						'padding',
						false,
						prefix
					)}
					prefix={prefix}
					onChange={obj => maxiSetAttributes(obj)}
					breakpoint={deviceType}
				/>
			</>
		),
	};
};

export default marginPadding;
