/**
 * External dependencies
 */
import { capitalize } from 'lodash';

const createIconTransitions = ({
	className,
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
			target: ` ${className} svg *:not(g)`,
			hoverProp: iconStatusHover,
			limitless: true,
		},
		...(!disableBackground && {
			[backgroundKey]: {
				title: capitalize(backgroundKey),
				target: className,
				property: 'background',
				hoverProp: iconStatusHover,
			},
		}),
		...(!disableWidth && {
			[widthKey]: {
				title: capitalize(widthKey),
				target: `${className} svg`,
				property: ['width', 'height'],
				hoverProp: iconStatusHover,
			},
		}),
		...(!disableBorder && {
			[borderKey]: {
				title: capitalize(borderKey),
				target: className,
				property: 'border',
				hoverProp: iconStatusHover,
			},
		}),
	};
};

export default createIconTransitions;
