const getLinkAttributesFromLinkSettings = linkSettings => {
	let rel = '';
	if (linkSettings.nofollow) rel += ' nofollow';
	if (linkSettings.sponsored) rel += ' sponsored';
	if (linkSettings.ugc) rel += ' ugc';

	const href = linkSettings.url;
	const target = linkSettings.opensInNewTab ? '_blank' : '_self';

	return { rel, href, target };
};

const WithLink = ({ children, linkSettings }) => {
	if (!!linkSettings && !!linkSettings.url && !linkSettings?.disabled) {
		return (
			<a
				className='maxi-link-wrapper'
				{...getLinkAttributesFromLinkSettings(linkSettings)}
			>
				{children}
			</a>
		);
	}

	return children;
};

export { getLinkAttributesFromLinkSettings, WithLink };
