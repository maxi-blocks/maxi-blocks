/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Button } from '@components';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import getAreaLabel from './utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';
import { RichText } from '@wordpress/block-editor';

/**
 * Save
 */
const save = props => {
	const {
		linkSettings,
		buttonContent,
		'icon-content': iconContent,
		'icon-position': iconPosition,
		'icon-only': iconOnly,
		'dc-status': dcStatus,
		'dc-link-status': dcLinkStatus,
		'dc-field': dcField,
		ariaLabels = {},
	} = props.attributes;

	const name = 'maxi-blocks/button-maxi';

	const linkOpt = !isNil(linkSettings) && linkSettings;

	const linkProps = {
		...linkOpt,
		href: dcStatus && dcLinkStatus ? '$link-to-replace' : linkOpt.url ?? '',
		target: linkOpt.opensInNewTab ? '_blank' : '_self',
	};

	const relValues = [];
	if (linkOpt.noFollow) relValues.push('nofollow');
	if (linkOpt.sponsored) relValues.push('sponsored');
	if (linkOpt.ugc) relValues.push('ugc');

	if (relValues.length > 0) {
		linkProps.rel = relValues.join(' ');
	}

	const buttonClasses = classnames(
		'maxi-button-block__button',
		iconContent && `maxi-button-block__button--icon-${iconPosition}`
	);

	const showDCContent = dcStatus && dcField !== 'static_text';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={ariaLabels.canvas}
		>
			<Button
				className={buttonClasses}
				{...(iconOnly && { 'aria-label': getAreaLabel(iconContent) })}
				{...(!isEmpty(linkProps.href) && linkProps)}
				{...(ariaLabels.button && { 'aria-label': ariaLabels.button })}
			>
				{!iconOnly && (
					<RichText.Content
						className='maxi-button-block__content'
						value={
							showDCContent ? '$text-to-replace' : buttonContent
						}
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
