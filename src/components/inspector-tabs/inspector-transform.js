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
const transform = ({ props, depth = 2, categories, selectors }) => {
	const {
		attributes,
		deviceType,
		uniqueID,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

	return {
		label: __('Transform', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<TransformControl
					{...getGroupAttributes(attributes, 'transform')}
					onChangeInline={(obj, target) => {
						insertInlineStyles({
							obj,
							target,
						});
					}}
					onChange={obj => {
						maxiSetAttributes(obj);
						cleanInlineStyles();
					}}
					uniqueID={uniqueID}
					breakpoint={deviceType}
					depth={depth}
					categories={categories}
					selectors={selectors}
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default transform;
