const editColorControl = async ({
	page,
	instance,
	paletteStatus = true,
	colorPalette,
	customColor,
	opacity,
}) => {
	// Select palette color
	if (paletteStatus && typeof colorPalette === 'number') {
		await instance
			.locator(
				`.maxi-color-control__palette-container button[data-item="${colorPalette}"]`
			)
			.click();
	}

	// Select custom color
	if (!paletteStatus && customColor) {
		await instance.locator('.maxi-opacity-control button').click();
		await instance
			.locator('.maxi-color-control .maxi-toggle-switch input')
			.click();

		const input = page.locator('.maxi-color-control__color input');
		await input.fill(customColor);
	}

	// Change opacity
	if (opacity !== undefined && opacity !== null) {
		const opacityInput = page.locator(
			'.maxi-color-control .maxi-opacity-control .maxi-advanced-number-control__value'
		);
		await opacityInput.fill(`${opacity}`);
	}
};

export default editColorControl;
