/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import ToolbarPopover from '../toolbar-popover';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import TextControl from '../../../text-control';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarReusableBlock } from '../../../../icons';

/**
 * DividerAlignment
 */
const ReusableBlocks = props => {
	const { clientId } = props;

	const [title, setTitle] = useState('');

	const { __experimentalConvertBlocksToReusable: convertBlocksToReusable } =
		useDispatch('maxiBlocks/reusable-blocks');

	const onConvert = useCallback(
		async function (reusableBlockTitle) {
			try {
				await convertBlocksToReusable(clientId, reusableBlockTitle);
			} catch (error) {
				console.error(error.message);
			}
		},
		[clientId]
	);

	return (
		<ToolbarPopover
			className='toolbar-item__reusable-blocks'
			tooltip={__('Reusable Blocks', 'maxi-blocks')}
			icon={toolbarReusableBlock}
		>
			<div className='toolbar-item__reusable-blocks__popover'>
				<form
					onSubmit={e => {
						e.preventDefault();
						onConvert(title);
						setTitle('');
					}}
				>
					<TextControl
						label={__('Name', 'maxi-blocks')}
						value={title}
						onChange={setTitle}
					/>
					<Button type='submit'>{__('Save', 'maxi-blocks')}</Button>
				</form>
			</div>
		</ToolbarPopover>
	);
};

export default ReusableBlocks;
