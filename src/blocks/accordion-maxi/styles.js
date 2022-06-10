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

const getPaneTitleStyles = props => {
	const response = { label: 'Pane title', general: {} };

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

	response.general = {
		color: getColor('title-'),
		'background-color': getColor('title-background-'),
	};

	return { paneTitle: response };
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
			' .maxi-pane-block .maxi-pane-block__title':
				getPaneTitleStyles(props),
		}),
	};
	return response;
};

export default getStyles;
