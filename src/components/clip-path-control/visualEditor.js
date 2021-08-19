/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { withFallbackStyles } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ClipPathRadiusPoint from './radiusPoint';
import ClipPathSinglePoint from './singlePoint';
import ClipPathDoublePoint from './doublePoint';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { round, isArray, isEmpty } from 'lodash';

/**
 * Component
 */
const ClipPathVisualEditor = props => {
	const { clipPathOptions, colors, onChange, className, wrapperHeight } =
		props;

	const classes = classnames('maxi-clip-path-visual-editor', className);

	const getClipPath = clipPathOptions => {
		const { type, content } = clipPathOptions;

		let newContent = '';

		if (!isEmpty(content)) {
			const arrayContent = Object.values(content);

			switch (type) {
				case 'polygon':
					newContent = arrayContent.reduce((a, b) => {
						if (isArray(a))
							return `${a[0]}% ${a[1]}%, ${b[0]}% ${b[1]}%`;
						return `${a}, ${b[0]}% ${b[1]}%`;
					});
					break;
				case 'circle':
					newContent = `${arrayContent[0][0]}% at ${arrayContent[1][0]}% ${arrayContent[1][1]}%`;
					break;
				case 'ellipse':
					newContent = `${arrayContent[0]}% ${arrayContent[1]}% at ${arrayContent[2][0]}% ${arrayContent[2][1]}%`;
					break;
				case 'inset':
					newContent = `${arrayContent[0]}% ${arrayContent[1]}% ${arrayContent[2]}% ${arrayContent[3]}%`;
					break;
				default:
					return false;
			}
		}

		const newCP = `${type}(${newContent})`;

		return newCP;
	};

	const [clipPath, changeClipPath] = useState(getClipPath(clipPathOptions));
	const [selectedItem, changeSelectedItem] = useState(null);
	const [isMoving, changeIsMoving] = useState(false);
	const [isOpposite, changeIsOpposite] = useState(false);

	useEffect(() => {
		changeClipPath(getClipPath(clipPathOptions));
	});

	const setAxisLimits = value => {
		if (value <= 0) return 0;
		if (value >= 100) return 100;

		return value;
	};

	const onMouseMove = e => {
		const {
			x: absXAxis,
			y: absYAxis,
			width: absWidth,
			height: absHeight,
		} = e.target.parentElement.getBoundingClientRect();
		const newTop = round(((e.clientY - absYAxis) / absHeight) * 100);
		const newLeft = round(((e.clientX - absXAxis) / absWidth) * 100);

		if (clipPathOptions.type === 'circle' && selectedItem === 0) {
			const posTop = clipPathOptions.content[1][1];
			const posLeft = clipPathOptions.content[1][0];

			clipPathOptions.content[0] = [
				Math.min(
					round(
						Math.sqrt(
							(newTop - posTop) ** 2 + (newLeft - posLeft) ** 2
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
				clipPathOptions.content[0] = [
					isOpposite
						? Math.abs(
								100 -
									setAxisLimits(newLeft) -
									(100 - clipPathOptions.content[2][0])
						  )
						: setAxisLimits(newLeft) -
						  clipPathOptions.content[2][0],
				];
			}
			if (selectedItem === 1) {
				clipPathOptions.content[1] = [
					isOpposite
						? Math.abs(
								100 -
									setAxisLimits(newTop) -
									(100 - clipPathOptions.content[2][1])
						  )
						: setAxisLimits(newTop) - clipPathOptions.content[2][1],
				];
			}
		} else if (clipPathOptions.type === 'inset') {
			switch (selectedItem) {
				case 0:
					clipPathOptions.content[0] = [setAxisLimits(newTop)];
					break;
				case 1:
					clipPathOptions.content[1] = [100 - setAxisLimits(newLeft)];
					break;
				case 2:
					clipPathOptions.content[2] = [100 - setAxisLimits(newTop)];
					break;
				case 3:
					clipPathOptions.content[3] = [setAxisLimits(newLeft)];
					break;
				default:
					break;
			}
		} else {
			clipPathOptions.content[selectedItem] = [
				setAxisLimits(newLeft),
				setAxisLimits(newTop),
			];
		}

		changeClipPath(getClipPath(clipPathOptions));
	};

	const onMouseOut = (e, callback) => {
		if (
			e.relatedTarget &&
			!(
				e.relatedTarget.classList.contains('maxi-clip-path-button') ||
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
		) {
			callback();
			onChange(clipPathOptions);
		}
	};

	return (
		<div
			className={classes}
			onMouseMove={e => {
				if (isMoving) onMouseMove(e);
			}}
			onMouseUp={() => {
				changeIsMoving(false);
				onChange(clipPathOptions);
			}}
			style={{ height: `${wrapperHeight}px` }}
		>
			{Object.entries(clipPathOptions.content).map(([key, handle]) => {
				const i = Number(key);

				if (clipPathOptions.type === 'circle' && i === 0)
					return (
						<ClipPathRadiusPoint
							key={`maxi-clip-path-button--radius--${i}`}
							radius={handle[0]}
							color={colors[i]}
							onMouseOut={onMouseOut}
							onChangeMoving={(isMoving, item) => {
								changeIsMoving(isMoving);
								changeSelectedItem(item);

								if (!isMoving) onChange(clipPathOptions);
							}}
							number={i}
							position={clipPathOptions.content[i + 1]}
						/>
					);

				if (clipPathOptions.type === 'ellipse' && (i === 0 || i === 1))
					return (
						<ClipPathSinglePoint
							key={`maxi-clip-path-button--single--${i}`}
							top={
								i === 1
									? clipPathOptions.content[2][1] + handle[0]
									: clipPathOptions.content[2][1]
							}
							left={
								i === 0
									? clipPathOptions.content[2][0] + handle[0]
									: clipPathOptions.content[2][0]
							}
							color={colors[i]}
							isMoving={isMoving}
							onMouseOut={onMouseOut}
							onChangeMoving={(isMoving, item) => {
								changeIsMoving(isMoving);
								changeSelectedItem(item);

								if (!isMoving) onChange(clipPathOptions);
							}}
							number={i}
							position={clipPathOptions.content[2]}
							setOpposite={isOpposite => {
								changeIsOpposite(isOpposite);
							}}
						/>
					);
				if (clipPathOptions.type === 'inset') {
					const getInsetTop = num => {
						if (num === 0) return handle[0];
						if (num === 2) return 100 - handle[0];

						return (
							Math.abs(
								clipPathOptions.content[2][0] +
									clipPathOptions.content[0][0] -
									100
							) /
								2 +
							clipPathOptions.content[0][0]
						);
					};

					const getInsetLeft = num => {
						if (num === 1) return 100 - handle[0];
						if (num === 3) return handle[0];

						return (
							Math.abs(
								clipPathOptions.content[1][0] +
									clipPathOptions.content[3][0] -
									100
							) /
								2 +
							clipPathOptions.content[3][0]
						);
					};

					return (
						<ClipPathSinglePoint
							key={`maxi-clip-path-button--single--${i}`}
							top={getInsetTop(i)}
							left={getInsetLeft(i)}
							color={colors[i]}
							isMoving={isMoving}
							onMouseOut={onMouseOut}
							onChangeMoving={(isMoving, item) => {
								changeIsMoving(isMoving);
								changeSelectedItem(item);

								if (!isMoving) onChange(clipPathOptions);
							}}
							number={i}
						/>
					);
				}

				return (
					<ClipPathDoublePoint
						key={`maxi-clip-path-button--double--${i}`}
						handle={handle}
						color={colors[i]}
						isMoving={isMoving}
						onMouseOut={onMouseOut}
						onChangeMoving={(isMoving, item) => {
							changeIsMoving(isMoving);
							changeSelectedItem(item);

							if (!isMoving) onChange(clipPathOptions);
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

export default withFallbackStyles(node => {
	const visualEditorNode = node.querySelector(
		'.maxi-clip-path-visual-editor'
	);
	return {
		wrapperHeight: visualEditorNode.offsetHeight,
	};
})(ClipPathVisualEditor);
