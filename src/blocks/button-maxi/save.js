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
			motion,
			icon,
		},
		className,
	} = props;

	const iconValue = !isObject(icon) ? JSON.parse(icon) : icon;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-button-extra',
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

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion={motion}
			data-motion-id={uniqueID}
		>
			<__experimentalBackgroundDisplayer background={background} />
			<Button className='maxi-button-extra__button' {...linkProps}>
				{iconValue.icon && <i className={iconValue.icon} />}
				{content}
			</Button>
		</div>
	);
};

export default save;
