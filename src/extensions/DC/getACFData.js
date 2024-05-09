/**
 * Wordpress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import memoize from 'memize';
import { isNil } from 'lodash';

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
		: null;

const getACFFieldContent = memoize(async (field, post) =>
	typeof acf !== 'undefined' && !isNil(field) && !isNil(post)
		? apiFetch({
				path: `/maxi-blocks/v1.0/acf/get-field-value/${field}/${post}`,
				method: 'GET',
		  }).then(res => JSON.parse(res))
		: null
);

export { getACFFieldGroups, getACFGroupFields, getACFFieldContent };
