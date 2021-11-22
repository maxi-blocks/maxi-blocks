/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */

import CustomCssControl from '../custom-css';
import { getLastBreakpointAttribute } from '../../extensions/styles';

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
	const customCssCategory = attributes['custom-css-category'] || 'none';

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<CustomCssControl
				breakpoint={breakpoint}
				categories={categories}
				category={customCssCategory}
				selectors={selectors}
				value={customCssValue}
				onChangeCode={val => {
					setAttributes({
						[`custom-css-${breakpoint}`]: val,
					});
				}}
				onChange={val =>
					setAttributes({
						'custom-css-category': val,
					})
				}
			/>
		),
	};
};

export default customCss;
