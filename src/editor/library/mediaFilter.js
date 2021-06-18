const { AttachmentsBrowser } = wp.media.view;

const MaxiImagesFilter = wp.media.view.AttachmentFilters.extend({
	createFilters() {
		const filters = {};
		_.each(
			// eslint-disable-next-line no-undef
			maxiImagesFilterTerms.terms || {},
			function filter(value, index) {
				filters[index] = {
					text: value.name,
					props: {
						'maxi-image-type': value.slug,
					},
				};
			}
		);
		filters.all = {
			text: 'All Images',
			props: {
				'maxi-image-type': '',
			},
			priority: 10,
		};
		this.filters = filters;
	},
});

wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({
	createToolbar() {
		AttachmentsBrowser.prototype.createToolbar.call(this);
		this.toolbar.set(
			'MaxiImagesFilter',
			new MaxiImagesFilter({
				controller: this.controller,
				model: this.collection.props,
				priority: -75,
			}).render()
		);
	},
});
