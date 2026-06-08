export const hasCanvasSettings = blockData =>
	!!(
		blockData?.settings?.canvas ||
		blockData?.canvas ||
		blockData?.copyPasteMapping?.canvas ||
		blockData?.interactionBuilderSettings?.canvas ||
		blockData?.interactionBuilderSettings?.block
	);

export const getDefaultLinkElement = linkElements =>
	linkElements?.find(element => element !== 'canvas');

export const canToggleCanvasLink = blockData => {
	return hasCanvasSettings(blockData);
};

export const getLinkElementFromCanvasToggle = (checked, linkElements) =>
	checked ? 'canvas' : getDefaultLinkElement(linkElements);

export const getLinkSettingsWithDefaultLinkElement = (
	linkSettings,
	linkElements
) => {
	const defaultLinkElement = getDefaultLinkElement(linkElements);

	if (!linkSettings?.url || linkSettings.linkElement || !defaultLinkElement)
		return linkSettings;

	return {
		...linkSettings,
		linkElement: defaultLinkElement,
	};
};
