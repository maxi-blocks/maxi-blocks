const slider = {
	iev: {
		type: 'boolean',
		default: false,
		longLabel: 'isEditView',
	},
	nos: {
		type: 'number',
		default: 2,
		longLabel: 'numberOfSlides',
	},
	il: {
		type: 'boolean',
		default: false,
		longLabel: 'isLoop',
	},
	ia: {
		type: 'boolean',
		default: false,
		longLabel: 'isAutoplay',
	},
	poh: {
		type: 'boolean',
		default: false,
		longLabel: 'pauseOnHover',
	},
	poi: {
		type: 'boolean',
		default: false,
		longLabel: 'pauseOnInteraction',
	},
	sas: {
		type: 'number',
		default: 2500,
		longLabel: 'slider-autoplay-speed',
	},
	slt: {
		type: 'string',
		default: 'slide',
		longLabel: 'slider-transition',
	},
	sts: {
		type: 'number',
		default: 500,
		longLabel: 'slider-transition-speed',
	},
};

export default slider;
