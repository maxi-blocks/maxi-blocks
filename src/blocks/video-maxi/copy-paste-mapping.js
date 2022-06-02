const copyPasteMapping = {
	exclude: ['url', 'embedUrl', 'videoType'],
	_order: [
		'Video',
		'Video options',
		// 'Video overlay',
		'Border',
		'Box shadow',
		'Size',
		'Margin/Padding',
	],

	settings: {
		blockSpecific: {
			video: {
				groupLabel: 'Video',
				props: {
					startTime: 'Start time',
					endTime: 'End time',
					videoRatio: 'Aspect ratio',
				},
			},
			videoOptions: {
				groupLabel: 'Video options',
				props: {
					isAutoplay: 'Autoplay',
					isMuted: 'Mute',
					isLoop: 'Loop',
					showPlayerControls: 'Player controls',
					reduceBorders: 'Reduce black borders',
					isLightbox: 'Open in lightbox',
					lightBoxBackground: {
						label: 'Lightbox background colour',
						props: [
							'lightboxBackground',
							'lightboxBackgroundColor',
						],
					},
					closeIcon: { label: 'Close button', props: ['icon'] },
				},
			},
			videoOverlay: {
				groupLabel: 'Video overlay',
				props: {
					overlayBackground: {
						label: 'Overlay background colour',
						props: ['background', 'backgroundColor'],
					},
					playIcon: 'Play button',
				},
			},
		},
		withPrefix: {
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
			scroll: 'Scroll',
			transform: 'Transform',
			transition: 'Hyperlink hover transition',
			display: 'Show/hide block',
			position: 'Position',
			overflow: 'Overflow',
			flex: 'Flexbox',
			zIndex: 'Z-index',
		},
	},
};

export default copyPasteMapping;
