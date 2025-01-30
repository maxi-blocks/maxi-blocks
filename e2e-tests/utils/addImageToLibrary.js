const addImageToLibrary = async page => {
	await page.evaluate(() =>
		fetch(
			'https://img.maxiblocks.com/2024/12/Pure-Image-Dark-PID-PRO-108-1734710451-273045251-1734710451-1041076938.webp'
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
							new File([blob], 'foo.webp', {
								type: 'image/webp',
							}),
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
/**
 * Remove the uploaded image from the library. Only works on gutenberg edit pages.
 */
const removeUploadedImage = async page => {
	await page.evaluate(async () => {
		const mediaItems = await wp.data.resolveSelect('core').getMediaItems({
			search: 'foo.webp',
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
