/**
 * WordPress dependencies
 */
const { Button } = wp.components;
const { RawHTML } = wp.element;

/**
 * Internal dependencies
 */
import { generateDataObject, injectImgSVG } from '../../extensions/svg/utils';
import * as SVGShapes from '../../icons/shape-icons';

/**
 * External dependencies
 */
import classnames from 'classnames';
import DOMPurify from 'dompurify';
import { isNil } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const SVGDefaultsDisplayer = props => {
	const { SVGOptions, type, SVGCurrentElement, onChange, className } = props;

	const classes = classnames('maxi-svg-defaults', className);

	return (
		<div className={classes}>
			{Object.values(SVGShapes).map((svgEl, i) => {
				const cleanedContent = DOMPurify.sanitize(svgEl);
				return (
					<Button
						className={`maxi-svg-defaults__item ${
							type === 'background' &&
							SVGOptions.SVGCurrentShape === i
								? 'maxi-svg-defaults__item--active'
								: type === 'shape' && SVGCurrentElement === i
								? 'maxi-svg-defaults__item--active'
								: ''
						}
						`}
						onClick={() => {
							const svg = document
								.createRange()
								.createContextualFragment(cleanedContent)
								.firstElementChild;

							const resData = generateDataObject(
								SVGOptions.SVGData,
								svg
							);
							const resEl = injectImgSVG(svg, resData);

							onChange({
								SVGCurrentShape: i,
								SVGElement: resEl.outerHTML,
								SVGMediaID: null,
								SVGMediaURL: null,
								SVGData: JSON.stringify(resData),
							});
						}}
					>
						<RawHTML>{cleanedContent}</RawHTML>
					</Button>
				);
			})}
		</div>
	);
};

export default SVGDefaultsDisplayer;
