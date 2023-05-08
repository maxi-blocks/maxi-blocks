import {
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import { styleProcessor } from '../../extensions/styles';
import {
	getBoxShadowStyles,
	getZIndexStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
	getSizeStyles,
} from '../../extensions/styles/helpers';
import { customCss } from './data';

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props._bs,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			blockStyle: props._bs,
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
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
	};

	return response;
};

const getHoverObject = props => {
	const [borderStatusHover, boxShadowStatusHover] = getAttributesValue({
		target: ['bo.sh', 'bs.sh'],
		props,
		isHover: true,
	});

	const response = {
		border:
			borderStatusHover &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				isHover: true,
				blockStyle: props._bs,
			}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle: props._bs,
			}),
	};

	return response;
};

const getStyles = props => {
	const { _uid: uniqueID } = props;

	const slideStyles = styleProcessor(
		{
			'': getNormalObject(props),
			':hover': getHoverObject(props),
			...getBlockBackgroundStyles({
				...getGroupAttributes(props, [
					'blockBackground',
					'border',
					'borderWidth',
					'borderRadius',
				]),
				blockStyle: props._bs,
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
				blockStyle: props._bs,
			}),
		},
		customCss.selectors,
		props
	);

	const response = {
		[uniqueID]: slideStyles,
		// On frontend styles are applied by id of the block,
		// this makes clones of the block have the same style as the block, while having different id
		[`${uniqueID}-clone`]: slideStyles,
	};

	return response;
};

export default getStyles;
