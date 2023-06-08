import apiFetch from '@wordpress/api-fetch';

const getACFFieldGroups = async () =>
	apiFetch({
		path: '/maxi-blocks/v1.0/acf/get-field-groups',
		method: 'GET',
	}).then(res => JSON.parse(res)) ?? [];

const getACFGroupFields = async group =>
	Number.isFinite(group)
		? apiFetch({
				path: `/maxi-blocks/v1.0/acf/get-group-fields/${group}`,
				method: 'GET',
		  }).then(res => JSON.parse(res))
		: [];

const getACFFieldContent = async (field, post) =>
	typeof acf !== 'undefined'
		? apiFetch({
				path: `/maxi-blocks/v1.0/acf/get-field-value/${field}/${post}`,
				method: 'GET',
		  }).then(res => JSON.parse(res))
		: null;

export { getACFFieldGroups, getACFGroupFields, getACFFieldContent };
