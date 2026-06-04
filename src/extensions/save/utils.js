import { inlineLinkFields } from '@extensions/DC/constants';
import { isLinkObfuscationEnabled } from '@extensions/DC/utils';

/**
 * Builds HTML attributes for the block-level WithLink `<a>` wrapper.
 *
 * Title and aria-label are intentionally excluded here — this function
 * feeds the generic link wrapper used by 13+ block types, and the wrapper
 * has never rendered those attributes. Block-specific link attributes
 * (button-maxi, text-link formats) are handled in their own save paths.
 */
const getLinkAttributesFromLinkSettings = (
	linkSettings,
	dcStatus,
	dcLinkStatus,
	dcLinkTarget
) => {
	let rel = '';
	const nf = linkSettings.noFollow;
	const sp = linkSettings.sponsored;
	const ug = linkSettings.ugc;
	if (nf) rel += ' nofollow';
	if (sp) rel += ' sponsored';
	if (ug) rel += ' ugc';
	if (!nf && !sp && !ug) {
		rel = null;
	} else {
		rel = rel.trim();
	}

	const href =
		dcStatus && dcLinkStatus ? '$link-to-replace' : linkSettings.url;
	const target =
		linkSettings.opensInNewTab && dcLinkTarget !== 'author_email'
			? '_blank'
			: '_self';
	const isEmailLinkObfuscated = isLinkObfuscationEnabled(
		dcStatus,
		dcLinkStatus,
		dcLinkTarget
	);

	const attributes = {
		href,
		target,
		...(isEmailLinkObfuscated && {
			'data-email-obfuscated': isEmailLinkObfuscated,
		}),
	};

	if (rel) attributes.rel = rel;

	return attributes;
};

const getHasLink = (linkSettings, dynamicContent) => {
	const {
		'dc-status': dcStatus,
		'dc-link-status': dcLinkStatus,
		'dc-link-target': dcLinkTarget,
	} = dynamicContent || false;

	const hasLink =
		!!linkSettings && !!linkSettings.url && !linkSettings?.disabled;
	const hasDCLink =
		dcStatus && dcLinkStatus && !inlineLinkFields.includes(dcLinkTarget);

	return !!(hasLink || hasDCLink);
};

const WithLink = props => {
	const { linkSettings, dynamicContent, children, className } = props;

	const {
		'dc-status': dcStatus,
		'dc-link-status': dcLinkStatus,
		'dc-link-target': dcLinkTarget,
	} = dynamicContent || false;

	if (getHasLink(linkSettings, dynamicContent)) {
		return (
			<a
				className={['maxi-link-wrapper', className]
					.filter(Boolean)
					.join(' ')}
				{...getLinkAttributesFromLinkSettings(
					linkSettings,
					dcStatus,
					dcLinkStatus,
					dcLinkTarget
				)}
			>
				{children}
			</a>
		);
	}

	return children;
};

export { getHasLink, getLinkAttributesFromLinkSettings, WithLink };
