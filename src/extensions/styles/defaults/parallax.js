import { backgroundImage } from './background';

const getParallaxBGImage = () => {
	const response = {};

	// TODO: not sure if all backgroundImage attributes are necessary
	// for the parallax. We may clean it 👍
	Object.entries(backgroundImage).forEach(([key, val]) => {
		response[`parallax-${key}`] = val;
	});

	return response;
};

const parallax = {
	'parallax-status': {
		type: 'boolean',
		default: false,
	},
	'parallax-speed': {
		type: 'number',
		default: 4,
	},
	'parallax-direction': {
		type: 'string',
		default: 'up',
	},
	...getParallaxBGImage(),
};

export default parallax;
