/**
 * Internal dependencies
 */
import { getBlockStyle } from '../styles';
import getActiveStyleCard from './getActiveStyleCard';

import { isEmpty } from 'lodash';

const getPaletteColor = ({ clientId, color, blockStyle }) => {
	const SCValue = getActiveStyleCard().value;
	const parentBlockStyle = blockStyle ?? getBlockStyle(clientId);

	let string = '';
	if (SCValue) string += 'SCValues doesnt exist || ';
	if (SCValue?.[parentBlockStyle].defaultStyleCard?.color?.[color])
		string += 'colour on SCValues doesnt exist || ';
	if (
		isEmpty(
			getComputedStyle(document.documentElement).getPropertyValue(
				`--maxi-${parentBlockStyle}-color-${color}`
			)
		)
	) {
		string += 'colour variable on root is empty and may not exist: ';
		string += document.querySelector(
			'#maxi-blocks-sc-vars-inline-css'
		).innerText;
	}

	return string;

	// return (
	// 	SCValue?.[parentBlockStyle].styleCard?.color?.[color] ||
	// 	SCValue?.[parentBlockStyle].defaultStyleCard?.color?.[color] ||
	// 	getComputedStyle(document.documentElement).getPropertyValue(
	// 		`--maxi-${parentBlockStyle}-color-${color}`
	// 	)
	// );
};

export default getPaletteColor;
