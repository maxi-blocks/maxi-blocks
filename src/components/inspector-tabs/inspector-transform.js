/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransformControl from '../transform-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const transform = ({ props, depth = 2 }) => {
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
			<TransformControl
				{...getGroupAttributes(attributes, 'transform')}
				onChangeInline={obj => insertInlineStyles(obj)}
				onChange={obj => {
					maxiSetAttributes(obj);
					cleanInlineStyles();
				}}
				uniqueID={uniqueID}
				breakpoint={deviceType}
				depth={depth}
			/>
		),
	};
};

export default transform;
