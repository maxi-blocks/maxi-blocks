/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import {
	getMaxiBlockAttributes,
	MaxiBlock,
} from '@components/maxi-block';
/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';
import { RichText } from '@wordpress/block-editor';

const name = 'Button aria label';

const versions = [
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
	'0.0.1-SC5',
	'0.0.1-SC6',
	'1.0.0-RC1',
	'1.0.0-RC2',
];

const isEligible = blockAttributes =>
	versions.includes(blockAttributes['maxi-version-current']) ||
	!blockAttributes['maxi-version-origin'];

const save = props => {
	const {
		linkSettings,
		buttonContent,
		'icon-content': iconContent,
		'icon-position': iconPosition,
		'icon-only': iconOnly,
		'dc-status': dcStatus,
		'dc-link-status': dcLinkStatus,
	} = props.attributes;

	const name = 'maxi-blocks/button-maxi';

	const linkOpt = !isNil(linkSettings) && linkSettings;

	const linkProps = {
		...linkOpt,
		href: dcStatus && dcLinkStatus ? '$link-to-replace' : linkOpt.url ?? '',
		target: linkOpt.opensInNewTab ? '_blank' : '_self',
	};

	const buttonClasses = classnames(
		'maxi-button-block__button',
		iconContent && `maxi-button-block__button--icon-${iconPosition}`
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
						value={dcStatus ? '$text-to-replace' : buttonContent}
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

export default { save, isEligible, name };
