/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getPaletteAttributes,
	getColorRGBAString,
	stylesCleaner,
} from '../../extensions/styles';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
		}),
	};
	return response;
};

export default getStyles;
