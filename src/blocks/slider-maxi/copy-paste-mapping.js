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
				'Enable arrows': 'navigation-arrow-both-status',
				'Enable dots': 'navigation-dot-status',
				'Arrows position': 'navigation-arrow-position',
				'Dots position': 'navigation-dot-position',
			},
			hasBreakpoints: true,
		},
		Arrows: {
			group: {
				'Arrow icons': {
					groupAttributes: 'arrowIcon',
				},
				'Arrow icons - hover': {
					groupAttributes: 'arrowIconHover',
				},
			},
		},
		Dots: {
			group: {
				'Dot icons': {
					groupAttributes: 'dotIcon',
				},
				'Dot icons - hover': {
					groupAttributes: 'dotIconHover',
				},
				'Dot icons - active': {
					groupAttributes: 'dotIconActive',
				},
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
