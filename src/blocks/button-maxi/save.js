/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { getPaletteClasses } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { className, attributes } = props;
	const {
		uniqueID,
		blockStyle,
		extraClassName,
		linkSettings,
		buttonContent,
		parentBlockStyle,
	} = attributes;

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-button-block',
		blockStyle,
		getPaletteClasses(
			attributes,
			[
				'background',
				'background-hover',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
				'typography',
				'typography-hover',
				'icon',
			],
			'maxi-blocks/button-maxi',
			parentBlockStyle
		),
		extraClassName,
		uniqueID,
		className
	);

	const linkOpt = !isNil(linkSettings) && linkSettings;

	const linkProps = {
		...linkOpt,
		href: linkOpt.url || '',
		target: linkOpt.opensInNewTab ? '_blank' : '_self',
	};

	const buttonClasses = classnames(
		'maxi-button-block__button',
		attributes['icon-position'] === 'left' &&
			'maxi-button-block__button--icon-left',
		attributes['icon-position'] === 'right' &&
			'maxi-button-block__button--icon-right'
	);

	return (
		<div className={classes} id={uniqueID}>
			<Button
				className={buttonClasses}
				{...(!isEmpty(linkProps.href) && linkProps)}
			>
				{!isEmpty(attributes['icon-name']) && (
					<i className={attributes['icon-name']} />
				)}
				<span className='maxi-button-block__content'>
					{buttonContent}
				</span>
			</Button>
		</div>
	);
};

export default save;
