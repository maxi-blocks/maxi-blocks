/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AriaLabelControl from '@components/aria-label-control';
import filterAriaLabelCategories from '@components/aria-label-control/utils';

/**
 * Component
 */
const ariaLabel = ({ props, targets, blockName, getIcon, onChange }) => {
	const { attributes } = props;

	const defaultOnChange = ({ obj }) => {
		props.setAttributes(obj);
	};

	return {
		label: __('Aria label', 'maxi-blocks'),
		content: (
			<AriaLabelControl
				targets={filterAriaLabelCategories(
					targets,
					blockName,
					attributes
				)}
				ariaLabels={attributes?.ariaLabels}
				onChange={onChange ?? defaultOnChange}
				getIcon={getIcon}
			/>
		),
	};
};

export default ariaLabel;
