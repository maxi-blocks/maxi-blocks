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
const ClipPathRadiusPoint = props => {
	const {
		radius,
		color,
		onMouseOut,
		onChangeMoving,
		number,
		position,
	} = props;

	const tooltipText = sprintf(__('Radius: %s', 'maxi-blocks'), radius);

	const classes = classnames(
		'maxi-clip-path-button',
		'maxi-clip-path-button--radius',
		`maxi-clip-path-visual-editor-${number}`
	);

	return (
		<Fragment>
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
