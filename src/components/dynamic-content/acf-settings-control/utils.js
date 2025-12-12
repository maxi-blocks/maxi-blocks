/**
 * Wordpress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import { acfFieldTypes } from '@extensions/DC/constants';

export const getValidatedACFAttributes = async (
	group,
	field,
	contentType,
	prefix
) => {
	const validatedAttributes = {};
	let currentGroup = group;

	const groups = await resolveSelect(
		'maxiBlocks/dynamic-content'
	).getACFGroups();

	if (!isEmpty(groups)) {
		if (!groups.find(option => option.id === group)) {
			validatedAttributes[`${prefix}acf-group`] = groups[0].id;
			currentGroup = groups[0].id;
		}
	}

	const fields = await resolveSelect(
		'maxiBlocks/dynamic-content'
	).getACFFields(currentGroup);

	const filteredFields = fields?.filter(field =>
		acfFieldTypes[contentType]?.includes(field.type)
	);

	if (field === 'static_text') {
		validatedAttributes[`${prefix}field`] = 'static_text';
		validatedAttributes[`${prefix}acf-field-type`] = 'text';
	} else if (!isEmpty(filteredFields)) {
		if (!filteredFields.find(option => option.id === field)) {
			validatedAttributes[`${prefix}field`] = filteredFields[0].id;
			validatedAttributes[`${prefix}acf-field-type`] =
				filteredFields[0].type;
		}
	}

	return { validatedAttributes, currentGroup };
};

export const getACFOptions = async (
	group,
	field,
	contentType,
	prefix,
	showStaticOption
) => {
	const { validatedAttributes, currentGroup } =
		await getValidatedACFAttributes(group, field, contentType, prefix);
	const groupOptions = [];
	const fieldOptions = [];

	const groups = await resolveSelect(
		'maxiBlocks/dynamic-content'
	).getACFGroups();

	if (!isEmpty(groups)) {
		groups.forEach(group => {
			groupOptions.push({
				label: group.title,
				value: group.id,
			});
		});
	} else {
		groupOptions.push({
			label: __('No groups found', 'maxi-blocks'),
			value: '',
		});
	}

	const fields = await resolveSelect(
		'maxiBlocks/dynamic-content'
	).getACFFields(currentGroup);
	const filteredFields = fields?.filter(field =>
		acfFieldTypes[contentType]?.includes(field.type)
	);

	if (!isEmpty(filteredFields)) {
		filteredFields.forEach(field => {
			fieldOptions.push({
				label: field.title,
				value: field.id,
				type: field.type,
			});
		});
		if (showStaticOption) {
			fieldOptions.push({
				label: __('Static Text', 'maxi-blocks'),
				value: 'static_text',
				type: 'text',
			});
		}
	} else if (showStaticOption) {
		fieldOptions.push({
			label: __('Static', 'maxi-blocks'),
			value: 'static_text',
			type: 'text',
		});
	}
	// In case we receive fields but none of them are suitable for the current content type
	else if (!isEmpty(fields)) {
		fieldOptions.push({
			label: __('No suitable fields found', 'maxi-blocks'),
			value: '',
		});
	} else {
		fieldOptions.push({
			label: __('No fields found', 'maxi-blocks'),
			value: '',
		});
	}

	return {
		validatedAttributes,
		groupOptions,
		fieldOptions,
	};
};
