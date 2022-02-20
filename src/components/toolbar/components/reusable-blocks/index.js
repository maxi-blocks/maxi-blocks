/* eslint-disable react-hooks/rules-of-hooks */
/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import TextControl from '../../../text-control';
import Dropdown from '../../../dropdown';

/**
 * Styles
 */
import './editor.scss';

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
		<Dropdown
			className='maxi-reusableblocks__blocks-selector'
			contentClassName='maxi-dropdown__child-content maxi-dropdown__reusable-content'
			position='right top'
			renderToggle={({ isOpen, onToggle }) => (
				<Button onClick={onToggle} text='Copy'>
					{__('Add to reusable blocks', 'maxi-blocks')}
				</Button>
			)}
			renderContent={() => (
				<form
					onSubmit={e => {
						e.preventDefault();
						onConvert(title);
						setTitle('');
					}}
				>
					<TextControl
						placeholder={__('Reusable block name', 'maxi-blocks')}
						label={__('Create Reusable block', 'maxi-blocks')}
						value={title}
						onChange={setTitle}
					/>
					<Button type='submit'>{__('Save', 'maxi-blocks')}</Button>
				</form>
			)}
		/>
	);
};

export default ReusableBlocks;
