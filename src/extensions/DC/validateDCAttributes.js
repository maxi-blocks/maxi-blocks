import getDCOptions from './getDCOptions';
import { validateRelations, validationsValues } from './utils';

const getValidatedDCAttributes = async (
	attributes,
	contentType,
	contextLoop,
	isCL = false
) => {
	const dcOptions = await getDCOptions(
		attributes,
		attributes.id,
		contentType,
		isCL,
		contextLoop
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

	if (dcOptions?.newValues || validatedAttributes || validatedRelations) {
		const newAttributes = {
			...dcOptions?.newValues,
			...validatedAttributes,
			...validatedRelations,
		};

		return newAttributes;
	}

	return null;
};

export default getValidatedDCAttributes;
