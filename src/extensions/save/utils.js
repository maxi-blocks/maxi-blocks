const getLinkAttributesFromLinkSettings = (
	linkSettings,
	dcStatus,
	dcLinkStatus
) => {
	let rel = '';
	if (linkSettings.nofollow) rel += ' nofollow';
	if (linkSettings.sponsored) rel += ' sponsored';
	if (linkSettings.ugc) rel += ' ugc';

	const href =
		dcStatus && dcLinkStatus ? '$link-to-replace' : linkSettings.url;
	const target = linkSettings.opensInNewTab ? '_blank' : '_self';

	return { rel, href, target };
};

const WithLink = props => {
	const { linkSettings, dynamicContent, children } = props;

	const { 'dc-status': dcStatus, 'dc-link-status': dcLinkStatus } =
		dynamicContent || false;

	const hasLink =
		!!linkSettings && !!linkSettings.url && !linkSettings?.disabled;
	const hasDCLink = dcStatus && dcLinkStatus;

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
