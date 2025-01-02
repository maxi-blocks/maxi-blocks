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

const removeUploadedImage = async page => {
	await page.evaluate(async () => {
		const mediaItems = await wp.data.resolveSelect('core').getMediaItems({
			search: 'foo.png',
		});

		if (!mediaItems || mediaItems.length === 0) {
			throw new Error('Image not found');
		}

		const imageToDelete = mediaItems[0];

		await wp.data.dispatch('core').deleteMedia(imageToDelete.id, {
			force: true,
		});
	});
};

export { addImageToLibrary, removeUploadedImage };
