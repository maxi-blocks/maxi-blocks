/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AriaLabelControl from '../aria-label-control';

/**
 * Component
 */
const ariaLabel = ({ props, targets }) => {
	const { attributes, maxiSetAttributes } = props;

	return {
		label: __('Aria label', 'maxi-blocks'),
		content: (
			<AriaLabelControl
				targets={targets}
				ariaLabels={attributes.ariaLabels}
				onChange={maxiSetAttributes}
			/>
		),
	};
};

export default ariaLabel;
