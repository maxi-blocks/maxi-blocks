/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import MarginControl from '../margin-control';
import PaddingControl from '../padding-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const marginPadding = ({
	props,
	prefix,
	customLabel,
	disableMargin = false,
}) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

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
