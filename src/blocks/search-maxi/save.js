/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { RawHTML } from '../../components';
import { getAttributesValue } from '../../extensions/attributes';
import { getIconPositionClass } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { buttonContent, buttonSkin, placeholder, skin } = attributes;
	const searchButtonIsIcon = buttonSkin === 'icon';
	const { 'icon-content': iconContent, 'icon-position': iconPosition } =
		getAttributesValue({
			target: ['icon-content', 'icon-position'],
			props: attributes,
		});

	const name = 'maxi-blocks/search-maxi';

	const classes = classnames(
		'maxi-search-block',
		getIconPositionClass(iconPosition, 'maxi-search-block')
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
		>
			<input
				className={inputClasses}
				type='text'
				placeholder={placeholder}
				required
			/>
			<div className='maxi-search-block__button'>
				{searchButtonIsIcon ? (
					iconContent && (
						<div className={buttonIconClasses}>
							<RawHTML>{iconContent}</RawHTML>
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
