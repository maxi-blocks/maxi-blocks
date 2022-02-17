/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ArrowControl from '../arrow-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const calloutArrow = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const { blockFullWidth } = attributes;

	return {
		label: __('Callout arrow', 'maxi-blocks'),
		content: (
			<>
				<ResponsiveTabsControl
					{...getGroupAttributes(attributes, [
						'blockBackground',
						'arrow',
						'border',
					])}
					breakpoint={deviceType}
				/>
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
			</>
		),
	};
};

export default calloutArrow;
