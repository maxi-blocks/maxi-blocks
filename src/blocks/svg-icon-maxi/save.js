/**
 * WordPress dependencies
 */
const { RawHTML } = wp.element;

/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
	} = attributes;

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-svg-icon-block',
		blockStyle,
		!!attributes['background-highlight'] && 'maxi-highlight--background',
		!!attributes['border-highlight'] && 'maxi-highlight--border',
		!!attributes['color1-highlight'] && 'maxi-highlight--color1',
		!!attributes['color2-highlight'] && 'maxi-highlight--color2',
		extraClassName,
		uniqueID,
		className
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			id={uniqueID}
		>
			<RawHTML className='maxi-svg-icon-block__icon'>
				{attributes.content}
			</RawHTML>
			<BackgroundDisplayer
				{...getGroupAttributes(attributes, [
					'background',
					'backgroundColor',
					'backgroundHover',
					'backgroundColorHover',
				])}
				blockClassName={uniqueID}
			/>
		</div>
	);
};

export default save;
