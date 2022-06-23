/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RelationControl from '../relation-control';

const relation = ({ props }) => {
	const { attributes, maxiSetAttributes, deviceType } = props;

	return {
		label: __('Interaction builder', 'maxi-blocks'),
		content: (
			<RelationControl
				{...attributes}
				onChange={obj => maxiSetAttributes(obj)}
				deviceType={deviceType}
			/>
		),
		indicatorProps: ['relations'],
	};
};

export default relation;
