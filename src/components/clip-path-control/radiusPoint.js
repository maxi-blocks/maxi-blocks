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
const ClipPathRadiusPoint = props => {
	const { radius, color, onMouseOut, onChangeMoving, number, position } =
		props;

	const tooltipText = sprintf(__('Radius: %s', 'maxi-blocks'), radius); // translators: Radius value of the clip path point

	const classes = classnames(
		'maxi-clip-path-button',
		'maxi-clip-path-button--radius',
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
					top: `${position[1].value}${position[1].unit}`,
					left: `${position[0].value}${position[0].unit}`,
					width: `${radius.value * 2}${radius.unit}`,
					height: `${radius.value * 2}${radius.unit}`,
					borderColor: color,
				}}
			>
				<Tooltip text={tooltipText} placement='top'>
					<span className='maxi-clip-path-button__hidden-tooltip' />
				</Tooltip>
			</span>
			<span
				className='maxi-clip-path-button--radius__hidden'
				onMouseUp={() => {
					onChangeMoving(false);
				}}
				style={{
					top: `${position[1].value}${position[1].unit}`,
					left: `${position[0].value}${position[0].unit}`,
					width: `calc(${radius.value * 2}${radius.unit} - 1rem)`,
					height: `calc(${radius.value * 2}${radius.unit} - 1rem)`,
				}}
			/>
		</>
	);
};

export default ClipPathRadiusPoint;
