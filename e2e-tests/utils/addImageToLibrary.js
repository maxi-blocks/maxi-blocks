const addImageToLibrary = async page => {
	await page.evaluate(() =>
		fetch(
			'https://upload.wikimedia.org/wikipedia/commons/7/77/Delete_key1.jpg'
		)
			.then(res => res.blob())
			.catch(err => {
				console.error('Failed to fetch image:', err);
			})
			.then(blob => {
				if (!blob) return;
				try {
					window.wp.mediaUtils.uploadMedia({
						filesList: [
							new File([blob], 'foo.png', { type: 'image/png' }),
						],
						onFileChange: () => null,
						onError: err => {
							console.error('Failed to upload media:', err);
						},
					});
				} catch (err) {
					console.error('Failed to create File or upload:', err);
				}
			})
			.catch(err => {
				console.error('Unhandled error:', err);
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
