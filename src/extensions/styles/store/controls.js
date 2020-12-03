/**
 * WordPress dependencies
 */
const { apiFetch } = wp;
const { select } = wp.data;

/**
 * Controls
 */
const controls = {
	async SAVE_STYLES({ isUpdate, styles }) {
		const id = select('core/editor').getCurrentPostId();

		await apiFetch({
			path: '/maxi-blocks/v1.0/post',
			method: 'POST',
			data: {
				id,
				meta: JSON.stringify(styles),
				update: isUpdate,
			},
		});
	},
};

export default controls;
