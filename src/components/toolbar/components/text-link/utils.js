/**
 * External dependencies
 */
import { isEmpty, trim } from 'lodash';

export const createLinkAttributes = ({
	url,
	type,
	id,
	opensInNewTab,
	noFollow,
	sponsored,
	ugc,
	title = '',
	linkValue,
}) => {
	const attributes = {
		url,
		rel: '',
		title,
	};

	if (type) attributes.type = type;
	if (id) attributes.id = id;

	if (opensInNewTab) {
		attributes.target = '_blank';
		attributes.rel += 'noreferrer noopener';
	}
	if (noFollow) attributes.rel += ' nofollow';
	if (sponsored) attributes.rel += ' sponsored';
	if (ugc) attributes.rel += ' ugc';
	if (attributes.target !== '_blank' && !noFollow && !sponsored && !ugc) {
		delete attributes.rel;
	} else {
		attributes.rel = attributes.rel.trim();
	}

	// Clean empty attributes, as it returns error on RichText
	// and trims the rest
	Object.entries(attributes).forEach(([key, val]) => {
		if (isEmpty(val)) delete attributes[key];

		attributes[key] = trim(val);
	});
	if (url !== linkValue?.url && title === linkValue?.title)
		attributes.title = '';

	return attributes;
};

export const createLinkValue = ({ formatOptions, formatValue }) => {
	if (!formatOptions || isEmpty(formatValue)) return { url: '' };

	const {
		attributes: { url, target, id, rel, title = '' },
	} = formatOptions;

	const value = {
		url,
		opensInNewTab: target === '_blank',
		id,
		noFollow: rel && rel.indexOf('nofollow') >= 0,
		sponsored: rel && rel.indexOf('sponsored') >= 0,
		ugc: rel && rel.indexOf('ugc') >= 0,
		title,
	};

	return value;
};
