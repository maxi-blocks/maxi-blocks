/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment } = wp.element;
const { Tooltip } = wp.components;

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
		onMouseOut,
		onChangeMoving,
		setOpposite = null,
		number,
		position = [0, 0],
	} = props;

	const tooltipText =
		number === 0
			? sprintf(__('Top: %s', 'maxi-blocks'), top)
			: sprintf(__('Left: %s', 'maxi-blocks'), left);

	const classes = classnames(
		'maxi-clip-path-button',
		'maxi-clip-path-button--single',
		`maxi-clip-path-visual-editor-${number}`
	);

	return (
		<Fragment>
			<span
				className={classes}
				onMouseDown={e => {
					e.preventDefault();
					setOpposite && setOpposite(false);
					onChangeMoving(true, number);
				}}
				onMouseOut={e => onMouseOut(e, () => onChangeMoving(false))}
				onMouseUp={() => {
					onChangeMoving(false);
				}}
				style={{
					left: `${left}%`,
					top: `${top}%`,
					backgroundColor: color,
				}}
			>
				{!isMoving && (
					<Tooltip text={tooltipText} position='bottom center'>
						<span className='maxi-clip-path-button__hidden-tooltip' />
					</Tooltip>
				)}
			</span>
			{!!setOpposite && (
				<span
					className={`maxi-clip-path-button maxi-clip-path-button--single maxi-clip-path-button--opposite maxi-clip-path-visual-editor-${number}`}
					onMouseDown={e => {
						e.preventDefault();
						setOpposite && setOpposite(true);
						onChangeMoving(true, number);
					}}
					onMouseOut={e => onMouseOut(e, () => onChangeMoving(false))}
					onMouseUp={() => {
						onChangeMoving(false);
					}}
					style={{
						...(number === 0 && {
							left: `${(position[0] - 50) * 2 - (left - 100)}%`,
							top: `${top}%`,
						}),
						...(number === 1 && {
							top: `${(position[1] - 50) * 2 - (top - 100)}%`,
							left: `${left}%`,
						}),
						backgroundColor: color,
					}}
				>
					{!isMoving && (
						<Tooltip text={tooltipText} position='bottom center'>
							<span className='maxi-clip-path-button__hidden-tooltip' />
						</Tooltip>
					)}
				</span>
			)}
		</Fragment>
	);
};
export default ClipPathSinglePoint;
