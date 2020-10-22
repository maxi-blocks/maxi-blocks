/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { useState, Fragment } = wp.element;
const { Tooltip } = wp.components;

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import classnames from 'classnames';
import { round, isArray, isEmpty } from 'lodash';

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

const ClipPathSinglePoint = props => {
	const {
		top,
		left,
		color,
		isMoving,
		onChangeMoving,
		setOpposite,
		number,
		position,
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
					setOpposite(false);
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
						left: `${position[0] + left}%`,
						top: `${top}%`,
					}),
					...(number === 1 && {
						top: `${position[1] + top}%`,
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
			<span
				className={`maxi-clip-path-button maxi-clip-path-button--single maxi-clip-path-button--opposite maxi-clip-path-visual-editor-${number}`}
				onMouseDown={e => {
					e.preventDefault();
					setOpposite(true);
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
						// red
						left: `${
							(position[0] - 50) * 2 - (position[0] + left - 100)
						}%`,
						top: `${top}%`,
					}),
					...(number === 1 && {
						// Blue
						top: `${
							(position[1] - 50) * 2 - (position[1] + top - 100)
						}%`,
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
		</Fragment>
	);
};

const ClipPathDoublePoint = props => {
	const { handle, color, isMoving, onChangeMoving, number } = props;

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

const ClipPathVisualEditor = props => {
	const { clipPathOptions, colors, onChange, className } = props;

	const [isOpposite, changeIsOpposite] = useState(false);

	const classes = classnames('maxi-clip-path-visual-editor', className);

	const getClipPath = clipPathOptions => {
		let newContent = '';

		if (!isEmpty(clipPathOptions.content))
			switch (clipPathOptions.type) {
				case 'polygon':
					newContent = clipPathOptions.content.reduce((a, b) => {
						if (isArray(a))
							return `${a[0]}% ${a[1]}%, ${b[0]}% ${b[1]}%`;
						return `${a}, ${b[0]}% ${b[1]}%`;
					});
					break;
				case 'circle':
					newContent = `${clipPathOptions.content[0][0]}% at ${clipPathOptions.content[1][0]}% ${clipPathOptions.content[1][1]}%`;
					break;
				case 'ellipse':
					newContent = `${clipPathOptions.content[0]}% ${clipPathOptions.content[1]}% at ${clipPathOptions.content[2][0]}% ${clipPathOptions.content[2][1]}%`;
					break;
				case 'inset':
					newContent = `${clipPathOptions.content[0]}% ${clipPathOptions.content[1]}% ${clipPathOptions.content[2]}% ${clipPathOptions.content[3]}%`;
					break;
				default:
					return false;
			}

		const newCP = `${clipPathOptions.type}(${newContent})`;

		return newCP;
	};

	const [clipPath, changeClipPath] = useState(getClipPath(clipPathOptions));
	const [selectedItem, changeSelectedItem] = useState(null);
	const [isMoving, changeIsMoving] = useState(false);
	const [size, changeSize] = useState(null);

	const setAxisLimits = value => {
		if (value <= 0) return 0;
		if (value >= 100) return 100;

		return value;
	};

	return (
		<div
			ref={e => e && !size && changeSize(e.getBoundingClientRect())}
			className={classes}
			onMouseMove={e => {
				if (!isMoving) return;

				const {
					x: absXAxis,
					y: absYAxis,
					width: absWidth,
					height: absHeight,
				} = e.target.parentElement.getBoundingClientRect();
				const newTop = round(((e.clientX - absXAxis) / absWidth) * 100);
				const newLeft = round(
					((e.clientY - absYAxis) / absHeight) * 100
				);

				if (clipPathOptions.type === 'circle' && selectedItem === 0) {
					const posTop = clipPathOptions.content[1][1];
					const posLeft = clipPathOptions.content[1][0];

					clipPathOptions.content[selectedItem] = [
						Math.min(
							round(
								Math.sqrt(
									(newLeft - posLeft) ** 2 +
										(newTop - posTop) ** 2
								)
							),
							50
						),
					];
				} else if (
					clipPathOptions.type === 'ellipse' &&
					(selectedItem === 0 || selectedItem === 1)
				) {
					if (selectedItem === 0) {
						clipPathOptions.content[selectedItem] = [
							isOpposite
								? Math.abs(
										100 -
											setAxisLimits(newTop) -
											(100 -
												clipPathOptions.content[2][0])
								  )
								: setAxisLimits(newTop) -
								  clipPathOptions.content[2][0],
						];
					}
					if (selectedItem === 1) {
						clipPathOptions.content[selectedItem] = [
							isOpposite
								? Math.abs(
										100 -
											setAxisLimits(newLeft) -
											(100 -
												clipPathOptions.content[2][1])
								  )
								: setAxisLimits(newLeft) -
								  clipPathOptions.content[2][1],
						];
					}
				} else {
					clipPathOptions.content[selectedItem] = [
						setAxisLimits(newTop),
						setAxisLimits(newLeft),
					];
				}

				changeClipPath(getClipPath(clipPathOptions));
			}}
			onMouseUp={() => {
				changeIsMoving(false);
			}}
			style={{ ...(!!size && { height: size.width }) }}
		>
			{clipPathOptions.content.map((handle, i) => {
				if (clipPathOptions.type === 'circle' && i === 0)
					return (
						<ClipPathRadiusPoint
							radius={handle[0]}
							color={colors[i]}
							onChangeMoving={(isMoving, item) => {
								changeIsMoving(isMoving);
								changeSelectedItem(item);

								if (!isMoving) onChange(clipPath);
							}}
							number={i}
							position={clipPathOptions.content[i + 1]}
						/>
					);

				if (clipPathOptions.type === 'ellipse' && (i === 0 || i === 1))
					return (
						<ClipPathSinglePoint
							top={
								i === 1
									? handle[0]
									: clipPathOptions.content[2][1]
							}
							left={
								i === 0
									? handle[0]
									: clipPathOptions.content[2][0]
							}
							color={colors[i]}
							isMoving={isMoving}
							onChangeMoving={(isMoving, item) => {
								changeIsMoving(isMoving);
								changeSelectedItem(item);

								if (!isMoving) onChange(clipPath);
							}}
							number={i}
							position={clipPathOptions.content[2]}
							setOpposite={isOpposite => {
								changeIsOpposite(isOpposite);
							}}
						/>
					);

				return (
					<ClipPathDoublePoint
						handle={handle}
						color={colors[i]}
						isMoving={isMoving}
						onChangeMoving={(isMoving, item) => {
							changeIsMoving(isMoving);
							changeSelectedItem(item);

							if (!isMoving) onChange(clipPath);
						}}
						number={i}
					/>
				);
			})}
			<div
				className='maxi-clip-path-visual-editor__preview'
				style={{ clipPath }}
			/>
		</div>
	);
};

export default ClipPathVisualEditor;
