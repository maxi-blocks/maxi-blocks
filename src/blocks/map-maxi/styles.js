import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getMapStyles,
	getSizeStyles,
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const response = {
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
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

const getMapObject = (props, target) => {
	const response = {
		map: getMapStyles(
			{
				...getGroupAttributes(props, 'map'),
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
			' .map-marker-info-window__title': getMapObject(props, 'title'),
			' .map-marker-info-window__address': getMapObject(props, 'address'),
		}),
	};

	return response;
};

export default getStyles;
