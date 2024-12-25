/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RelationControl from '@components/relation-control';

const relation = ({ props, isButton = false }) => {
	const { attributes, name, clientId, maxiSetAttributes, deviceType } = props;

	const filterUndefinedProperties = obj => {
		if (typeof obj !== 'object' || obj === null) {
			return obj;
		}

		if (Array.isArray(obj)) {
			return obj.map(filterUndefinedProperties);
		}

		return Object.fromEntries(
			Object.entries(obj)
				.map(([key, value]) => {
					if (typeof value === 'object' && value !== null) {
						return [key, filterUndefinedProperties(value)];
					}
					return [key, value];
				})
				.filter(([key, value]) => value !== undefined)
		);
	};

	return {
		label: __('Interaction builder', 'maxi-blocks'),
		content: (
			<RelationControl
				{...attributes}
				name={name}
				clientId={clientId}
				onChange={obj => {
					const filteredObj = filterUndefinedProperties(obj);
					maxiSetAttributes(filteredObj);
				}}
				deviceType={deviceType}
				isButton={isButton}
			/>
		),
		indicatorProps: ['relations'],
	};
};

export default relation;
