/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { ContextLoop } from '../../..';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarDynamicContent } from '../../../../icons';

/**
 * Dynamic Content
 */

const ALLOWED_BLOCKS = [
	'maxi-blocks/container-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/group-maxi',
];

const ContextLoopToolbar = props => {
	const { blockName, ...restProps } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	return (
		<ToolbarPopover
			className='toolbar-item__context-loop'
			tooltip={__('Context loop', 'maxi-blocks')}
			icon={toolbarDynamicContent}
		>
			<ContextLoop
				className='toolbar-item__context-loop__popover'
				{...restProps}
			/>
		</ToolbarPopover>
	);
};

export default ContextLoopToolbar;
