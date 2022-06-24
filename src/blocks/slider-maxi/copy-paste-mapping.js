const copyPasteMapping = {
	_order: [
		'Slider settings',
		'Navigation',
		'Background',
		'Border',
		'Box shadow',
		'Size',
		'Margin/Padding',
	],

	settings: {
		blockSpecific: {
			sliderSettings: {
				groupLabel: 'Slider settings',
				props: {
					isEditView: 'Edit view',
					numberOfSlides: 'Slides number',
					isLoop: 'Loop',
					isAutoplay: 'Autoplay',
					pauseOnHover: 'pause on hover',
					pauseOnInteraction: 'Pause on interaction',
					'slider-autoplay-speed': 'Autoplay speed',
					'slider-transition': 'Transition type',
					'slider-transition-speed': 'Transition speed',
				},
			},
			navigation: {
				groupLabel: 'Navigation',
				props: {
					'navigation-type': 'Navigation type',
					'navigation-arrow-position': 'Arrows position',
					'navigation-dot-position': 'Dots position',
				},
			},
			arrows: {
				groupLabel: 'Arrows',
				props: {
					arrowIcon: 'Arrow icons',
					arrowIconHover: 'Arrow icons - hover',
				},
			},
			dots: {
				groupLabel: 'Dots',
				props: {
					dotIcon: 'Dot icons',
					dotIconHover: 'Dot icons - hover',
					dotIconActive: 'Dot icons - active',
				},
			},
			size: {
				groupLabel: 'Size',
				props: {
					blockFullWidth: 'Full width',
					size: { label: 'Size', type: 'withoutPrefix' },
				},
			},
		},
		withBreakpoint: {},
		withoutPrefix: {
			blockBackground: 'Background',
			border: {
				groupLabel: 'Border',
				props: {
					border: 'Border',
					borderWidth: 'Border width',
					borderRadius: 'Border radius',
					borderHover: 'Border hover',
					borderWidthHover: 'Border width hover',
					borderRadiusHover: 'Border radius hover',
				},
			},
			boxShadow: {
				groupLabel: 'Box shadow',
				props: {
					boxShadow: 'Box shadow',
					boxShadowHover: 'Box shadow hover',
				},
			},
			'margin-padding': {
				groupLabel: 'Margin/Padding',
				props: { margin: 'Margin', padding: 'Padding' },
			},
		},
	},
	advanced: {
		blockSpecific: {
			extraClassName: 'Custom CSS classes',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			relations: 'Interaction',
		},
		withoutPrefix: {
			breakpoints: 'Breakpoints',
			customCss: 'Custom CSS',
			scroll: 'Scroll effects',
			transform: 'Transform',
			transition: 'Hyperlink hover transition',
			display: 'Show/hide block',
			opacity: 'Opacity',
			position: 'Position',
			overflow: 'Overflow',
			flex: 'Flexbox',
			zIndex: 'Z-index',
		},
	},
};

export default copyPasteMapping;
