/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import { styleProcessor } from '../../extensions/styles';
import {
	getAlignmentFlexStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getFlexStyles,
	getMarginPaddingStyles,
	getNumberCounterStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import data from './data';

const getWrapperObject = props => {
	const response = {
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
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
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin'),
			},
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding'),
			},
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
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props._bs,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
	};

	return response;
};

const getHoverWrapperObject = props => {
	const [borderStatusHover, boxShadowStatusHover, opacityStatusHover] =
		getAttributesValue({
			target: ['bo.s', 'bs.s', '_o.s'],
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
		opacity:
			opacityStatusHover &&
			getOpacityStyles(
				{ ...getGroupAttributes(props, 'opacity', true) },
				true
			),
	};

	return response;
};

const getBoxObject = props => {
	const fontSize = getAttributesValue({
		target: 'nc-ti_fs',
		props,
	});

	const endCountValue = Math.ceil(
		(getAttributesValue({ target: 'nc_e', props }) * 360) / 100
	);

	const size = getSizeStyles(
		{
			...getGroupAttributes(props, 'size', false, 'nc-'),
			...getGroupAttributes(props, 'numberCounter'),
		},
		'nc-'
	);
	Object.entries(size).forEach(([key, val]) => {
		if (key.includes('_miw') && !val)
			size[key] = fontSize * (endCountValue.toString().length - 1);
	});

	const response = {
		size,
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin', false, 'nc-'),
			},
			prefix: 'nc-',
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, 'nc-'),
			},
			prefix: 'nc-',
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, 'nc-'),
			},
			blockStyle: props._bs,
			prefix: 'nc-',
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					'nc-'
				),
			},
			blockStyle: props._bs,
			prefix: 'nc-',
		}),
	};

	return response;
};

const getHoverBoxObject = props => {
	const response = {
		border:
			getAttributesValue({
				target: 'nc-bo.sh',
				props,
			}) &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true,
						'nc-'
					),
				},
				isHover: true,
				blockStyle: props._bs,
				prefix: 'nc-',
			}),
		boxShadow:
			getAttributesValue({
				target: 'nc-bs.sh',
				props,
			}) &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, 'nc-'),
				},
				isHover: true,
				blockStyle: props._bs,
				prefix: 'nc-',
			}),
	};

	return response;
};

const getStyles = props => {
	const { _uid: uniqueID, _bs: blockStyle } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getWrapperObject(props),
				':hover': getHoverWrapperObject(props),
				':hover .maxi-number-counter__box': getHoverBoxObject(props),
				' .maxi-number-counter__box': getBoxObject(props),
				...getNumberCounterStyles({
					obj: {
						...getGroupAttributes(props, 'numberCounter'),
					},
					target: '.maxi-number-counter__box',
					blockStyle,
				}),
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
					blockStyle: props._bs,
					isHover: true,
				}),
			},
			data,
			props
		),
	};
	return response;
};

export default getStyles;
