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
const ClipPathSinglePoint = props => {
	const {
		top,
		left,
		color,
		isMoving,
		addOppositePoint = false,
		number,
		position = [
			{ value: 0, unit: 'px' },
			{ value: 0, unit: 'px' },
		],
		onMouseOut,
		onChangeMoving,
	} = props;

	const tooltipText =
		number === 0
			? sprintf(__('Top: %s', 'maxi-blocks'), top) // translators: Top value of the clip path point
			: sprintf(__('Left: %s', 'maxi-blocks'), left); // translators: Left value of the clip path point

	const classes = classnames(
		'maxi-clip-path-button',
		'maxi-clip-path-button--single',
		`maxi-clip-path-visual-editor-${number}`
	);

	return (
		<>
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
					left,
					top,
					backgroundColor: color,
				}}
			>
				{!isMoving && (
					<Tooltip text={tooltipText} placement='top'>
						<span className='maxi-clip-path-button__hidden-tooltip' />
					</Tooltip>
				)}
			</span>
			{addOppositePoint && (
				<span
					className={`maxi-clip-path-button maxi-clip-path-button--single maxi-clip-path-button--opposite maxi-clip-path-visual-editor-${number}`}
					onMouseDown={e => {
						e.preventDefault();
						onChangeMoving(true, number);
					}}
					onMouseOut={e => onMouseOut(e, () => onChangeMoving(false))}
					onMouseUp={() => {
						onChangeMoving(false);
					}}
					style={{
						...(number === 0 && {
							left: `calc((${position[0].value}${position[0].unit} - 50%) * 2 - (${left} - 100%))`,
							top,
						}),
						...(number === 1 && {
							top: `calc((${position[1].value}${position[1].unit} - 50%) * 2 - (${top} - 100%))`,
							left,
						}),
						backgroundColor: color,
					}}
				>
					{!isMoving && (
						<Tooltip text={tooltipText} placement='top'>
							<span className='maxi-clip-path-button__hidden-tooltip' />
						</Tooltip>
					)}
				</span>
			)}
		</>
	);
};
export default ClipPathSinglePoint;
