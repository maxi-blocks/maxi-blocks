/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import DynamicContent from '../../../dynamic-content';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarDynamicContent } from '../../../../icons';

/**
 * Dynamic Content
 */

const ALLOWED_BLOCKS = [
	'maxi-blocks/text-maxi',
	'maxi-blocks/button-maxi',
	'maxi-blocks/image-maxi',
];

const DC = props => {
	const { blockName, ...restProps } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const contentTypes = {
		'maxi-blocks/text-maxi': 'text',
		'maxi-blocks/button-maxi': 'button',
		'maxi-blocks/image-maxi': 'image',
	};

	return (
		<ToolbarPopover
			className='toolbar-item__dynamic-content'
			tooltip={__('Dynamic Content', 'maxi-blocks')}
			icon={toolbarDynamicContent}
		>
			<DynamicContent
				className='toolbar-item__dynamic-content__popover toolbar-item__dynamic-content__popover'
				contentType={contentTypes[blockName]}
				{...restProps}
			/>
		</ToolbarPopover>
	);
};

export default DC;
