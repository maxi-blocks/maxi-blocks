/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import loadable from '@loadable/component';

const DOMPurify = loadable(() =>
	import('dompurify').then(DOMPurify => ({
		default: DOMPurify.sanitize,
	}))
);
const parse = loadable(() => import('html-react-parser'));

const setSVGColor = ({ svg, color, type = 'fill' }) => {
	const cleanedSVG = DOMPurify.sanitize(svg, {
		ADD_TAGS: ['use'],
	});

	const setColor = el => {
		const { attribs, children } = el;

		if (type in attribs) el.attribs[type] = color;
		if (children && !isEmpty(children)) {
			el.children = el.children.map(child => setColor(child));
		}

		return el;
	};

	const colorOptions = {
		replace: setColor,
	};

	const parsedSVG = parse(cleanedSVG, colorOptions);

	return renderToString(parsedSVG).replace('viewbox', 'viewBox');
};

export default setSVGColor;
