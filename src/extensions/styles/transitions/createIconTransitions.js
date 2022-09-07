/**
 * External dependencies
 */
import { capitalize } from 'lodash';

const createIconTransitions = ({
	target,
	titlePrefix,
	prefix = '',
	disableBackground = false,
	disableBorder = false,
	disableWidth = false,
}) => {
	const iconStatusHover = `${prefix}status-hover`;

	const getKey = key => (titlePrefix ? `${titlePrefix} ${key}` : key);

	const colorKey = getKey('colour');
	const backgroundKey = getKey('background');
	const widthKey = getKey('width');
	const borderKey = getKey('border');

	return {
		[colorKey]: {
			title: capitalize(colorKey),
			target: ` ${target} svg *:not(g)`,
			hoverProp: iconStatusHover,
			limitless: true,
		},
		...(!disableBackground && {
			[backgroundKey]: {
				title: capitalize(backgroundKey),
				target,
				property: 'background',
				hoverProp: iconStatusHover,
			},
		}),
		...(!disableWidth && {
			[widthKey]: {
				title: capitalize(widthKey),
				target: `${target} svg`,
				property: ['width', 'height'],
				hoverProp: iconStatusHover,
			},
		}),
		...(!disableBorder && {
			[borderKey]: {
				title: capitalize(borderKey),
				target,
				property: 'border',
				hoverProp: iconStatusHover,
			},
		}),
	};
};

export default createIconTransitions;
