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

const getCircleObject = (props, target) => {
	const response = {
		numberCounter: getNumberCounterStyles(
			{
				...getGroupAttributes(props, 'numberCounter'),
			},
			target,
			props.parentBlockStyle
		),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			'': getNormalObject(props),
			' .maxi-number-counter__box': getBoxObject(props),
			' .maxi-number-counter__box .maxi-number-counter__box__circle':
				getCircleObject(props, 'circle-bar'),
			' .maxi-number-counter__box .maxi-number-counter__box__background':
				getCircleObject(props, 'circle-background'),
			' .maxi-number-counter__box .maxi-number-counter__box__text':
				getCircleObject(props, 'text'),
			' .maxi-number-counter__box .maxi-number-counter__box__text sup':
				getCircleObject(props, 'sup'),
		}),
	};

	return response;
};

export default getStyles;
