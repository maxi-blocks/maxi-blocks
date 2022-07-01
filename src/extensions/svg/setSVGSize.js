/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element';

/**
 * External dependencies
 */
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

const setSVGSize = ({ svg, size }) => {
	const cleanedSVG = DOMPurify.sanitize(svg, {
		ADD_TAGS: ['use'],
	});

	const setColor = el => {
		el.attribs.width = size;
		el.attribs.height = size;

		return el;
	};

	const colorOptions = {
		replace: setColor,
	};

	const parsedSVG = parse(cleanedSVG, colorOptions);

	return renderToString(parsedSVG).replace('viewbox', 'viewBox');
};

export default setSVGSize;
