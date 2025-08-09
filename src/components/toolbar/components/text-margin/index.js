/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import { getGroupAttributes } from '@extensions/styles';
import MarginControl from '@components/margin-control';

/**
 * Icons
 */
import './editor.scss';
import { toolbarTextMargin } from '@maxi-icons';

/**
 * BoxShadow
 */
const ALLOWED_BLOCKS = ['maxi-blocks/text-maxi'];

const TextMargin = props => {
	const { blockName, breakpoint, onChange } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	return (
		<ToolbarPopover
			position='bottom center'
			className='toolbar-item__text-margin'
			tooltip={__('Margin', 'maxi-blocks')}
			icon={toolbarTextMargin}
			advancedOptions='margin padding'
		>
			<div className='toolbar-item__text-margin__popover toolbar-item__padding-margin__popover'>
				<MarginControl
					{...getGroupAttributes(props, 'margin')}
					onChange={onChange}
					breakpoint={breakpoint}
					noResponsiveTabs
				/>
			</div>
		</ToolbarPopover>
	);
};

export default TextMargin;
