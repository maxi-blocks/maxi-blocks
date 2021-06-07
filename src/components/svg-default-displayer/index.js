/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../button';
import { generateDataObject, injectImgSVG } from '../../extensions/svg/utils';
import * as SVGShapes from '../../icons/shape-icons';

/**
 * External dependencies
 */
import classnames from 'classnames';
import DOMPurify from 'dompurify';
import { isNil, uniqueId } from 'lodash';

/**
 * Styles and Icons
 */
import './editor.scss';
import { styleNone } from '../../icons';

/**
 * Component
 */
const SVGDefaultsDisplayer = props => {
	const {
		SVGOptions = {},
		SVGCurrentElement,
		onChange,
		className,
		prefix = '',
	} = props;

	const classes = classnames('maxi-svg-defaults', className);

	return (
		<div className={classes}>
			<Button
				icon={styleNone}
				key='maxi-svg-defaults__item-none'
				className={`maxi-svg-defaults__item ${
					isNil(SVGCurrentElement) &&
					'maxi-svg-defaults__item--active'
				}`}
				onClick={() => {
					onChange();
				}}
			/>
			{Object.values(SVGShapes).map((svgEl, i) => {
				const cleanedContent = DOMPurify.sanitize(svgEl);
				return (
					<Button
						key={uniqueId('maxi-svg-defaults__item-')}
						className={`maxi-svg-defaults__item ${
							SVGCurrentElement === i &&
							'maxi-svg-defaults__item--active'
						}
						`}
						onClick={() => {
							const svg = document
								.createRange()
								.createContextualFragment(
									cleanedContent
								).firstElementChild;

							const resData = generateDataObject(
								SVGOptions[`${prefix}SVGData`],
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
