/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ArrowControl from '../arrow-control';
import { getGroupAttributes } from '../../extensions/styles';
import ResponsiveTabsControl from '../responsive-tabs-control';

/**
 * Component
 */
const calloutArrow = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const { blockFullWidth } = attributes;

	return {
		label: __('Callout arrow', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<ArrowControl
					{...getGroupAttributes(attributes, [
						'blockBackground',
						'arrow',
						'border',
					])}
					onChange={obj => maxiSetAttributes(obj)}
					isFullWidth={blockFullWidth}
					breakpoint={deviceType}
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default calloutArrow;
