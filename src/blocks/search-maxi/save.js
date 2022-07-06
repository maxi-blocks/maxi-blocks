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
		placeholder,
		searchButtonContent,
		'icon-content': searchButtonIcon,
		searchButtonSkin,
		skin,
	} = attributes;
	const searchButtonIsIcon = searchButtonSkin === 'icon';

	const name = 'maxi-blocks/search-maxi';

	const classes = classnames(
		'maxi-search-block',
		getIconPositionClass(attributes['icon-position'], 'maxi-search-block')
	);

	const inputClasses = classnames(
		'maxi-search-block__input',
		skin === 'icon-reveal' && 'maxi-search-block__input--hidden'
	);

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			{...extendedAttributes}
			classes={classes}
		>
			<RichText.Content
				className={inputClasses}
				placeholder={placeholder}
				tagName='input'
			/>
			<div className='maxi-search-block__button'>
				{searchButtonIsIcon ? (
					searchButtonIcon && (
						<div className='maxi-search-block__button__icon'>
							<RawHTML>{searchButtonIcon}</RawHTML>
						</div>
					)
				) : (
					<RichText.Content
						className='maxi-search-block__button__content'
						value={searchButtonContent}
					/>
				)}
			</div>
		</MaxiBlock.save>
	);
};

export default save;
