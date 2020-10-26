/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment } = wp.element;
const { Tooltip } = wp.components;

/**
 * Component
 */
const ClipPathRadiusPoint = props => {
	const { radius, color, onChangeMoving, number, position } = props;

	const tooltipText = sprintf(__('Radius: %s', 'maxi-blocks'), radius);

	return (
		<Fragment>
			<span
				className={`maxi-clip-path-button maxi-clip-path-button--radius maxi-clip-path-visual-editor-${number}`}
				onMouseDown={e => {
					e.preventDefault();
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
							)
						)
					)
						onChangeMoving(false);
				}}
				onMouseUp={() => {
					onChangeMoving(false);
				}}
				style={{
					top: `${position[1]}%`,
					left: `${position[0]}%`,
					width: `${radius * 2}%`,
					height: `${radius * 2}%`,
					borderColor: color,
				}}
			>
				<Tooltip text={tooltipText} position='bottom center'>
					<span className='maxi-clip-path-button__hidden-tooltip' />
				</Tooltip>
			</span>
			<span
				className='maxi-clip-path-button--radius__hidden'
				onMouseUp={() => {
					onChangeMoving(false);
				}}
				style={{
					top: `${position[1]}%`,
					left: `${position[0]}%`,
					width: `calc(${radius * 2}% - 1rem)`,
					height: `calc(${radius * 2}% - 1rem)`,
				}}
			/>
		</Fragment>
	);
};

export default ClipPathRadiusPoint;
