const svgFetch = async (page, fetchPage = 1) => {
	const svgData = await page.evaluate(
		_fetchPage =>
			window
				.fetch(
					`https://ge-library.dev700.com/wp-json/wp/v2/svg_icon/?page=${_fetchPage}&per_page=70`
				)
				.then(response => response.json())
				.then(data => data.map(svgObj => svgObj?.acf?.svg_code))
				.catch(() => false),
		fetchPage
	);

	return svgData;
};

export default svgFetch;
