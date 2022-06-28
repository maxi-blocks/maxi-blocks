/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import CustomCssControl from '../custom-css-control';
import { getGroupAttributes } from '../../extensions/styles';
import { getSelectorsCss, getCategoriesCss } from '../custom-css-control/utils';

/**
 * Component
 */
const customCss = ({
	props,
	breakpoint = 'general',
	selectors,
	categories,
}) => {
	const { attributes, maxiSetAttributes } = props;

	const customCssCategory = attributes['custom-css-category'];

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<CustomCssControl
				{...getGroupAttributes(attributes, 'customCss')}
				breakpoint={breakpoint}
				categories={getCategoriesCss(categories, attributes)}
				category={customCssCategory}
				selectors={getSelectorsCss(selectors, attributes)}
				onChange={(attr, val) =>
					maxiSetAttributes({
						[attr]: val,
					})
				}
			/>
		),
		extraIndicators: [`custom-css-${breakpoint}`],
	};
};

export default customCss;
