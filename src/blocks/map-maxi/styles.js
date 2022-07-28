/**
 * Internal dependencies
 */
import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getFlexStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getSVGStyles,
	getSVGWidthStyles,
	getTypographyStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import arrowProperties from './arrowProperties';
import { selectorsMap } from './custom-css';

const getNormalObject = props => {
	const { blockStyle } = props;

	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			blockStyle,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
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
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
	};

	return response;
};

const getHoverNormalObject = props => {
	const { blockStyle } = props;

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
				blockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle,
			}),
	};

	return response;
};

const getMapObject = (props, isTitle) => {
	const { blockStyle } = props;

	const typography = isTitle
		? getTypographyStyles({
				obj: {
					...getGroupAttributes(props, 'typography'),
				},
				blockStyle,
		  })
		: getTypographyStyles({
				obj: {
					...getGroupAttributes(
						props,
						'typography',
						false,
						'description-'
					),
				},
				blockStyle,
				prefix: 'description-',
		  });

	const response = {
		[isTitle ? 'typography' : 'description-typography']: typography,
	};

	return response;
};

const modifyBorderWidths = (obj, arrowNumber) => {
	const newObj = {};

	Object.keys(obj).forEach(key => {
		if (typeof obj[key] === 'object') {
			newObj[key] = modifyBorderWidths(obj[key], arrowNumber);
		} else if (
			arrowProperties[arrowNumber].allowedBordersToModify.includes(key)
		) {
			const unit = obj[key].slice(-2);

			newObj[key] = `calc(${
				parseInt(obj['border-bottom-width']) * 2
			}${unit} + ${arrowProperties[arrowNumber].width})`;

			if (!newObj.bottom && arrowNumber === 4) {
				newObj.bottom = `-${obj['border-bottom-width']}`;
			}
		} else {
			newObj[key] = obj[key];
		}
	});

	return newObj;
};

const getBorderArrowObject = props => {
	const { blockStyle } = props;

	const newObj = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					'popup-'
				),
			},
			blockStyle,
			prefix: 'popup-',
			borderColorProperty: 'border-top-color',
		}),
	};
	const response = modifyBorderWidths(newObj, props['map-popup'] - 1);

	return response;
};

const getStyles = props => {
	const { uniqueID, blockStyle } = props;

	const response = {
		[uniqueID]: stylesCleaner(
			{
				'': getNormalObject(props),
				':hover': getHoverNormalObject(props),
				' .maxi-map-block__popup__content__title': getMapObject(
					props,
					true
				),
				' .maxi-map-block__popup__content__description':
					getMapObject(props),
				' .maxi-map-block__popup': {
					border: getBorderStyles({
						obj: {
							...getGroupAttributes(
								props,
								['border', 'borderWidth', 'borderRadius'],
								false,
								'popup-'
							),
						},
						blockStyle,
						prefix: 'popup-',
					}),
					boxShadow: getBoxShadowStyles({
						obj: {
							...getGroupAttributes(
								props,
								'boxShadow',
								false,
								'popup-'
							),
						},
						blockStyle,
						prefix: 'popup-',
					}),
					...getBackgroundStyles({
						...getGroupAttributes(
							props,
							['background', 'backgroundColor'],
							false,
							'popup-'
						),
						blockStyle,
						prefix: 'popup-',
					}),
				},
				[` .maxi-map-block__popup--${props['map-popup']}:before`]: {
					...getBackgroundStyles({
						...getGroupAttributes(
							props,
							['background', 'backgroundColor'],
							false,
							'popup-'
						),
						blockStyle,
						prefix: 'popup-',
						backgroundColorProperty: 'border-top-color',
					}),
				},
				[` .maxi-map-block__popup--${props['map-popup']}:after`]:
					getBorderArrowObject(props),
				' .leaflet-marker-icon': getSVGWidthStyles({
					obj: getGroupAttributes(props, 'svg'),
					isImportant: true,
				}),
				...getSVGStyles({
					obj: {
						...getGroupAttributes(props, 'svg'),
					},
					target: ' .leaflet-marker-icon',
					blockStyle,
				}),
			},
			selectorsMap,
			props
		),
	};

	return response;
};

export default getStyles;
