/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { RawHTML } from '../../components';
import { getIconPositionClass } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = (props, extendedAttributes = {}) => {
	const { attributes } = props;
	const {
		'icon-content': buttonIcon,
		buttonContent,
		buttonSkin,
		placeholder,
		skin,
	} = attributes;
	const searchButtonIsIcon = buttonSkin === 'icon';

	const name = 'maxi-blocks/search-maxi';

	const classes = classnames(
		'maxi-search-block',
		getIconPositionClass(attributes['icon-position'], 'maxi-search-block')
	);

	const inputClasses = classnames(
		'maxi-search-block__input',
		skin === 'icon-reveal' && 'maxi-search-block__input--hidden'
	);

	const buttonIconClasses = classnames(
		'maxi-search-block__button__icon',
		'maxi-search-block__button__default-icon'
	);

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			{...extendedAttributes}
			classes={classes}
		>
			<input
				className={inputClasses}
				placeholder={placeholder}
				required
			/>
			<div className='maxi-search-block__button'>
				{searchButtonIsIcon ? (
					buttonIcon && (
						<div className={buttonIconClasses}>
							<RawHTML>{buttonIcon}</RawHTML>
						</div>
					)
				) : (
					<div className='maxi-search-block__button__content'>
						<RichText.Content value={buttonContent} />
					</div>
				)}
			</div>
		</MaxiBlock.save>
	);
};

export default save;
