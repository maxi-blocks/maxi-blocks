/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

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
		defaultBlockStyle,
		extraClassName,
		linkSettings,
		buttonContent,
	} = attributes;

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-button-block',
		blockStyle,
		!!attributes['text-highlight'] && 'maxi-highlight--text',
		!!attributes['background-highlight'] && 'maxi-highlight--background',
		!!attributes['border-highlight'] && 'maxi-highlight--border',
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
			<Button className={buttonClasses} {...linkProps}>
				{!isEmpty(attributes['icon-name']) && (
					<i className={attributes['icon-name']} />
				)}
				<div className='maxi-button-block__content'>
					{buttonContent}
				</div>
			</Button>
		</div>
	);
};

export default save;
