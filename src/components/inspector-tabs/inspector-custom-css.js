/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import CustomCssControl from '../custom-css-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import { customCss as customCssAttr } from '../../extensions/styles/defaults';

/**
 * Component
 */
const customCss = ({
	props,
	breakpoint = 'general',
	selectors,
	categories,
}) => {
	const { attributes, setAttributes } = props;

	const customCssValue = getLastBreakpointAttribute(
		'custom-css',
		breakpoint,
		attributes
	);
	const customCssCategory = attributes['custom-css-category'];

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<CustomCssControl
				breakpoint={breakpoint}
				categories={categories}
				category={customCssCategory}
				selectors={selectors}
				value={customCssValue}
				onChange={(attr, val) =>
					setAttributes({
						[attr]: val,
					})
				}
			/>
		),
		extraIndicators: Object.keys(customCssAttr),
	};
};

export default customCss;
