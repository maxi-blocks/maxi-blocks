/**
 * WordPress dependencies
 */
const { useState } = wp.element;

/**
 * Internal dependencies
 */
import useDeepEffect from '../../extensions/hooks/useDeepEffect';
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
	const { clipPathOptions, colors, onChange, className } = props;

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
	const [isOpposite, changeIsOpposite] = useState(false);

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
		const newTop = round(((e.clientX - absXAxis) / absWidth) * 100);
		const newLeft = round(((e.clientY - absYAxis) / absHeight) * 100);

		if (clipPathOptions.type === 'circle' && selectedItem === 0) {
			const posTop = clipPathOptions.content[1][1];
			const posLeft = clipPathOptions.content[1][0];

			clipPathOptions.content[selectedItem] = [
				Math.min(
					round(
						Math.sqrt(
							(newLeft - posLeft) ** 2 + (newTop - posTop) ** 2
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
									(100 - clipPathOptions.content[2][0])
						  )
						: setAxisLimits(newTop) - clipPathOptions.content[2][0],
				];
			}
			if (selectedItem === 1) {
				clipPathOptions.content[selectedItem] = [
					isOpposite
						? Math.abs(
								100 -
									setAxisLimits(newLeft) -
									(100 - clipPathOptions.content[2][1])
						  )
						: setAxisLimits(newLeft) -
						  clipPathOptions.content[2][1],
				];
			}
		} else if (clipPathOptions.type === 'inset') {
			switch (selectedItem) {
				case 0:
					clipPathOptions.content[selectedItem] = [
						setAxisLimits(newLeft),
					];
					break;
				case 1:
					clipPathOptions.content[selectedItem] = [
						100 - setAxisLimits(newTop),
					];
					break;
				case 2:
					clipPathOptions.content[selectedItem] = [
						100 - setAxisLimits(newLeft),
					];
					break;
				case 3:
					clipPathOptions.content[selectedItem] = [
						setAxisLimits(newTop),
					];
					break;
				default:
					break;
			}
		} else {
			clipPathOptions.content[selectedItem] = [
				setAxisLimits(newTop),
				setAxisLimits(newLeft),
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
		)
			callback();
	};

	useDeepEffect(() => {
		changeClipPath(getClipPath(clipPathOptions));
	}, [clipPathOptions]);

	return (
		<div
			ref={e => e && !size && changeSize(e.offsetWidth)}
			className={classes}
			onMouseMove={e => {
				if (isMoving) onMouseMove(e);
			}}
			onMouseUp={() => changeIsMoving(false)}
			style={{ height: `${size}px` }}
		>
			{clipPathOptions.content.map((handle, i) => {
				if (clipPathOptions.type === 'circle' && i === 0)
					return (
						<ClipPathRadiusPoint
							radius={handle[0]}
							color={colors[i]}
							onMouseOut={onMouseOut}
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

								if (!isMoving) onChange(clipPath);
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
							top={getInsetTop(i)}
							left={getInsetLeft(i)}
							color={colors[i]}
							isMoving={isMoving}
							onMouseOut={onMouseOut}
							onChangeMoving={(isMoving, item) => {
								changeIsMoving(isMoving);
								changeSelectedItem(item);

								if (!isMoving) onChange(clipPath);
							}}
							number={i}
						/>
					);
				}

				return (
					<ClipPathDoublePoint
						handle={handle}
						color={colors[i]}
						isMoving={isMoving}
						onMouseOut={onMouseOut}
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
