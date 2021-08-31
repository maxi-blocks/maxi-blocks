import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
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

const getStyles = props => {
	const { uniqueID, parentBlockStyle: blockStyle } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			'': getNormalObject(props),
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
