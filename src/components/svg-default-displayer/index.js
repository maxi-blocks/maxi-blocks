/**
 * Internal dependencies
 */
import { generateDataObject, injectImgSVG } from '../svg-control/utils';
import * as SVGShapes from '../../icons/shape-icons';
import SVGButton from '../svg-button';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const SVGDefaultsDisplayer = props => {
	const { SVGData, onChange, className } = props;

	const classes = classnames('maxi-svg-defaults', className);

	return (
		<div className={classes}>
			{Object.values(SVGShapes).map(svgEl => (
				<SVGButton
					content={svgEl}
					className='maxi-svg-defaults__item'
					onClick={svg => {
						if (svg) {
							const resData = generateDataObject(SVGData, svg);
							const resEl = injectImgSVG(svg, resData);

							onChange({
								SVGElement: resEl.outerHTML,
								SVGMediaID: null,
								SVGMediaURL: null,
								SVGData: JSON.stringify(resData),
							});
						}
					}}
				/>
			))}
		</div>
	);
};

export default SVGDefaultsDisplayer;
