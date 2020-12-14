/**
 * WordPress dependencies
 */
const { Button } = wp.components;

/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

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
			background,
			linkSettings,
			content,
			extraClassName,
			icon,
		},
		className,
	} = props;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-button-block',
		blockStyle,
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
		'maxi-button-block__button',
		icon.position === 'left'
			? 'maxi-button-block__button--icon-left'
			: 'maxi-button-block__button--icon-right'
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion-id={uniqueID}
		>
			<__experimentalBackgroundDisplayer background={background} />
			<Button className={buttonClasses} {...linkProps}>
				{icon.icon && <i className={icon.icon} />}
				{content}
			</Button>
		</div>
	);
};

export default save;
