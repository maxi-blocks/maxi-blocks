/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarIconSize } from '@maxi-icons';
import SvgWidthControl from '@components/svg-width-control';
import SvgStrokeWidthControl from '@components/svg-stroke-width-control';

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
				/>
				{type !== 'Shape' && (
					<SvgStrokeWidthControl
						{...props}
						content={props.content}
						onChange={onChange}
						breakpoint={breakpoint}
						prefix='svg-'
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default SvgWidth;
