/**
 * WordPress dependencies
 */
import { RichText, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getMaxiBlockAttributes, MaxiBlock } from '../../components/maxi-block';
import { WithLink } from '../../extensions/save/utils';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { title, titleLevel, accordionUniqueId, linkSettings, styleID } =
		attributes;
	const name = 'maxi-blocks/pane-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			// https://github.com/yeahcan/maxi-blocks/issues/3555 sometimes causes validation error,
			// remove next line once it is fixed.
			className='wp-block-maxi-blocks-pane-maxi'
			data-accordion={accordionUniqueId}
			aria-expanded={false}
			data-maxi-style-id={styleID}
		>
			<div className='maxi-pane-block__header'>
				<div className='maxi-pane-block__header-content'>
					<WithLink linkSettings={linkSettings}>
						<RichText.Content
							className='maxi-pane-block__title'
							value={title}
							tagName={titleLevel}
						/>
					</WithLink>
					<div className='maxi-pane-block__icon' />
				</div>
				<div className='maxi-pane-block__header-line-container maxi-pane-block__line-container'>
					<hr className='maxi-pane-block__header-line maxi-pane-block__line' />
				</div>
			</div>
			<div className='maxi-pane-block__content-wrapper'>
				<div
					{...useInnerBlocksProps.save({
						className: 'maxi-pane-block__content',
					})}
				/>
			</div>
			<div className='maxi-pane-block__content-line-container maxi-pane-block__line-container'>
				<hr className='maxi-pane-block__content-line maxi-pane-block__line' />
			</div>
		</MaxiBlock.save>
	);
};

export default save;
