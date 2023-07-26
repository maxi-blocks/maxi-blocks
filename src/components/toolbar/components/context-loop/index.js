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
	'maxi-blocks/pane-maxi',
	'maxi-blocks/slide-maxi',
	'maxi-blocks/accordion-maxi',
	'maxi-blocks/slider-maxi',
];

const ContextLoopToolbar = props => {
	const { blockName, ...restProps } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const contentTypes = {
		'maxi-blocks/container-maxi': 'container',
		'maxi-blocks/row-maxi': 'row',
		'maxi-blocks/column-maxi': 'column',
		'maxi-blocks/group-maxi': 'group',
		'maxi-blocks/pane-maxi': 'pane',
		'maxi-blocks/slide-maxi': 'slide',
		'maxi-blocks/accordion-maxi': 'accordion',
		'maxi-blocks/slider-maxi': 'slider',
	};

	return (
		<ToolbarPopover
			className='toolbar-item__context-loop'
			tooltip={__('Context loop', 'maxi-blocks')}
			icon={toolbarDynamicContent}
		>
			<ContextLoop
				className='toolbar-item__context-loop__popover'
				contentType={contentTypes[blockName]}
				{...restProps}
			/>
		</ToolbarPopover>
	);
};

export default ContextLoopToolbar;
