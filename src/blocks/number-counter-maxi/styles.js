import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getSizeStyles,
	getTransformStyles,
	getNumberCounterStyles,
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const response = {
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		position: getPositionStyles({
			...getGroupAttributes(props, 'position'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
	};

	return response;
};

const getBoxObject = props => {
	const { 'number-counter-title-font-size': fontSize } = props;
	const endCountValue = Math.ceil((props['number-counter-end'] * 360) / 100);

	const size = getSizeStyles({ ...getGroupAttributes(props, 'size') });
	Object.entries(size).forEach(([key, val]) => {
		if (key.includes('min-width') && !val)
			size[key] = fontSize * (endCountValue.toString().length - 1);
	});

	const response = {
		size,
	};

	return response;
};

const getStyles = props => {
	const { uniqueID, parentBlockStyle: blockStyle } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			'': getNormalObject(props),
			' .maxi-number-counter__box': getBoxObject(props),
			...getNumberCounterStyles({
				obj: {
					...getGroupAttributes(props, 'numberCounter'),
				},
				target: '.maxi-number-counter__box',
				blockStyle,
			}),
		}),
	};
	return response;
};

export default getStyles;
