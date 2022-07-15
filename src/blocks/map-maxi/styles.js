/**
 * Internal dependencies
 */
import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getMapStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getZIndexStyles,
	getTypographyStyles,
	getSVGStyles,
	getSVGWidthStyles,
	getFlexStyles,
} from '../../extensions/styles/helpers';
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
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
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

const getMapObject = (props, target) => {
	const { blockStyle } = props;

	const typography =
		target === 'text'
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
		map: getMapStyles(
			{
				...getGroupAttributes(props, 'map'),
			},
			target,
			blockStyle
		),
		[target === 'text' ? 'typography' : 'description-typography']:
			typography,
	};

	return response;
};

const changeAttributeName = (
	obj,
	attributesNames,
	newAttributeName,
	addedValue = '',
	level = 0
) => {
	const newObj = {};

	Object.keys(obj).forEach(key => {
		if (typeof obj[key] === 'object') {
			if (attributesNames.includes(key)) {
				newObj[newAttributeName] = obj[key] + addedValue;
			}
			newObj[key] = changeAttributeName(
				obj[key],
				attributesNames,
				newAttributeName,
				addedValue,
				level + 1
			);
		} else {
			if (attributesNames.includes(key)) {
				newObj[newAttributeName] = obj[key] + addedValue;
				return;
			}
			newObj[key] = obj[key];
		}
	});

	return level === 1
		? {
				...newObj,
				label:
					newAttributeName.charAt(0).toUpperCase() +
					newAttributeName.slice(1).replace(/-/g, ' '),
		  }
		: newObj;
};

const arrowProperties = {
	1: {
		width: '20px',
		allowedBordersToModify: [
			'border-top-width',
			'border-right-width',
			'border-bottom-width',
			'border-left-width',
		],
	},
	2: {
		width: '30px',
		allowedBordersToModify: ['border-top-width', 'border-left-width'],
	},
	3: {
		width: '30px',
		allowedBordersToModify: ['border-top-width', 'border-left-width'],
	},
	4: {
		width: '25px',
		allowedBordersToModify: [
			'border-top-width',
			'border-right-width',
			'border-bottom-width',
			'border-left-width',
		],
	},
	5: {
		width: '30px',
		allowedBordersToModify: ['border-top-width', 'border-left-width'],
	},
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
		} else {
			newObj[key] = obj[key];
		}
	});

	return newObj;
};

const getBorderArrowObject = props => {
	const { blockStyle } = props;

	const newObj = {
		border: changeAttributeName(
			getBorderStyles({
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
			['border-color'],
			'border-top-color'
		),
	};

	return modifyBorderWidths(newObj, props['map-popup']);
};

const getStyles = props => {
	const { uniqueID, blockStyle } = props;

	const response = {
		[uniqueID]: stylesCleaner(
			{
				'': getNormalObject(props),
				':hover': getHoverNormalObject(props),
				' .map-marker-info-window__title': getMapObject(props, 'text'),
				' .map-marker-info-window__address': getMapObject(
					props,
					'address'
				),
				' .leaflet-container': {
					size: getSizeStyles({
						...getGroupAttributes(props, 'size'),
					}),
				},
				' .map-marker-info-window': {
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
				[` .map-marker-info-window__${props['map-popup']}:before`]: {
					...changeAttributeName(
						getBackgroundStyles({
							...getGroupAttributes(
								props,
								['background', 'backgroundColor'],
								false,
								'popup-'
							),
							blockStyle,
							prefix: 'popup-',
						}),
						['background-color', 'background'],
						'border-top-color'
					),
				},
				[` .map-marker-info-window__${props['map-popup']}:after`]:
					getBorderArrowObject(props),
				' .leaflet-marker-icon': getSVGWidthStyles(
					getGroupAttributes(props, 'svg'),
					'',
					true
				),
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
