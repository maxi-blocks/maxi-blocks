/**
 * Internal dependencies
 */
import sanitizeLinkAttributes from '@extensions/link/sanitizeLinkAttributes';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

export const createLinkAttributes = ({
	url,
	type,
	id,
	opensInNewTab,
	noFollow,
	sponsored,
	ugc,
	title = '',
	ariaLabel = '',
}) => {
	const relValues = [];
	const attributes = sanitizeLinkAttributes({
		url,
		title,
		ariaLabel,
	});

	if (type) attributes.type = type;
	if (id) attributes.id = id;

	if (opensInNewTab) {
		attributes.target = '_blank';
		relValues.push('noreferrer', 'noopener');
	}
	if (noFollow) relValues.push('nofollow');
	if (sponsored) relValues.push('sponsored');
	if (ugc) relValues.push('ugc');

	if (!isEmpty(relValues)) attributes.rel = relValues.join(' ');

	return attributes;
};

export const createLinkValue = ({ formatOptions, formatValue }) => {
	if (!formatOptions || isEmpty(formatValue)) return { url: '' };

	const { attributes = {} } = formatOptions;
	const {
		url,
		target,
		id,
		rel,
		title = '',
		ariaLabel = attributes['aria-label'] || '',
	} = attributes;

	const value = {
		url,
		opensInNewTab: target === '_blank',
		id,
		noFollow: rel && rel.indexOf('nofollow') >= 0,
		sponsored: rel && rel.indexOf('sponsored') >= 0,
		ugc: rel && rel.indexOf('ugc') >= 0,
		title,
		ariaLabel,
	};

	return value;
};
