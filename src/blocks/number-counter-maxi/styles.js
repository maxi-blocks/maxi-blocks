import { getGroupAttributes } from '../../extensions/styles';
import {
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
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

const getCircleObject = (props, target) => {
	const response = {
		numberCounter: getNumberCounterStyles(
			{
				...getGroupAttributes(props, ['numberCounter', 'palette']),
			},
			target
		),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: {
			'': getNormalObject(props),
			' .maxi-number-counter__box .maxi-number-counter__box__circle':
				getCircleObject(props, 'circle-bar'),
			' .maxi-number-counter__box .maxi-number-counter__box__background':
				getCircleObject(props, 'circle-background'),
			' .maxi-number-counter__box .maxi-number-counter__box__text':
				getCircleObject(props, 'text'),
			' .maxi-number-counter__box .maxi-number-counter__box__text sup':
				getCircleObject(props, 'sup'),
		},
	};

	return response;
};

export default getStyles;
