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
			blockStyle: props.blockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props.blockStyle,
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
	const {
		'border-status': borderStatusHover,
		'box-shadow-status': boxShadowStatusHover,
		'opacity-status': opacityStatusHover,
	} = getAttributesValue({
		target: ['border-status', 'box-shadow-status', 'opacity-status'],
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
				blockStyle: props.blockStyle,
			}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle: props.blockStyle,
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
			blockStyle: props.blockStyle,
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
			blockStyle: props.blockStyle,
			prefix,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size', false, prefix),
			prefix,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, prefix),
			},
			blockStyle: props.blockStyle,
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
	const { backgroundStatusHover, borderStatusHover, boxShadowStatusHover } =
		getAttributesValue({
			target: [
				'background-status-hover',
				'border-status-hover',
				'box-shadow-status-hover',
			],
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
				blockStyle: props.blockStyle,
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
				blockStyle: props.blockStyle,
				prefix,
				isHover: true,
			}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, prefix),
				},
				blockStyle: props.blockStyle,
				prefix,
				isHover: true,
			}),
	};

	return response;
};

const getActiveStyles = (props, rawPrefix) => {
	const prefix = `${rawPrefix}active-`;

	const { backgroundStatusHover, borderStatusHover, boxShadowStatusHover } =
		getAttributesValue({
			target: [
				'background-status-hover',
				'border-status-hover',
				'box-shadow-status-hover',
			],
			props,
			isHover: true,
			prefix: rawPrefix,
		});

	return {
		...(backgroundStatusHover &&
			getBackgroundStyles({
				...getGroupAttributes(
					props,
					['background', 'backgroundColor', 'backgroundGradient'],
					false,
					prefix
				),
				blockStyle: props.blockStyle,
				prefix,
			})),
		border:
			borderStatusHover &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						false,
						prefix
					),
				},
				blockStyle: props.blockStyle,
				prefix,
			}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', false, prefix),
				},
				blockStyle: props.blockStyle,
				prefix,
			}),
	};
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				' .maxi-pane-block__header': getNormalStyles(props, 'header-'),
				' .maxi-pane-block__content': getNormalStyles(
					props,
					'content-'
				),
				'[aria-expanded] .maxi-pane-block__header:hover':
					getHoverStyles(props, 'header-'),
				'[aria-expanded] .maxi-pane-block__content:hover':
					getHoverStyles(props, 'content-'),
				'[aria-expanded="true"] .maxi-pane-block__header':
					getActiveStyles(props, 'header-'),
				'[aria-expanded="true"] .maxi-pane-block__content':
					getActiveStyles(props, 'content-'),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle: props.blockStyle,
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
					blockStyle: props.blockStyle,
				}),
			},
			data,
			props
		),
	};
	return response;
};

export default getStyles;
