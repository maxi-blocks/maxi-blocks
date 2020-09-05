/**
 * Internal dependencies
 */
import SVGDefaults from '../SVGControl/defaults';
import { generateDataObject, injectImgSVG } from '../SVGControl/utils';

/**
 * External dependencies
 */
import { ReactSVG } from 'react-svg';
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
			{SVGDefaults.map(svgEl => (
				<ReactSVG
					src={svgEl}
					className='maxi-svg-defaults__item'
					onClick={e => {
						if (e.target.ownerSVGElement) {
							const svg = e.target.ownerSVGElement;
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
