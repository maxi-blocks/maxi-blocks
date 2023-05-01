/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import { styleProcessor } from '../../extensions/styles';
import {
	getBackgroundStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getFlexStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import data from './data';

const getNormalObject = props => {
	const response = {
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
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props._bs,
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
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
	};

	return response;
};

const getHoverObject = props => {
	const [borderStatusHover, boxShadowStatusHover, opacityStatusHover] =
		getAttributesValue({
			target: ['bo.sh', 'bs.sh', '_o.sh'],
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

const getNormalStyles = (props, prefix) => {
	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor', 'backgroundGradient'],
				false,
				prefix
			),
			blockStyle: props._bs,
			prefix,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					prefix
				),
			},
			blockStyle: props._bs,
			prefix,
		}),
		size: getSizeStyles(
			{
				...getGroupAttributes(props, 'size', false, prefix),
			},
			prefix
		),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, prefix),
			},
			blockStyle: props._bs,
			prefix,
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, prefix),
			},
			prefix,
		}),
	};

	return response;
};

const getHoverStyles = (props, prefix) => {
	const [backgroundStatusHover, borderStatusHover, boxShadowStatusHover] =
		getAttributesValue({
			target: ['b.sh', 'bo.sh', 'bs.sh'],
			props,
			isHover: true,
			prefix,
		});

	const response = {
		...(backgroundStatusHover &&
			getBackgroundStyles({
				...getGroupAttributes(
					props,
					['background', 'backgroundColor', 'backgroundGradient'],
					true,
					prefix
				),
				blockStyle: props._bs,
				prefix,
				isHover: true,
			})),
		border:
			borderStatusHover &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true,
						prefix
					),
				},
				blockStyle: props._bs,
				prefix,
				isHover: true,
			}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, prefix),
				},
				blockStyle: props._bs,
				prefix,
				isHover: true,
			}),
	};

	return response;
};

const getActiveStyles = (props, rawPrefix) => {
	const prefix = `${rawPrefix}a-`;

	const [backgroundStatusActive, borderStatusActive, boxShadowStatusActive] =
		getAttributesValue({
			target: ['b.sa', 'bo.sa', 'bs.sa'],
			props,
			isHover: true,
			prefix: rawPrefix,
		});

	return {
		...(backgroundStatusActive &&
			getBackgroundStyles({
				...getGroupAttributes(
					props,
					['background', 'backgroundColor', 'backgroundGradient'],
					false,
					prefix
				),
				blockStyle: props._bs,
				prefix,
			})),
		border:
			borderStatusActive &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						false,
						prefix
					),
				},
				blockStyle: props._bs,
				prefix,
			}),
		boxShadow:
			boxShadowStatusActive &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', false, prefix),
				},
				blockStyle: props._bs,
				prefix,
			}),
	};
};

const getStyles = props => {
	const { _uid: uniqueID } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				' .maxi-pane-block__header': getNormalStyles(props, 'he-'),
				' .maxi-pane-block__content': getNormalStyles(props, 'c-'),
				'[aria-expanded] .maxi-pane-block__header:hover':
					getHoverStyles(props, 'he-'),
				'[aria-expanded] .maxi-pane-block__content:hover':
					getHoverStyles(props, 'c-'),
				'[aria-expanded="true"] .maxi-pane-block__header':
					getActiveStyles(props, 'he-'),
				'[aria-expanded="true"] .maxi-pane-block__content':
					getActiveStyles(props, 'c-'),
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
			data,
			props
		),
	};
	return response;
};

export default getStyles;
