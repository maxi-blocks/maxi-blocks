/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import CustomCssControl from '../custom-css-control';
import {
	getLastBreakpointAttribute,
	getAttributesValue,
} from '../../extensions/attributes';
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

	const customCssValue = getLastBreakpointAttribute({
		target: 'custom-css',
		breakpoint,
		attributes,
	});
	const customCssCategory = getAttributesValue({
		target: 'custom-css-category',
		attributes,
	});

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<CustomCssControl
				breakpoint={breakpoint}
				categories={getCategoriesCss(categories, attributes)}
				category={customCssCategory}
				selectors={getSelectorsCss(selectors, attributes)}
				value={customCssValue}
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
