/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getPaletteAttributes,
	getColorRGBAString,
	stylesCleaner,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getSVGStyles } from '../../extensions/styles/helpers';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getIconSize = (obj, isHover = false) => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconWidth = obj[`icon-width-${breakpoint}`];

		if (!isNil(iconWidth) && !isEmpty(iconWidth)) {
			const iconUnit = getLastBreakpointAttribute({
				target: 'icon-width-unit',
				breakpoint,
				attributes: obj,
				isHover,
			});
			response[breakpoint].width = `${iconWidth}${iconUnit}`;
			response[breakpoint].height = `${iconWidth}${iconUnit}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconSize: response };
};

const getIconObject = props => {
	const response = {
		...getSVGStyles({
			obj: props,
			target: '.maxi-pane-block[aria-expanded=false] .maxi-pane-block__icon',
			prefix: 'icon-',
			blockStyle: props.blockStyle,
		}),
		...getSVGStyles({
			obj: props,
			target: '.maxi-pane-block[aria-expanded=true] .maxi-pane-block__icon',
			prefix: 'active-icon-',
			blockStyle: props.blockStyle,
		}),
		...getSVGStyles({
			obj: props,
			target: '.maxi-pane-block[aria-expanded=false]:hover .maxi-pane-block__icon',
			prefix: 'icon-',
			blockStyle: props.blockStyle,
			isHover: true,
		}),
		...getSVGStyles({
			obj: props,
			target: '.maxi-pane-block[aria-expanded=true]:hover .maxi-pane-block__icon',
			prefix: 'active-icon-',
			blockStyle: props.blockStyle,
			isHover: true,
		}),
		'.maxi-accordion-block .maxi-pane-block__icon svg': getIconSize(
			props,
			false
		),
	};
	return response;
};

const getPaneSpacing = props => {
	const response = { label: 'Pane spacing', general: {} };
	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};
		if (!isNil(props[`pane-spacing-${breakpoint}`])) {
			response[breakpoint]['row-gap'] = `${
				props[`pane-spacing-${breakpoint}`]
			}px`;
		}
	});
	return response;
};

const getPaneTitleStyles = (props, target) => {
	const getColor = prefix => {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj: props,
				prefix,
			});
		if (!paletteStatus && !isNil(color)) return color;
		if (paletteStatus && paletteColor)
			return getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle: props.blockStyle,
			});
	};

	const response = {
		[`${target} .maxi-pane-block__title`]: {
			paneTitleColor: {
				label: 'Pane title color',
				general: {
					color: getColor('title-'),
				},
			},
		},
		[`${target} .maxi-pane-block__header`]: {
			paneTitleBgColor: {
				label: 'Pane title background color',
				general: {
					'background-color': getColor('title-background-'),
					'flex-direction':
						props['icon-position'] === 'right'
							? 'row'
							: 'row-reverse',
				},
			},
		},
	};

	return response;
};

const getPaneStyles = props => {
	const response = {
		paneSpacing: getPaneSpacing(props),
	};
	return response;
};

const getStyles = props => {
	const { uniqueID } = props;
	const response = {
		[uniqueID]: stylesCleaner({
			'.maxi-accordion-block .maxi-accordion-block__content':
				getPaneStyles(props),
			...getPaneTitleStyles(props, ' .maxi-pane-block'),
			...getIconObject(props),
		}),
	};
	return response;
};

export default getStyles;
