import apiFetch from '@wordpress/api-fetch';

const getACFFieldGroups = async () =>
	apiFetch({
		path: '/maxi-blocks/v1.0/acf/get-field-groups',
		method: 'GET',
	});

const getACFGroupFields = async group =>
	apiFetch({
		path: `/maxi-blocks/v1.0/acf/get-group-fields/${group}`,
		method: 'GET',
	});

const getACFFieldContent = async (field, post) =>
	apiFetch({
		path: `/maxi-blocks/v1.0/acf/get-field-value/${field}/${post}`,
		method: 'GET',
	});

export { getACFFieldGroups, getACFGroupFields, getACFFieldContent };
