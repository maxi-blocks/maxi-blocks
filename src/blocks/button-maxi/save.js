/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Button } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';
import { RichText } from '@wordpress/block-editor';

/**
 * Save
 */
const save = (
	props,
	extendedWrapperAttributes = {},
	extendedAttributes = {}
) => {
	const { attributes } = props;
	const { linkSettings, buttonContent } = attributes;

	const name = 'maxi-blocks/button-maxi';

	const linkOpt = !isNil(linkSettings) && linkSettings;

	const linkProps = {
		...linkOpt,
		href: linkOpt.url || '',
		target: linkOpt.opensInNewTab ? '_blank' : '_self',
	};

	const buttonClasses = classnames(
		'maxi-button-block__button',
		attributes['icon-content'] &&
			attributes['icon-position'] === 'top' &&
			'maxi-button-block__button--icon-top',
		attributes['icon-content'] &&
			attributes['icon-position'] === 'bottom' &&
			'maxi-button-block__button--icon-bottom',
		attributes['icon-content'] &&
			attributes['icon-position'] === 'left' &&
			'maxi-button-block__button--icon-left',
		attributes['icon-content'] &&
			attributes['icon-position'] === 'right' &&
			'maxi-button-block__button--icon-right'
	);

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			{...extendedWrapperAttributes}
		>
			<Button
				className={buttonClasses}
				{...(!isEmpty(linkProps.href) && linkProps)}
				{...extendedAttributes}
			>
				{!attributes['icon-only'] && (
					<RichText.Content
						className='maxi-button-block__content'
						value={buttonContent}
						tagName='span'
					/>
				)}
				{attributes['icon-content'] && (
					<div className='maxi-button-block__icon'>
						<div>
							<RawHTML>{attributes['icon-content']}</RawHTML>
						</div>
					</div>
				)}
			</Button>
		</MaxiBlock.save>
	);
};

export default save;
