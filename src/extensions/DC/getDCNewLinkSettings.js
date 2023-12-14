/**
 * Internal dependencies
 */
import getDCLink from './getDCLink';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 *
 * @param {Object} attributes
 * @param {Object} dynamicContentProps - dynamicContentProps from `getDCValues`
 * @param {string} clientId
 * @returns {Object|null}              - newLinkSettings if changed, null otherwise
 */
const getDCNewLinkSettings = async (
	attributes,
	dynamicContentProps,
	clientId
) => {
	const { linkStatus, postTaxonomyLinksStatus } = dynamicContentProps;

	const newLinkSettings = { ...attributes.linkSettings } ?? {};
	let updateLinkSettings = false;
	const dcLink = await getDCLink(dynamicContentProps, clientId);
	const isSameLink = dcLink === newLinkSettings.url;

	if (!!postTaxonomyLinksStatus !== !!newLinkSettings.disabled) {
		newLinkSettings.disabled = postTaxonomyLinksStatus;

		updateLinkSettings = true;
	}
	if (!isSameLink && linkStatus && !isNil(dcLink)) {
		newLinkSettings.url = dcLink;
		newLinkSettings.title = dcLink;

		updateLinkSettings = true;
	} else if (isSameLink && !linkStatus) {
		newLinkSettings.url = null;
		newLinkSettings.title = null;

		updateLinkSettings = true;
	}

	return updateLinkSettings ? newLinkSettings : null;
};

export default getDCNewLinkSettings;
