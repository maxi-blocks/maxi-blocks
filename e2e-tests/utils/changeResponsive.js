const changeResponsive = async (page, size) => {
	const winBreakpoint = await page.evaluate(() =>
		wp.data.select('maxiBlocks').receiveWinBreakpoint()
	);

	await page.evaluate(
		_size => wp.data.dispatch('maxiBlocks').setMaxiDeviceType(_size),
		((size, winBreakpoint) =>
			size === 'base' || winBreakpoint === size ? 'general' : size)(
			size,
			winBreakpoint
		)
	);
};

export default changeResponsive;
