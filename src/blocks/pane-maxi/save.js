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

	const { children, ...restInnerBlocksProps } = useInnerBlocksProps.save({
		className: 'maxi-pane-block__content',
	});

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			// https://github.com/yeahcan/maxi-blocks/issues/3555 sometimes causes validation error,
			// remove next line once it is fixed.
			className='wp-block-maxi-blocks-pane-maxi'
			aria-expanded={false}
		>
			<div className='maxi-pane-block__header'>
				<div className='maxi-pane-block__header-content'>
					<RichText.Content
						className='maxi-pane-block__title'
						value={title}
						tagName={titleLevel}
					/>
					<div className='maxi-pane-block__icon' />
				</div>
				<div className='maxi-pane-block__header-line-container maxi-pane-block__line-container'>
					<hr className='maxi-pane-block__header-line maxi-pane-block__line' />
				</div>
			</div>
			<div className='maxi-pane-block__content-wrapper'>
				<div {...restInnerBlocksProps}>
					{children}
					<div className='maxi-pane-block__content-line-container maxi-pane-block__line-container'>
						<hr className='maxi-pane-block__content-line maxi-pane-block__line' />
					</div>
				</div>
			</div>
		</MaxiBlock.save>
	);
};

export default save;
