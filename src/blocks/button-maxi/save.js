/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Button } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import getAreaLabel from './utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';
import { RichText } from '@wordpress/block-editor';
import { getAttributesValue } from '../../extensions/attributes';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { _bc: buttonContent } = attributes;
	const [
		linkSettings,
		iconOnly,
		iconContent,
		iconPosition,
		dcStatus,
		dcLinkStatus,
	] = getAttributesValue({
		target: ['_lse', 'i_on', 'i_c', 'i_pos', 'dc.s', 'dc_l.s'],
		props: attributes,
	});

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
				{...(iconOnly && { 'aria-label': getAreaLabel(iconContent) })}
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

export default save;
