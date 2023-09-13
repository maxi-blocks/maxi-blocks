/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedCssControl from '../advanced-css-control';

/**
 * Component
 */
const advancedCss = ({ props }) => {
	const { attributes, maxiSetAttributes } = props;

	return {
		label: __('Advanced CSS', 'maxi-blocks'),
		content: (
			<AdvancedCssControl
				value={attributes['advanced-css']}
				onChange={value =>
					maxiSetAttributes({
						'advanced-css': value,
					})
				}
			/>
		),
	};
};

export default advancedCss;
