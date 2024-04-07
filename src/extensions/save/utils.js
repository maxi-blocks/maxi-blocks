import { inlineLinkFields } from '../DC/constants';

const getLinkAttributesFromLinkSettings = (
	linkSettings,
	dcStatus,
	dcLinkStatus
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

	return { rel, href, target };
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

	if (hasDCLink) {
		console.log('linkSettings', linkSettings);
		console.log('dynamicContent', dynamicContent);
		console.log('children', children);
		console.log(getLinkAttributesFromLinkSettings(
			linkSettings,
			dcStatus,
			dcLinkStatus
		));
	}


	if (hasLink || hasDCLink) {
		return (
			<a
				className='maxi-link-wrapper'
				{...getLinkAttributesFromLinkSettings(
					linkSettings,
					dcStatus,
					dcLinkStatus
				)}
			>
				{children}
			</a>
		);
	}

	return children;
};

export { getLinkAttributesFromLinkSettings, WithLink };
