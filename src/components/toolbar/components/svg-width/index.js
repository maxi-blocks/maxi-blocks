/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { setSVGStrokeWidth } from '../../../../extensions/svg';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarIconSize } from '../../../../icons';
import SvgWidthControl from '../../../svg-width-control';
import SvgStrokeWidthControl from '../../../svg-stroke-width-control';

/**
 * SvgWidth
 */
const SvgWidth = props => {
	const { blockName, onChange, breakpoint, type, resizableObject } = props;

	if (blockName !== 'maxi-blocks/svg-icon-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__svg-size'
			tooltip={__('Icon size', 'maxi-blocks')}
			icon={toolbarIconSize}
			advancedOptions='icon line width'
		>
			<div className='toolbar-item__svg-size__popover'>
				<SvgWidthControl
					{...props}
					onChange={onChange}
					prefix='svg-'
					breakpoint={breakpoint}
					resizableObject={resizableObject}
					enableResponsive
				/>
				{type !== 'Shape' && (
					<SvgStrokeWidthControl
						{...props}
						onChange={obj => {
							onChange({
								...obj,
								content: setSVGStrokeWidth(
									props.content,
									obj[`svg-stroke-${breakpoint}`]
								),
							});
						}}
						breakpoint={breakpoint}
						prefix='svg-'
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default SvgWidth;
