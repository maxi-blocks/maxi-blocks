/**
 * WordPress dependencies
 */
import { RichText, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getMaxiBlockAttributes, MaxiBlock } from '@components/maxi-block';
import { WithLink } from '@extensions/save/utils';
import { getGroupAttributes } from '@extensions/styles';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const {
		title,
		titleLevel,
		accordionUniqueId,
		linkSettings,
		ariaLabels = {},
	} = attributes;
	const dynamicContent = getGroupAttributes(attributes, 'dynamicContent');

	const name = 'maxi-blocks/pane-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			// https://github.com/yeahcan/maxi-blocks/issues/3555 sometimes causes validation error,
			// remove next line once it is fixed.
			className='wp-block-maxi-blocks-pane-maxi'
			data-accordion={accordionUniqueId}
			aria-expanded={false}
			aria-label={ariaLabels.pane}
		>
			<div
				className='maxi-pane-block__header'
				aria-label={ariaLabels.header}
			>
				<div className='maxi-pane-block__header-content'>
					<WithLink
						linkSettings={linkSettings ?? {}}
						dynamicContent={dynamicContent}
					>
						<RichText.Content
							className='maxi-pane-block__title'
							value={title}
							tagName={titleLevel}
						/>
					</WithLink>
					<div
						className='maxi-pane-block__icon'
						aria-label={ariaLabels.icon}
					/>
				</div>
				<div className='maxi-pane-block__header-line-container maxi-pane-block__line-container'>
					<hr className='maxi-pane-block__header-line maxi-pane-block__line' />
				</div>
			</div>
			<div className='maxi-pane-block__content-wrapper'>
				<div
					{...useInnerBlocksProps.save({
						className: 'maxi-pane-block__content',
						'aria-label': ariaLabels.content,
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
