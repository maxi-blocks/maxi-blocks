/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { pickBy } from 'lodash';

/**
 * Internal dependencies
 */
import CustomCssControl from '../custom-css-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import getActiveAttributes from '../../extensions/active-indicators';

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

	const customCssAttr = pickBy(attributes, (value, key) =>
		key?.includes('custom-css-')
	);

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<CustomCssControl
				breakpoint={breakpoint}
				categories={categories}
				category={customCssCategory}
				selectors={selectors}
				value={customCssValue}
				active={getActiveAttributes(customCssAttr, 'custom-css')}
				onChange={(attr, val) =>
					setAttributes({
						[attr]: val,
					})
				}
			/>
		),
	};
};

export default customCss;
