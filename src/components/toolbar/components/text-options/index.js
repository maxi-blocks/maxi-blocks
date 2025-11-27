/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import { openSidebarAccordion } from '@extensions/inspector';
import './editor.scss';

const ALLOWED_BLOCKS = ['maxi-blocks/text-maxi', 'maxi-blocks/list-item-maxi'];

/**
 * TextOptions
 */
const TextOptions = props => {
	const { blockName } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	return (
		<div className='toolbar-item toolbar-item__typography-control'>
			<Button
				className='toolbar-item toolbar-item__button'
				onClick={() => {
					// Open Typography accordion in the sidebar directly
					openSidebarAccordion(0, 'typography');
				}}
				action='popup'
			>
				{__('Edit', 'maxi-blocks')}
			</Button>
		</div>
	);
};

export default TextOptions;
