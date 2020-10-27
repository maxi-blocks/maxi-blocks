/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Tooltip } = wp.components;

/**
 * Component
 */
const ClipPathDoublePoint = props => {
	const {
		handle,
		color,
		isMoving,
		onMouseOut,
		onChangeMoving,
		number,
	} = props;

	const tooltipText = sprintf(
		__('Top: %1$s Left: %2$s', 'maxi-blocks'),
		handle[1],
		handle[0]
	);

	return (
		<span
			className={`maxi-clip-path-button maxi-clip-path-visual-editor-${number}`}
			onMouseDown={e => {
				e.preventDefault();
				onChangeMoving(true, number);
			}}
			onMouseOut={e => onMouseOut(e, () => onChangeMoving(false))}
			onMouseUp={() => {
				onChangeMoving(false);
			}}
			style={{
				top: `${handle[1]}%`,
				left: `${handle[0]}%`,
				backgroundColor: color,
			}}
		>
			{!isMoving && (
				<Tooltip text={tooltipText} position='bottom center'>
					<span className='maxi-clip-path-button__hidden-tooltip' />
				</Tooltip>
			)}
		</span>
	);
};

export default ClipPathDoublePoint;
