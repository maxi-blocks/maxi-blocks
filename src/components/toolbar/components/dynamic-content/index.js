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

const DC = props => {
	const { blockName, ...restProps } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__dynamic-content'
			tooltip={__('Dynamic Content', 'maxi-blocks')}
			icon={toolbarDynamicContent}
		>
			<DynamicContent
				className='toolbar-item__dynamic-content__popover toolbar-item__dynamic-content__popover'
				{...restProps}
			/>
		</ToolbarPopover>
	);
};

export default DC;
