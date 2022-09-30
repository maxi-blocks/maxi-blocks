const changeResponsive = async (page, size, checkForIframe = false) => {
	const baseBreakpoint = await page.evaluate(() =>
		wp.data.select('maxiBlocks').receiveBaseBreakpoint()
	);
	const xxlSize = await page.evaluate(() =>
		wp.data.select('maxiBlocks').receiveXXLSize()
	);
	const breakpoints = await page.evaluate(() =>
		wp.data.select('maxiBlocks').receiveMaxiBreakpoints()
	);
	const parsedSize =
		size === 'base' || baseBreakpoint === size ? 'general' : size;

	await page.evaluate(
		(_size, width) =>
			wp.data.dispatch('maxiBlocks').setMaxiDeviceType({
				deviceType: _size,
				...(width && { width }),
			}),
		parsedSize,
		checkForIframe &&
			parsedSize !== 'general' &&
			(size !== 'xxl' ? breakpoints[size] : xxlSize)
	);

	if (checkForIframe && (size === 's' || size === 'xs')) {
		const iframe = await page.$('iframe[name="editor-canvas"]');
		return iframe.contentFrame();
	}

	return null;
};

export default changeResponsive;
