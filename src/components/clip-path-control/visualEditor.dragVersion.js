/**
 * WordPress dependencies
 */
const { useState } = wp.element;

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
	const { handle, color, onChange, onSave, number } = props;

	const [xAxis, changeXAxis] = useState(handle[0]);
	const [yAxis, changeYAxis] = useState(handle[1]);

	const getPositionValue = value => {
		if (value <= 0) return 0;
		if (value >= 100) return 100;

		return value;
	};

	const getNewAxis = e => {
		const { offsetTop, offsetLeft, parentElement } = e.target;
		const {
			clientWidth: parentWidth,
			clientHeight: parentHeight,
		} = parentElement;

		const { layerX, layerY } = e.nativeEvent;

		const newTop = round(((offsetTop + layerY - 0.5) / parentHeight) * 100);
		const newLeft = round(
			((offsetLeft + layerX + 0.5) / parentWidth) * 100
		);

		return {
			newTop: getPositionValue(newTop),
			newLeft: getPositionValue(newLeft),
		};
	};

	return (
		<span
			className={`maxi-clip-path-button maxi-clip-path-visual-editor-${number}`}
			draggable
			onDragStart={e => {
				// Generates a hidden image on the drag effect
				const hiddenImage = e.target.cloneNode(true);
				hiddenImage.classList.add('drag-clone');
				hiddenImage.style.opacity = 0;
				hiddenImage.style.zIndex = -1;
				e.target.parentElement.appendChild(hiddenImage);
				// e.dataTransfer.setDragImage(hiddenImage, 0, 0);
			}}
			onDrag={e => {
				e.preventDefault();

				const { newTop, newLeft } = getNewAxis(e);
				if (yAxis !== newTop) changeYAxis(getPositionValue(newTop));
				if (xAxis !== newLeft) changeXAxis(getPositionValue(newLeft));

				onChange([xAxis, yAxis]);
			}}
			onDragEnd={e => {
				e.preventDefault();
				e.target.parentElement.querySelector('.drag-clone').remove();

				const { newTop, newLeft } = getNewAxis(e);
				if (yAxis !== newTop) changeYAxis(getPositionValue(newTop));
				if (xAxis !== newLeft) changeXAxis(getPositionValue(newLeft));

				onSave([xAxis, yAxis]);
			}}
			style={{
				top: `${yAxis}%`,
				left: `${xAxis}%`,
				backgroundColor: color,
			}}
		/>
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

	return (
		<div className={classes}>
			{clipPathOptions.content.map((handle, i) => (
				<ClipPathPoint
					handle={handle}
					color={colors[i]}
					onChange={newPosition => {
						clipPathOptions.content[i] = newPosition;
						changeClipPath(getClipPath(clipPathOptions));
					}}
					onSave={() => {
						onChange(clipPath);
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
