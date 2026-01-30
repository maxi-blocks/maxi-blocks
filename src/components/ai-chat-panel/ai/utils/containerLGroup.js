const extractQuotedText = message => {
	if (!message) return null;
	const match = message.match(/["']([^"']+)["']/);
	return match ? match[1].trim() : null;
};

const extractUrl = message => {
	if (!message) return null;
	const quoted = extractQuotedText(message);
	if (quoted && /https?:\/\//i.test(quoted)) return quoted;

	const match = String(message).match(
		/(https?:\/\/[^\s"']+|www\.[^\s"']+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s"']*)?)/i
	);
	return match ? match[1].replace(/[),.]*$/, '') : null;
};

const extractRelFlags = message => {
	const lower = String(message || '').toLowerCase();
	return {
		noFollow: /nofollow/.test(lower),
		sponsored: /sponsored/.test(lower),
		ugc: /\bugc\b/.test(lower),
	};
};

const shouldOpenInNewTab = message => /new\s*tab|_blank|external/i.test(message || '');

const shouldRemoveLink = message =>
	/remove\s*link|unlink|clear\s*link|disable\s*link/i.test(message || '');

const isLinkIntent = message =>
	/(link|clickable|make\s*clickable|card\s*link|link\s*card|link\s*box|link\s*section)/i.test(
		message || ''
	);

const isDynamicLinkIntent = message =>
	/(dynamic\s*link|current\s*post|post\s*url|link\s*to\s*post|link\s*to\s*current)/i.test(
		message || ''
	);

export const buildContainerLGroupAction = (message, { scope = 'selection' } = {}) => {
	const url = extractUrl(message);
	if (!isLinkIntent(message) && !isDynamicLinkIntent(message) && !url) return null;

	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'container' } : {};

	if (isDynamicLinkIntent(message)) {
		return {
			action: actionType,
			property: 'dc_link',
			value: { status: true, target: 'entity' },
			message: 'Dynamic link enabled.',
			...actionTarget,
		};
	}

	if (shouldRemoveLink(message)) {
		return {
			action: actionType,
			property: 'link_settings',
			value: { url: '', opensInNewTab: false },
			message: 'Link removed.',
			...actionTarget,
		};
	}

	const relFlags = extractRelFlags(message);
	const opensInNewTab = shouldOpenInNewTab(message);

	if (!url && !opensInNewTab && !relFlags.noFollow && !relFlags.sponsored && !relFlags.ugc) {
		return null;
	}

	return {
		action: actionType,
		property: 'link_settings',
		value: {
			...(url ? { url } : {}),
			opensInNewTab,
			...relFlags,
		},
		message: 'Link settings updated.',
		...actionTarget,
	};
};

export const buildContainerLGroupAttributeChanges = (
	property,
	value,
	{ attributes } = {}
) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized === 'link_settings') {
		const incoming = value && typeof value === 'object' ? value : { url: value };
		const existing = attributes?.linkSettings || {};
		const next = {
			...existing,
			...incoming,
		};
		if (incoming.target) {
			next.opensInNewTab = incoming.target === '_blank';
		}
		if (incoming.rel) {
			next.noFollow = /nofollow/.test(incoming.rel);
			next.sponsored = /sponsored/.test(incoming.rel);
			next.ugc = /\bugc\b/.test(incoming.rel);
		}
		if (next.noFollow === undefined) next.noFollow = false;
		if (next.sponsored === undefined) next.sponsored = false;
		if (next.ugc === undefined) next.ugc = false;
		return { linkSettings: next };
	}

	if (normalized === 'dc_link') {
		const payload = value && typeof value === 'object' ? value : {};
		return {
			'dc-link-status': payload.status ?? true,
			...(payload.target ? { 'dc-link-target': payload.target } : {}),
			...(payload.url ? { 'dc-link-url': payload.url } : {}),
		};
	}

	if (normalized === 'dc_link_status') {
		return { 'dc-link-status': Boolean(value) };
	}

	if (normalized === 'dc_link_target') {
		return { 'dc-link-target': value };
	}

	if (normalized === 'dc_link_url') {
		return { 'dc-link-url': value };
	}

	return null;
};

export const getContainerLGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized === 'link_settings' || normalized.startsWith('dc_link')) {
		return { tabIndex: 1, accordion: 'link' };
	}
	return null;
};

export default {
	buildContainerLGroupAction,
	buildContainerLGroupAttributeChanges,
	getContainerLGroupSidebarTarget,
};
