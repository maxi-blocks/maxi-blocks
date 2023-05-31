/**
 * External dependencies
 */
import { capitalize } from 'lodash';
import getCleanKey from '../getCleanKey';

const createIconTransitions = ({
	target,
	titlePrefix,
	prefix = '',
	shortPrefix = '',
	disableBackground = false,
	disableBorder = false,
	disableWidth = false,
}) => {
	const iconStatusHover = getCleanKey(`${prefix}.sh`);

	const getKey = key => (titlePrefix ? `${titlePrefix} ${key}` : key);
	const getShortKey = key => (shortPrefix ? `${shortPrefix} ${key}` : key);

	const colorKey = getKey('colour');
	const colorKeyTwo = `${colorKey} two`;
	const backgroundKey = getKey('background');
	const widthKey = getKey('width');
	const borderKey = getKey('border');

	return {
		[getShortKey('co')]: {
			ti: capitalize(colorKey),
			ta: ` ${target} svg > *:not(g)`,
			p: false,
			hp: iconStatusHover,
		},
		[getShortKey('co 2')]: {
			ti: capitalize(colorKeyTwo),
			ta: ` ${target} svg g *:not(g)`,
			p: false,
			hp: iconStatusHover,
		},
		...(!disableBackground && {
			[getShortKey('bg')]: {
				ti: capitalize(backgroundKey),
				ta: target,
				p: 'background',
				hp: iconStatusHover,
			},
		}),
		...(!disableWidth && {
			[getShortKey('w')]: {
				ti: capitalize(widthKey),
				ta: `${target} svg`,
				p: ['width', 'height'],
				hp: iconStatusHover,
			},
		}),
		...(!disableBorder && {
			[getShortKey('bo')]: {
				ti: capitalize(borderKey),
				ta: target,
				p: 'border',
				hp: iconStatusHover,
			},
		}),
	};
};

export default createIconTransitions;
