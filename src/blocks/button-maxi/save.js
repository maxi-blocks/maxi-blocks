/**
 * WordPress dependencies
 */
const { Button } = wp.components;

/**
 * Internal dependencies
 */
import BackgroundDisplayer from '../../components/background-displayer/newBackgroundDisplayer';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isNil, isEmpty } from 'lodash';

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

	//const icon = { ...props.attributes.icon };

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-button-block',
		blockStyle,
		!!attributes['text-highlight'] && 'maxi-highlight--text',
		!!attributes['background-highlight'] && 'maxi-highlight--background',
		!!attributes['border-highlight'] && 'maxi-highlight--border',
		extraClassName,
		uniqueID,
		className,
		!isNil(uniqueID) ? uniqueID : null
	);

	// const linkOpt = !isObject(linkSettings)
	// 	? JSON.parse(linkSettings)
	// 	: linkSettings;

	const linkProps = {
		//href: linkOpt.url || '',
		//target: linkOpt.opensInNewTab ? '_blank' : '_self',
	};

	const buttonClasses = classnames(
		'maxi-button-block__button'
		//icon.position === 'left'
		//? 'maxi-button-block__button--icon-left'
		//: 'maxi-button-block__button--icon-right'
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion-id={uniqueID}
		>
			<BackgroundDisplayer
				{...getGroupAttributes(attributes, [
					'background',
					'backgroundColor',
					'backgroundGradient',
					'backgroundHover',
					'backgroundColorHover',
					'backgroundGradientHover',
				])}
				blockClassName={uniqueID}
			/>
			<Button className={buttonClasses} {...linkProps}>
				{!isEmpty(attributes['icon-name']) && (
					<i className={attributes['icon-name']} />
				)}
				{buttonContent}
			</Button>
		</div>
	);
};

export default save;
