/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Save
 */
const save = props => {
	const {
		className,
		attributes: {
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			isHighlightText,
			isHighlightBackground,
			isHighlightBorder,
			background,
			extraClassName,
			motion,
			icon,
		},
	} = props;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-font-icon-block',
		blockStyle,
		!!isHighlightText && 'maxi-highlight--text',
		!!isHighlightBackground && 'maxi-highlight--background',
		!!isHighlightBorder && 'maxi-highlight--border',
		extraClassName,
		uniqueID,
		className
	);

	const iconValue = !isObject(icon) ? JSON.parse(icon) : icon;

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion={motion}
			data-motion-id={uniqueID}
		>
			<BackgroundDisplayer background={background} />
			{iconValue.icon && (
				<span className='maxi-font-icon-block__icon'>
					<i className={iconValue.icon} />
				</span>
			)}
		</div>
	);
};

export default save;
