import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getBoxShadowStyles,
	getZIndexStyles,
	getColumnSizeStyles,
	getDisplayStyles,
	getTransformStyles,
	getMarginPaddingStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
	getSizeStyles,
	getTransitionStyles,
} from '../../extensions/styles/helpers';
import { selectorsColumn } from './custom-css';

const getNormalObject = (props, rowGapProps) => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
		}),
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		columnSize: {
			...getColumnSizeStyles(
				{
					...getGroupAttributes(props, 'columnSize'),
				},
				rowGapProps
			),
		},
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
		transition: getTransitionStyles({
			...getGroupAttributes(props, 'transition'),
		}),
	};

	return response;
};


const getHoverObject = props => {
	const response = {
		border:
			props['border-status-hover'] &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
			}),
	};

	return response;
};


const getBackgroundDisplayer = props => {
	const response = {
		transition: getTransitionStyles({
			...getGroupAttributes(props, 'transition'),
		}),
	};

	return response;
};


const getStyles = (props, rowGapProps) => {

	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner(
			{
				'': getNormalObject(props, rowGapProps),
				':hover': getHoverObject(props),
				' > .maxi-background-displayer > div': getBackgroundDisplayer(props),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle: props.parentBlockStyle,
				}),
				...getBlockBackgroundStyles({
					...getGroupAttributes(
						props,
						[
							'blockBackground',
							'border',
							'borderWidth',
							'borderRadius',
						],
						true
					),
					isHover: true,
					blockStyle: props.parentBlockStyle,
				}),
			},
			selectorsColumn,
			props
		),
	};

	return response;
};

export default getStyles;
