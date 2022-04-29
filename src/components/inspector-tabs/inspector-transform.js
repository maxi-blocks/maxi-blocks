/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransformControl from '../transform-control';
import { getGroupAttributes } from '../../extensions/styles';
import ResponsiveTabsControl from '../responsive-tabs-control';

/**
 * Component
 */
const transform = ({ props, depth = 2 }) => {
	const { attributes, deviceType, uniqueID, maxiSetAttributes } = props;

	return {
		label: __('Transform', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<TransformControl
					{...getGroupAttributes(attributes, 'transform')}
					onChange={obj => maxiSetAttributes(obj)}
					uniqueID={uniqueID}
					breakpoint={deviceType}
					depth={depth}
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default transform;
