import { getGroupAttributes } from '../../extensions/styles';
import {
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getMapStyles,
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

const getMapObject = (props, target) => {
	const response = {
		map: getMapStyles(
			{
				...getGroupAttributes(props, ['map','palette']),
			},
			target
		),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	let response = {
		[uniqueID]: getNormalObject(props),
		[`${uniqueID} .map-marker-info-window__title`]: getMapObject(
			props,
			'title'
		),
		[`${uniqueID} .map-marker-info-window__address`]: getMapObject(
			props,
			'address'
		),
	};

	return response;
};

export default getStyles;
