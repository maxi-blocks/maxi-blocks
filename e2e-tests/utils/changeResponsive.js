const changeResponsive = async (page, size) => {
	const baseBreakpoint = await page.evaluate(() =>
		wp.data.select('maxiBlocks').receiveBaseBreakpoint()
	);

	await page.evaluate(
		_size =>
			wp.data
				.dispatch('maxiBlocks')
				.setMaxiDeviceType({ deviceType: _size }),
		((size, baseBreakpoint) =>
			size === 'base' || baseBreakpoint === size ? 'general' : size)(
			size,
			baseBreakpoint
		)
	);
};

export default changeResponsive;
