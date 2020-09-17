/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

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
			fullWidth,
			background,
			extraClassName,
			hover,
			content,
		},
	} = props;

	const { settings: hoverSettings } = JSON.parse(hover);

	const classes = classnames(
		'maxi-block maxi-icon-block',
		blockStyle,
		extraClassName,
		uniqueID,
		className,
		fullWidth === 'full' ? 'alignfull' : null,
		!isNil(uniqueID) ? uniqueID : null
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-hover={JSON.stringify(hoverSettings)}
		>
			<__experimentalBackgroundDisplayer background={background} />
			<div className='maxi-icon-block__icon'>
				<div className='maxi-icon-block__icon_content'>{content}</div>
			</div>
		</div>
	);
};

export default save;
