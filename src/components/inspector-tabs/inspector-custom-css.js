/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import CustomCssControl from '../custom-css-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import {
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
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

	const customCssValue = getLastBreakpointAttribute(
		'custom-css',
		breakpoint,
		attributes
	);
	const customCssCategory = attributes['custom-css-category'];

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<>
				<ResponsiveTabsControl
					{...getGroupAttributes(attributes, 'customCss')}
					breakpoint={breakpoint}
				/>
				<CustomCssControl
					breakpoint={breakpoint}
					categories={categories}
					category={customCssCategory}
					selectors={selectors}
					value={customCssValue}
					onChange={(attr, val) =>
						maxiSetAttributes({
							[attr]: val,
						})
					}
				/>
			</>
		),
	};
};

export default customCss;
