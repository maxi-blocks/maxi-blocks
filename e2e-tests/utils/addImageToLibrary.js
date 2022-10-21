const addImageToLibrary = async page => {
	await page.evaluate(() =>
		fetch(
			'https://upload.wikimedia.org/wikipedia/commons/7/77/Delete_key1.jpg'
		)
			.then(res => res.blob()) // Gets the response and returns it as a blob
			.then(blob => {
				window.wp.mediaUtils.uploadMedia({
					filesList: [
						new File([blob], 'foo.png', { type: 'image/png' }),
					],
					onFileChange: () => null,
					onError: console.error,
				});
			})
	);
};

export default addImageToLibrary;
