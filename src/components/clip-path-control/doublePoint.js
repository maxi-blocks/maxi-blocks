/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ClipPathDoublePoint = props => {
	const { handle, color, isMoving, onMouseOut, onChangeMoving, number } =
		props;

	const tooltipText = sprintf(
		__('Top: %1$s Left: %2$s', 'maxi-blocks'), // translators: Top and left values of the clip path point
		handle[1],
		handle[0]
	);

	const classes = classnames(
		'maxi-clip-path-button',
		`maxi-clip-path-visual-editor-${number}`
	);

	return (
		<span
			className={classes}
			onMouseDown={e => {
				e.preventDefault();
				onChangeMoving(true, number);
			}}
			onMouseOut={e => onMouseOut(e, () => onChangeMoving(false))}
			onMouseUp={() => {
				onChangeMoving(false);
			}}
			style={{
				top: `${handle[1].value}${handle[1].unit}`,
				left: `${handle[0].value}${handle[0].unit}`,
				backgroundColor: color,
			}}
		>
			{!isMoving && (
				<Tooltip text={tooltipText} placement='top'>
					<span className='maxi-clip-path-button__hidden-tooltip' />
				</Tooltip>
			)}
		</span>
	);
};

export default ClipPathDoublePoint;
