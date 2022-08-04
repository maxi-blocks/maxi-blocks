/**
 * WordPress dependencies
 */
import { RichText, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getMaxiBlockAttributes, MaxiBlock } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { title, titleLevel } = attributes;
	const name = 'maxi-blocks/pane-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
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
			<div
				{...useInnerBlocksProps.save({
					className: 'maxi-pane-block__content',
				})}
			/>
		</MaxiBlock.save>
	);
};

export default save;
