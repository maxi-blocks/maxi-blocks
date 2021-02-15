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

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const SVGDefaultsDisplayer = props => {
	const { SVGOptions = {}, SVGCurrentElement, onChange, className } = props;

	const classes = classnames('maxi-svg-defaults', className);

	return (
		<div className={classes}>
			{Object.values(SVGShapes).map((svgEl, i) => {
				const cleanedContent = DOMPurify.sanitize(svgEl);
				return (
					<Button
						key={`maxi-svg-defaults__item-${i}`}
						className={`maxi-svg-defaults__item ${
							SVGCurrentElement === i &&
							'maxi-svg-defaults__item--active'
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
								SVGCurrentElement: i,
								SVGElement: resEl.outerHTML,
								SVGMediaID: null,
								SVGMediaURL: null,
								SVGData: resData,
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
