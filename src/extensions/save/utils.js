import { inlineLinkFields } from '../DC/constants';

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
	const target = linkSettings.opensInNewTab ? '_blank' : '_self';
	const dataEmailObfuscated = dcLinkTarget === 'author_email';

	return { rel, href, target, 'data-email-obfuscated': dataEmailObfuscated };
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
