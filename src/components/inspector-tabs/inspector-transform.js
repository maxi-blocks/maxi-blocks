/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransformControl from '../transform-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const transform = ({ props, depth = 2 }) => {
	const { attributes, deviceType, uniqueID, maxiSetAttributes } = props;

	return {
		label: __('Transform', 'maxi-blocks'),
		content: (
			<>
				<ResponsiveTabsControl
					{...getGroupAttributes(attributes, 'transform')}
					breakpoint={deviceType}
				/>
				<TransformControl
					{...getGroupAttributes(attributes, 'transform')}
					onChange={obj => maxiSetAttributes(obj)}
					uniqueID={uniqueID}
					breakpoint={deviceType}
					depth={depth}
				/>
			</>
		),
	};
};

export default transform;
