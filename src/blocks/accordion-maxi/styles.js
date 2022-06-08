/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import { stylesCleaner } from '../../extensions/styles';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getPaneStyles = props => {
	const response = { label: 'Pane spacing', general: {} };
	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};
		if (!isNil(props[`pane-spacing-${breakpoint}`])) {
			response[breakpoint]['margin-bottom'] = `${
				props[`pane-spacing-${breakpoint}`]
			}px`;
		}
	});
	return { paneSpacing: response };
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			' .maxi-pane-block': getPaneStyles(props),
		}),
	};
	return response;
};

export default getStyles;
