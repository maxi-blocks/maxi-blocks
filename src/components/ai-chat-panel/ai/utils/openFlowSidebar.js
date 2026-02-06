export const maybeOpenFlowSidebar = ({
	flow,
	mode,
	clientId,
	selectBlock,
	openSidebarForProperty,
}) => {
	if (mode !== 'selection' || !flow) return false;

	if (clientId && typeof selectBlock === 'function') {
		try {
			selectBlock(clientId);
		} catch {}
	}

	if (typeof openSidebarForProperty === 'function') {
		try {
			openSidebarForProperty(flow);
		} catch {}
	}

	return true;
};

