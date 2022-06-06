/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	stylesCleaner,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import {
	getSizeStyles,
	getBoxShadowStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getMarginPaddingStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
	getSVGStyles,
} from '../../extensions/styles/helpers';
import { selectorsSlider } from './custom-css';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props.blockStyle,
		}),
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
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
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
				blockStyle: props.blockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle: props.blockStyle,
			}),
	};

	return response;
};

// TO DO: abstract this (and the Button's one) later
const getIconSize = (obj, isHover = false) => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (
			!isNil(
				obj[
					`navigation-arrow-both-icon-width-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			response[breakpoint].width = `${
				obj[
					`navigation-arrow-both-icon-width-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			}${getLastBreakpointAttribute({
				target: 'navigation-arrow-both-icon-width-unit',
				breakpoint,
				attributes: obj,
				isHover,
			})}`;
			response[breakpoint].height = `${
				obj[
					`navigation-arrow-both-icon-width-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			}${getLastBreakpointAttribute({
				target: 'navigation-arrow-both-icon-width-unit',
				breakpoint,
				attributes: obj,
				isHover,
			})}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconSize: response };
};

// TO DO: abstract this (and the Button's one) later
const getIconPathStyles = (obj, isHover = false) => {
	const response = {
		label: 'Icon path',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (
			!isNil(
				obj[
					`navigation-arrow-both-icon-stroke-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			response[breakpoint]['stroke-width'] = `${
				obj[
					`navigation-arrow-both-icon-stroke-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconPath: response };
};

const getIconObject = props => {
	const response = {
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'navigationArrowBothIconPadding'),
			},
			prefix: 'navigation-arrow-both-icon-',
		}),
	};

	const responsive = {
		label: 'Icon responsive',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		responsive[breakpoint] = {};

		if (!isNil(props[`navigation-arrow-both-icon-spacing-${breakpoint}`])) {
			responsive[breakpoint][
				'margin-right'
			] = `${getLastBreakpointAttribute({
				target: 'navigation-arrow-both-icon-spacing',
				breakpoint,
				attributes: props,
			})}px`;
		}
	});

	response.iconResponsive = responsive;

	return response;
};

const getStyles = props => {
	const { uniqueID, blockStyle } = props;

	const response = {
		[uniqueID]: stylesCleaner(
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
				...getSVGStyles({
					obj: props,
					target: ' .maxi-slider-block__arrow',
					blockStyle,
					prefix: 'navigation-arrow-both-icon-',
				}),
				' .maxi-slider-block__arrow svg': getIconSize(props, false),
				' .maxi-slider-block__arrow svg > *': getIconObject(
					props,
					'svg'
				),
				' .maxi-slider-block__arrow svg path': getIconPathStyles(
					props,
					false
				),
			},
			selectorsSlider,
			props
		),
	};

	return response;
};

export default getStyles;
