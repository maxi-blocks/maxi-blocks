/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getMaxiBlockAttributes, MaxiBlock } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { title, accordionLayout } = attributes;
	const name = 'maxi-blocks/pane-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
		>
			<>
				<div className='maxi-pane-block__header'>
					<RichText.Content
						className='maxi-pane-block__title'
						value={title}
						tagName='span'
					/>

					<div className='maxi-pane-block__icon' />
				</div>
				{accordionLayout === 'simple' && <hr />}
			</>
		</MaxiBlock.save>
	);
};

export default save;
