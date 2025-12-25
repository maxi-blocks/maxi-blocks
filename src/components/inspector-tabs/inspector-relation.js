/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { lazy, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
// import RelationControl from '@components/relation-control';
import ContentLoader from '@components/content-loader';

const RelationControl = lazy(() => import('@components/relation-control'));

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
			<Suspense fallback={<ContentLoader />}>
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
			</Suspense>
		),
		indicatorProps: ['relations'],
	};
};

export default relation;
