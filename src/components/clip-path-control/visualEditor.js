/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { useState } = wp.element;
const { Tooltip } = wp.components;

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import classnames from 'classnames';
import { round } from 'lodash';

/**
 * Component
 */
const ClipPathPoint = props => {
	const { handle, color, onChangeMoving, number } = props;

	const tooltipText = sprintf(
		__('Top: %1$s Left: %2$s', 'maxi-blocks'),
		handle[1],
		handle[0]
	);

	return (
		<Tooltip text={tooltipText} position='bottom center'>
			<span
				className={`maxi-clip-path-button maxi-clip-path-visual-editor-${number}`}
				draggable
				onMouseDown={e => {
					e.preventDefault();
					onChangeMoving(true, number);
				}}
				onMouseOut={e => {
					if (
						!(
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
					top: `${handle[1]}%`,
					left: `${handle[0]}%`,
					backgroundColor: color,
				}}
			/>
		</Tooltip>
	);
};

const ClipPathVisualEditor = props => {
	const { clipPathOptions, colors, onChange, className } = props;

	const classes = classnames('maxi-clip-path-visual-editor', className);

	const getClipPath = clipPathOptions => {
		let response = `${clipPathOptions.type}(`;
		clipPathOptions.content.forEach((option, i) => {
			response += `${i !== 0 ? ', ' : ''}${option[0]}% ${option[1]}%`;
		});
		response += ')';

		return response;
	};

	const [clipPath, changeClipPath] = useState(getClipPath(clipPathOptions));
	const [selectedItem, changeSelectedItem] = useState(null);
	const [isMoving, changeIsMoving] = useState(false);

	const setAxisLimits = value => {
		if (value <= 0) return 0;
		if (value >= 100) return 100;

		return value;
	};

	return (
		<div
			className={classes}
			onMouseMove={e => {
				if (isMoving) {
					const {
						x: absXAxis,
						y: absYAxis,
						width: absWidth,
						height: absHeight,
					} = e.target.parentElement.getBoundingClientRect();

					const newTop = round(
						((e.clientX - absXAxis) / absWidth) * 100
					);
					const newLeft = round(
						((e.clientY - absYAxis) / absHeight) * 100
					);
					clipPathOptions.content[selectedItem] = [
						setAxisLimits(newTop),
						setAxisLimits(newLeft),
					];

					changeClipPath(getClipPath(clipPathOptions));
				}
			}}
		>
			{clipPathOptions.content.map((handle, i) => (
				<ClipPathPoint
					handle={handle}
					color={colors[i]}
					onChangeMoving={(isMoving, item) => {
						changeIsMoving(isMoving);
						changeSelectedItem(item);

						if (!isMoving) onChange(clipPath);
					}}
					number={i}
				/>
			))}
			<div
				className='maxi-clip-path-visual-editor__preview'
				style={{ clipPath }}
			/>
		</div>
	);
};

export default ClipPathVisualEditor;
