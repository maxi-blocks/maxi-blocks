import { inlineLinkFields } from '@extensions/DC/constants';
import { isLinkObfuscationEnabled } from '@extensions/DC/utils';

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

	return {
		rel,
		href,
		target,
		...(isEmailLinkObfuscated && {
			'data-email-obfuscated': isEmailLinkObfuscated,
		}),
	};
};

const WithLink = props => {
	const { linkSettings, dynamicContent, children } = props;

	const {
		'dc-status': dcStatus,
		'dc-link-status': dcLinkStatus,
		'dc-link-target': dcLinkTarget,
	} = dynamicContent || false;

	const hasLink =
		!!linkSettings && !!linkSettings.url && !linkSettings?.disabled;
	const hasDCLink =
		dcStatus && dcLinkStatus && !inlineLinkFields.includes(dcLinkTarget);

	if (hasLink || hasDCLink) {
		return (
			<a
				className='maxi-link-wrapper'
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

export { getLinkAttributesFromLinkSettings, WithLink };
