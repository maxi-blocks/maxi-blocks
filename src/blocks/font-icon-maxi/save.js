/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
			background,
			extraClassName,
			icon,
		},
	} = props;
	const highlight = { ...props.attributes.highlight };
	const { textHighlight, backgroundHighlight, borderHighlight } = highlight;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-font-icon-block',
		blockStyle,
		!!textHighlight && 'maxi-highlight--text',
		!!backgroundHighlight && 'maxi-highlight--background',
		!!borderHighlight && 'maxi-highlight--border',
		extraClassName,
		uniqueID,
		className
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion-id={uniqueID}
		>
			<BackgroundDisplayer background={background} />
			{icon.icon && (
				<span className='maxi-font-icon-block__icon'>
					<i className={icon.icon} />
				</span>
			)}
		</div>
	);
};

export default save;
