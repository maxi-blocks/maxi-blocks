/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedCssControl from '@components/advanced-css-control';
import { getAttributeKey, getGroupAttributes } from '@extensions/styles';

/**
 * Component
 */
const advancedCss = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Advanced CSS', 'maxi-blocks'),
		content: (
			<AdvancedCssControl
				{...getGroupAttributes(attributes, 'advancedCss')}
				breakpoint={deviceType}
				onChange={value =>
					maxiSetAttributes({
						[getAttributeKey(
							'advanced-css',
							false,
							null,
							deviceType
						)]: value,
					})
				}
			/>
		),
	};
};

export default advancedCss;
