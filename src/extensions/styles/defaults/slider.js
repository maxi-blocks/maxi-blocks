const slider = {
	isEditView: {
		type: 'boolean',
		default: false,
	},
	numberOfSlides: {
		type: 'number',
		default: 6,
	},
	isLoop: {
		type: 'boolean',
		default: false,
	},
	isAutoplay: {
		type: 'boolean',
		default: false,
	},
	pauseOnHover: {
		type: 'boolean',
		default: false,
	},
	pauseOnInteraction: {
		type: 'boolean',
		default: false,
	},
	'slider-autoplay-speed': {
		type: 'number',
		default: 500,
	},
	'slider-transition': {
		type: 'string',
		default: 'slide',
	},
	'slider-transition-speed': {
		type: 'number',
		default: 200,
	},
};

export default slider;
