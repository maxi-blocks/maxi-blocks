/**
 * WordPress dependencies
 */
import { getEditedPostContent as getWordPressEditedPostContent } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import waitForAttribute from './waitForAttribute';

const getEditedPostContent = async page => {
	await waitForAttribute(page, [
		'maxi-version-current',
		'maxi-version-on-creating',
	]);

	return getWordPressEditedPostContent();
};

export default getEditedPostContent;
