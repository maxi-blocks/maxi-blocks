import { getValidatedACFAttributes } from '@components/dynamic-content/acf-settings-control/utils';
import getDCOptions from './getDCOptions';
import { validateRelations, validationsValues } from './utils';

const getValidatedDCAttributes = async (
	attributes,
	contentType,
	contextLoop,
	isCL = false
) => {
	// Ensure we have a previousRelation property
	const attributesWithPrev = {
		...attributes,
		previousRelation: attributes.relation, // Set current relation as previous
	};

	const dcOptions = await getDCOptions(
		attributesWithPrev,
		attributes.id,
		contentType,
		isCL,
		{
			'cl-status': contextLoop?.['cl-status'],
			'cl-pagination-per-page': contextLoop?.['cl-pagination-per-page'],
		}
	);
	const validatedAttributes = validationsValues(
		attributes.type,
		attributes.field,
		attributes.relation,
		contentType,
		attributes.source,
		attributes.linkTarget,
		isCL,
		attributes.acfGroup
	);
	const validatedRelations = validateRelations(
		attributes.type,
		attributes.relation,
		isCL
	);
	const validatedACFAttributes =
		attributes.source === 'acf'
			? await getValidatedACFAttributes(
					attributes.acfGroup,
					attributes.field,
					contentType,
					isCL ? 'cl-' : 'dc-'
			  )
			: {};

	if (
		dcOptions?.newValues ||
		validatedAttributes ||
		validatedRelations ||
		validatedACFAttributes.validatedAttributes
	) {
		const newAttributes = {
			...dcOptions?.newValues,
			...validatedAttributes,
			...validatedRelations,
			...validatedACFAttributes.validatedAttributes,
		};

		return newAttributes;
	}

	return null;
};

export default getValidatedDCAttributes;
