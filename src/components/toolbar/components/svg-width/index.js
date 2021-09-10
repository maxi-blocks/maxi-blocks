/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarShapeWidth } from '../../../../icons';
import SvgWidthControl from '../../../svg-width-control';
import SvgStrokeWidthControl from '../../../svg-stroke-width-control';

/**
 * SvgWidth
 */
const SvgWidth = props => {
	const {
		blockName,
		onChange,
		breakpoint,
		changeSVGSize,
		changeSVGStrokeWidth,
	} = props;

	if (blockName !== 'maxi-blocks/svg-icon-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__svg-size'
			tooltip={__('SVG Width/Stroke', 'maxi-blocks')}
			icon={toolbarShapeWidth}
		>
			<div className='toolbar-item__svg-size__popover'>
				<SvgWidthControl
					prefix='svg-'
					{...props}
					onChange={obj => {
						onChange(obj);
						changeSVGSize(obj[`svg-width-${breakpoint}`]);
					}}
					breakpoint={breakpoint}
				/>
				<SvgStrokeWidthControl
					prefix='svg-'
					{...props}
					onChange={obj => {
						onChange(obj);
						changeSVGStrokeWidth(obj[`svg-stroke-${breakpoint}`]);
					}}
					breakpoint={breakpoint}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default SvgWidth;
