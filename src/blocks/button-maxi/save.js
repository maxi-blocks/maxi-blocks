/**
 * WordPress dependencies
 */
const { Button } = wp.components;

/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isNil } from 'lodash';

/**
 * Save
 */
const save = props => {
	const {
		attributes: {
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			highlight,
			background,
			linkSettings,
			content,
			extraClassName,
			motion,
			icon,
		},
		className,
	} = props;

	const iconValue = !isObject(icon) ? JSON.parse(icon) : icon;
	const highlightValue = !isObject(highlight)
		? JSON.parse(highlight)
		: highlight;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-button-extra',
		blockStyle,
		!!highlightValue.textHighlight && 'maxi-highlight--text',
		!!highlightValue.backgroundHighlight && 'maxi-highlight--background',
		!!highlightValue.borderHighlight && 'maxi-highlight--border',
		extraClassName,
		uniqueID,
		className,
		!isNil(uniqueID) ? uniqueID : null
	);

	const linkOpt = !isObject(linkSettings)
		? JSON.parse(linkSettings)
		: linkSettings;

	const linkProps = {
		href: linkOpt.url || '',
		target: linkOpt.opensInNewTab ? '_blank' : '_self',
	};

	const buttonClasses = classnames(
		'maxi-button-extra__button',
		iconValue.position === 'left'
			? 'maxi-button-extra__button--icon-left'
			: 'maxi-button-extra__button--icon-right'
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion={motion}
			data-motion-id={uniqueID}
		>
			<BackgroundDisplayer background={background} />
			<Button className={buttonClasses} {...linkProps}>
				{iconValue.icon && <i className={iconValue.icon} />}
				{content}
			</Button>
		</div>
	);
};

export default save;
