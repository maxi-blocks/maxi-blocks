const copyPasteMapping = {
	settings: {
		'Slider settings': {
			group: {
				'Edit view': 'isEditView',
				Loop: 'isLoop',
				Autoplay: 'isAutoplay',
				'Pause on hover': 'pauseOnHover',
				'Pause on interaction': 'pauseOnInteraction',
				'Autoplay speed': 'slider-autoplay-speed',
				'Transition type': 'slider-transition',
				'Transition speed': 'slider-transition-speed',
			},
		},
		Navigation: {
			group: {
				'Enable arrows': 'navigation-arrows-status',
				'Enable dots': 'navigation-dots-status',
				'Arrows position': 'navigation-arrow-position',
				'Dots position': 'navigation-dot-position',
			},
		},
		Arrows: {
			group: {
				'Arrow icons': 'arrowIcon',
				'Arrow icons - hover': 'arrowIconHover',
			},
		},
		Dots: {
			group: {
				'Dot icons': 'dotIcon',
				'Dot icons - hover': 'dotIconHover',
				'Dot icons - active': 'dotIconActive',
			},
		},
		Background: {
			template: 'blockBackground',
		},
		Border: {
			template: 'border',
		},
		'Box shadow': {
			template: 'boxShadow',
		},
		Size: {
			template: 'size',
		},
		'Margin/Padding': {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
	},
};

export default copyPasteMapping;
