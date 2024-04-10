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
const ariaLabel = ({ props, targets, getIcon, onChange }) => {
	const { attributes } = props;

	const defaultOnChange = ({ obj }) => {
		props.setAttributes(obj);
	};

	return {
		label: __('Aria label', 'maxi-blocks'),
		content: (
			<AriaLabelControl
				targets={targets}
				ariaLabels={attributes.ariaLabels}
				onChange={onChange ?? defaultOnChange}
				getIcon={getIcon}
			/>
		),
	};
};

export default ariaLabel;
