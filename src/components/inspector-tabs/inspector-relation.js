/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import RelationControl from '@components/relation-control';

const relation = ({ props, isButton = false }) => {
	const { attributes, name, clientId, maxiSetAttributes, deviceType } = props;

	// eslint-disable-next-line no-console
	console.log(
		'[IB Debug] inspector-relation CALLED - clientId:',
		clientId,
		'relations:',
		JSON.stringify(attributes?.relations, null, 2),
		'relations type:',
		typeof attributes?.relations,
		'isArray:',
		Array.isArray(attributes?.relations)
	);
	// eslint-disable-next-line no-console
	if (!attributes?.relations || (Array.isArray(attributes?.relations) && attributes.relations.length === 0)) {
		// eslint-disable-next-line no-console
		console.log('[IB Debug] inspector-relation - EMPTY RELATIONS DETECTED!');
		// eslint-disable-next-line no-console
		console.trace('[IB Debug] inspector-relation empty relations stack trace');
	}

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
	const handleChange = useCallback(
		obj => {
			// eslint-disable-next-line no-console
			console.log(
				'[IB Debug] inspector-relation handleChange called with:',
				JSON.stringify(obj, null, 2)
			);
			const filteredObj = filterUndefinedProperties(obj);
			// eslint-disable-next-line no-console
			console.log(
				'[IB Debug] inspector-relation handleChange - filteredObj:',
				JSON.stringify(filteredObj, null, 2)
			);
			maxiSetAttributes(filteredObj);
		},
		[maxiSetAttributes]
	);

	return {
		label: __('Interaction builder', 'maxi-blocks'),
		content: (
			<RelationControl
				{...attributes}
				name={name}
				clientId={clientId}
				onChange={handleChange}
				deviceType={deviceType}
				isButton={isButton}
			/>
		),
		indicatorProps: ['relations'],
	};
};

export default relation;
