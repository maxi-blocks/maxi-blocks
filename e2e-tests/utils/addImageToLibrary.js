const addImageToLibrary = async page => {
	await page.evaluate(
		() =>
			new Promise((resolve, reject) => {
				fetch(
					'https://img.maxiblocks.com/2024/12/Pure-Image-Dark-PID-PRO-108-1734710451-273045251-1734710451-1041076938.webp'
				)
					.then(res => res.blob())
					.then(blob => {
						if (!blob) {
							reject(new Error('Failed to fetch image blob'));
							return;
						}
						window.wp.mediaUtils.uploadMedia({
							filesList: [
								new File([blob], 'foo.webp', {
									type: 'image/webp',
								}),
							],
							onFileChange: files => {
								// onFileChange fires twice: first with a temporary blob URL,
								// then again once the server responds with a real id.
								// Only resolve when the upload is fully committed to the DB.
								if (files[0]?.id) resolve();
							},
							onError: err => {
								reject(
									new Error(`Failed to upload media: ${err}`)
								);
							},
						});
					})
					.catch(err => {
						reject(new Error(`Failed to fetch image: ${err}`));
					});
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
