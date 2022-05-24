import getTransitionStyles from './getTransitionStyles';

const getBackgroundDisplayerStyles = (obj, type = 'block') => {
	const response = {
		' > .maxi-background-displayer > div': {
			transition: getTransitionStyles(obj, type, 'background / layer'),
		},
	};

	return response;
};

export default getBackgroundDisplayerStyles;
