const slider = {
	_iev: {
		type: 'boolean',
		default: false,
		longLabel: 'isEditView',
	},
	_nos: {
		type: 'number',
		default: 2,
		longLabel: 'numberOfSlides',
	},
	_il: {
		type: 'boolean',
		default: false,
		longLabel: 'isLoop',
	},
	_ia: {
		type: 'boolean',
		default: false,
		longLabel: 'isAutoplay',
	},
	_poh: {
		type: 'boolean',
		default: false,
		longLabel: 'pauseOnHover',
	},
	_poi: {
		type: 'boolean',
		default: false,
		longLabel: 'pauseOnInteraction',
	},
	_sas: {
		type: 'number',
		default: 2500,
		longLabel: 'slider-autoplay-speed',
	},
	_slt: {
		type: 'string',
		default: 'slide',
		longLabel: 'slider-transition',
	},
	_sts: {
		type: 'number',
		default: 500,
		longLabel: 'slider-transition-speed',
	},
};

export default slider;
