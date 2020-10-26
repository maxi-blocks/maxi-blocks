/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

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
			fullWidth,
			motion,
		},
	} = props;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-divider-block',
		blockStyle,
		extraClassName,
		uniqueID,
		className,
		fullWidth === 'full' ? 'alignfull' : null
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion={motion}
			data-motion-id={uniqueID}
		>
			<__experimentalBackgroundDisplayer background={background} />
			Hi This is the font-icon block
		</div>
	);
};

export default save;
