/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment } = wp.element;
const { Tooltip } = wp.components;

/**
 * Component
 */
const ClipPathSinglePoint = props => {
	const {
		top,
		left,
		color,
		isMoving,
		onChangeMoving,
		setOpposite = null,
		number,
		position = [0, 0],
	} = props;

	const tooltipText =
		number === 0
			? sprintf(__('Top: %s', 'maxi-blocks'), top)
			: sprintf(__('Left: %s', 'maxi-blocks'), left);

	return (
		<Fragment>
			<span
				className={`maxi-clip-path-button maxi-clip-path-button--single maxi-clip-path-visual-editor-${number}`}
				onMouseDown={e => {
					e.preventDefault();
					setOpposite && setOpposite(false);
					onChangeMoving(true, number);
				}}
				onMouseOut={e => {
					if (
						e.relatedTarget &&
						!(
							e.relatedTarget.classList.contains(
								'maxi-clip-path-button'
							) ||
							e.relatedTarget.classList.contains(
								'maxi-clip-path-button--radius__hidden'
							) ||
							e.relatedTarget.classList.contains(
								'maxi-clip-path-visual-editor'
							) ||
							e.relatedTarget.classList.contains(
								'maxi-clip-path-visual-editor__preview'
							) ||
							e.relatedTarget.parentElement.classList.contains(
								'components-popover__content'
							)
						)
					)
						onChangeMoving(false);
				}}
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
					onMouseOut={e => {
						if (
							e.relatedTarget &&
							!(
								e.relatedTarget.classList.contains(
									'maxi-clip-path-button'
								) ||
								e.relatedTarget.classList.contains(
									'maxi-clip-path-button--radius__hidden'
								) ||
								e.relatedTarget.classList.contains(
									'maxi-clip-path-visual-editor'
								) ||
								e.relatedTarget.classList.contains(
									'maxi-clip-path-visual-editor__preview'
								) ||
								e.relatedTarget.parentElement.classList.contains(
									'components-popover__content'
								)
							)
						)
							onChangeMoving(false);
					}}
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
