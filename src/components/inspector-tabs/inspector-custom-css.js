/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import CustomCssControl from '../custom-css-control';
import { getLastBreakpointAttribute } from '../../extensions/attributes';
import { getSelectorsCss, getCategoriesCss } from '../custom-css-control/utils';

/**
 * Component
 */
const customCss = ({ props, breakpoint = 'g', selectors, categories }) => {
	const { attributes, maxiSetAttributes } = props;

	const customCssValue = getLastBreakpointAttribute({
		target: '_ccs',
		breakpoint,
		attributes,
	});

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [customCSSCategory, setCustomCSSCategory] = useState(null);

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<CustomCssControl
				breakpoint={breakpoint}
				categories={getCategoriesCss(categories, attributes)}
				category={customCSSCategory}
				setCategory={setCustomCSSCategory}
				selectors={getSelectorsCss(selectors, attributes)}
				value={customCssValue}
				onChange={(attr, val) =>
					maxiSetAttributes({
						[attr]: val,
					})
				}
			/>
		),
		extraIndicators: [`_ccs-${breakpoint}`],
	};
};

export default customCss;
