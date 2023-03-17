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
import { getAttributesValue } from '../../extensions/styles';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { linkSettings, buttonContent } = attributes;
	const { iconOnly, iconContent, iconPosition } = getAttributesValue({
		target: ['icon-only', 'icon-content', 'icon-position'],
		props: attributes,
	});

	const name = 'maxi-blocks/button-maxi';

	const linkOpt = !isNil(linkSettings) && linkSettings;

	const linkProps = {
		...linkOpt,
		href: linkOpt.url || '',
		target: linkOpt.opensInNewTab ? '_blank' : '_self',
	};

	const buttonClasses = classnames(
		'maxi-button-block__button',
		iconContent &&
			iconPosition === 'top' &&
			'maxi-button-block__button--icon-top',
		iconContent &&
			iconPosition === 'bottom' &&
			'maxi-button-block__button--icon-bottom',
		iconContent &&
			iconPosition === 'left' &&
			'maxi-button-block__button--icon-left',
		iconContent &&
			iconPosition === 'right' &&
			'maxi-button-block__button--icon-right'
	);

	return (
		<MaxiBlock.save {...getMaxiBlockAttributes({ ...props, name })}>
			<Button
				className={buttonClasses}
				{...(!isEmpty(linkProps.href) && linkProps)}
			>
				{!iconOnly && (
					<RichText.Content
						className='maxi-button-block__content'
						value={buttonContent}
						tagName='span'
					/>
				)}
				{iconContent && (
					<div className='maxi-button-block__icon'>
						<div>
							<RawHTML>{iconContent}</RawHTML>
						</div>
					</div>
				)}
			</Button>
		</MaxiBlock.save>
	);
};

export default save;
