/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import { getMaxiBlockAttributes, MaxiBlock } from '@components/maxi-block';
import getAreaLabel from '@blocks/button-maxi/utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

// Constants
const NAME = 'Button Email Obfuscated';
const VERSIONS = new Set([
	'2.0.8',
	'2.0.7',
	'2.0.6',
	'2.0.5',
	'2.0.4',
	'2.0.3',
	'2.0.2',
	'2.0.1',
	'2.0.0',
]);

const isEligible = blockAttributes =>
	VERSIONS.has(blockAttributes['maxi-version-current']) ||
	!blockAttributes['maxi-version-origin'];

const migrate = attributes => {
	const { 'dc-link-target': dcLinkTarget } = attributes;

	if (dcLinkTarget !== 'author_email') {
		return attributes;
	}

	return {
		...attributes,
		'data-email-obfuscated': 'true',
	};
};

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
		'dc-sub-field': dcSubField,
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

	const showDCContent =
		dcStatus && dcField !== 'static_text' && dcSubField !== 'static_text';

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

export default { save, isEligible, migrate, name: NAME };
