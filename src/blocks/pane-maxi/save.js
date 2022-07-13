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
	const { title, titleLevel, accordionLayout } = attributes;
	const name = 'maxi-blocks/pane-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			className={`maxi-pane-block--${accordionLayout}-layout`}
			useInnerBlocks
			aria-expanded={false}
		>
			<div className='maxi-pane-block__header'>
				<RichText.Content
					className='maxi-pane-block__title'
					value={title}
					tagName={titleLevel}
				/>
				<div className='maxi-pane-block__icon' />
			</div>
		</MaxiBlock.save>
	);
};

export default save;
