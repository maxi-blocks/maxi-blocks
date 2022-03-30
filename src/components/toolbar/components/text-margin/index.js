/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { getGroupAttributes } from '../../../../extensions/styles';
import AxisControl from '../../../axis-control';

/**
 * Icons
 */
import './editor.scss';
import { toolbarTextMargin } from '../../../../icons';

/**
 * BoxShadow
 */
const ALLOWED_BLOCKS = ['maxi-blocks/text-maxi'];

const TextMargin = props => {
	const { blockName, breakpoint, onChange } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	return (
		<ToolbarPopover
			className='toolbar-item__text-margin'
			tooltip={__('Margin', 'maxi-blocks')}
			icon={toolbarTextMargin}
			advancedOptions='margin padding'
			tab={0}
		>
			<div className='toolbar-item__text-margin__popover toolbar-item__padding-margin__popover'>
				<AxisControl
					{...getGroupAttributes(props, 'margin')}
					label={__('Margin', 'maxi-blocks')}
					onChange={onChange}
					target='margin'
					noResponsiveTabs
					breakpoint={breakpoint}
					optionType='string'
					disableSync
					disableAuto
				/>
			</div>
		</ToolbarPopover>
	);
};

export default TextMargin;
