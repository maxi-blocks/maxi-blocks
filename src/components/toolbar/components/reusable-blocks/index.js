/* eslint-disable react-hooks/rules-of-hooks */
/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as reusableBlocksStore } from '@wordpress/reusable-blocks';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import TextControl from '@components/text-control';
import Dropdown from '@components/dropdown';

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
		useDispatch(reusableBlocksStore);

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
			contentClassName='maxi-more-settings__popover maxi-dropdown__child-content maxi-dropdown__reusable-content'
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
						label={__('Create reusable block', 'maxi-blocks')}
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
