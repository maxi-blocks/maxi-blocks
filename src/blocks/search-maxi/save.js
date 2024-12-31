/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import { RawHTML } from '@components';
import { getIconPositionClass } from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const {
		'icon-content': buttonIcon,
		buttonContent,
		buttonSkin,
		placeholder,
		skin,
		ariaLabels = {},
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

	const buttonIconClasses =
		'maxi-search-block__button__icon maxi-search-block__button__default-icon';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			classes={classes}
			aria-label={ariaLabels.block}
		>
			<input
				className={inputClasses}
				type='text'
				placeholder={placeholder}
				required
				aria-label={ariaLabels.input}
			/>
			<div
				className='maxi-search-block__button'
				aria-label={ariaLabels.button}
			>
				{searchButtonIsIcon ? (
					buttonIcon && (
						<div className={buttonIconClasses}>
							<RawHTML>{buttonIcon}</RawHTML>
						</div>
					)
				) : (
					<div className='maxi-search-block__button__content'>
						{buttonContent}
					</div>
				)}
			</div>
		</MaxiBlock.save>
	);
};

export default save;
