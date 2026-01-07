/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import DynamicContent from '@components/dynamic-content';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarDynamicContent } from '@maxi-icons';

/**
 * Dynamic Content
 */

const ALLOWED_BLOCKS = [
	'maxi-blocks/text-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/divider-maxi',
];

const DC = props => {
	const { blockName, isList, ...restProps } = props;

	if (!ALLOWED_BLOCKS.includes(blockName) || isList) return null;

	const contentTypes = {
		'maxi-blocks/text-maxi': 'text',
		'maxi-blocks/button-maxi': 'button',
		'maxi-blocks/image-maxi': 'image',
		'maxi-blocks/divider-maxi': 'divider',
	};

	// Text block has Advanced tab at index 1, others at index 2 (due to Canvas tab)
	const advancedTab = blockName === 'maxi-blocks/text-maxi' ? 1 : 2;

	return (
		<ToolbarPopover
			className='toolbar-item__dynamic-content'
			tooltip={__('Dynamic Content', 'maxi-blocks')}
			icon={toolbarDynamicContent}
			advancedOptions='dynamic content'
			tab={advancedTab}
		>
			<DynamicContent
				className='toolbar-item__dynamic-content__popover toolbar-item__dynamic-content__popover'
				contentType={contentTypes[blockName]}
				blockName={blockName}
				{...restProps}
			/>
		</ToolbarPopover>
	);
};

export default DC;
