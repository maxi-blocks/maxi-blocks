/**
 * WordPress dependencies
 */
import {
	forwardRef,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { withFallbackStyles } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ClipPathRadiusPoint from './radiusPoint';
import ClipPathSinglePoint from './singlePoint';
import ClipPathDoublePoint from './doublePoint';
import getClipPath from './getClipPath';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep, round } from 'lodash';

/**
 * Component
 */
const ClipPathVisualEditor = props => {
	const {
		visualEditorRef,
		getBounds,
		clipPathOptions,
		colors,
		onChange,
		className,
		wrapperHeight,
	} = props;

	const classes = classnames('maxi-clip-path-visual-editor', className);

	const transformValuesToBlockEditor = () => {
		const transformBlockValueToEditor = (value, unit, direction) => {
			if (unit === '%' || !visualEditorRef.current) {
				return value;
			}

			const { width: blockWidth, height: blockHeight } = getBounds();
			const blockSize = direction === 'x' ? blockWidth : blockHeight;

			const { width: editorWidth, height: editorHeight } =
				visualEditorRef.current.getBoundingClientRect();
			const editorSize = direction === 'x' ? editorWidth : editorHeight;

			return round((value * editorSize) / blockSize, 1);
		};

		const newClipPath = cloneDeep(clipPathOptions);
		Object.values(newClipPath.content).forEach((handles, handlesIndex) => {
			handles.forEach(({ value, unit }, index) => {
				const direction =
					(newClipPath.type === 'inset' && handlesIndex % 2 === 1) ||
					(handles.length === 1 && handlesIndex % 2 === 0) ||
					(handles.length !== 1 && index % 2 === 0)
						? 'x'
						: 'y';

				handles[index].value = transformBlockValueToEditor(
					value,
					unit,
					direction
				);
			});
		});

		return newClipPath;
	};

	const clipPathEditorOptions = useRef(transformValuesToBlockEditor());
	const [clipPath, changeClipPath] = useState(
		getClipPath(clipPathEditorOptions.current)
	);
	useLayoutEffect(() => {
		clipPathEditorOptions.current = transformValuesToBlockEditor();
		changeClipPath(getClipPath(clipPathEditorOptions.current));
	});

	const [selectedItem, changeSelectedItem] = useState(null);
	const [isMoving, changeIsMoving] = useState(false);

	const transformValue = (value, unit, direction, fromUnit = '%') => {
		const setAxisLimits = (value, unit, direction) => {
			const getAxisMaxLimits = (unit, direction) => {
				const { width: blockWidth, height: blockHeight } = getBounds();
				const absSize = direction === 'x' ? blockWidth : blockHeight;

				switch (unit) {
					case 'px':
						return absSize;
					case '%':
						return 100;
					default:
						return value;
				}
			};

			return Math.min(
				Math.max(value, 0),
				getAxisMaxLimits(unit, direction)
			);
		};

		const valueTransformation = () => {
			if (fromUnit === unit) {
				return value;
			}

			const getSize = direction => {
				const { width: blockWidth, height: blockHeight } = getBounds();

				switch (direction) {
					case 'x':
						return blockWidth;
					case 'y':
						return blockHeight;
					default:
						return Math.max(blockWidth, blockHeight);
				}
			};
			const absSize = getSize(direction);

			switch (unit) {
				case 'px':
					return (value * absSize) / 100;
				case '%':
					return (value * 100) / absSize;
				default:
					return value;
			}
		};

		return setAxisLimits(round(valueTransformation(), 1), unit, direction);
	};

	const onMouseMove = e => {
		const {
			x: absXAxis,
			y: absYAxis,
			width: absWidth,
			height: absHeight,
		} = visualEditorRef.current.getBoundingClientRect();

		const getValueByDirection = direction => {
			const client = e[`client${direction.toUpperCase()}`];
			const abs = direction === 'x' ? absXAxis : absYAxis;
			const absSize = direction === 'x' ? absWidth : absHeight;

			return round(((client - abs) / absSize) * 100, 1);
		};

		const newLeft = getValueByDirection('x');
		const newTop = getValueByDirection('y');

		if (clipPathOptions.type === 'circle' && selectedItem === 0) {
			const posTop = transformValue(
				clipPathOptions.content[1][1].value,
				'%',
				'y',
				clipPathOptions.content[1][1].unit
			);
			const posLeft = transformValue(
				clipPathOptions.content[1][0].value,
				'%',
				'x',
				clipPathOptions.content[1][0].unit
			);

			clipPathOptions.content[0][0].value = transformValue(
				Math.sqrt((newTop - posTop) ** 2 + (newLeft - posLeft) ** 2),
				clipPathOptions.content[0][0].unit,
				'xy'
			);
		} else if (
			clipPathOptions.type === 'ellipse' &&
			(selectedItem === 0 || selectedItem === 1)
		) {
			// TODO: ellipse y working weird
			if (selectedItem === 0) {
				clipPathOptions.content[0][0].value = transformValue(
					Math.abs(
						transformValue(
							clipPathOptions.content[2][0].value,
							'%',
							'x',
							clipPathOptions.content[2][0].unit
						) - newLeft
					),
					clipPathOptions.content[0][0].unit,
					'x'
				);
			}
			if (selectedItem === 1) {
				clipPathOptions.content[1][0].value = transformValue(
					Math.abs(
						transformValue(
							clipPathOptions.content[2][1].value,
							'%',
							'y',
							clipPathOptions.content[2][1].unit
						) - newTop
					),
					clipPathOptions.content[1][0].unit,
					'y'
				);
			}
		} else if (clipPathOptions.type === 'inset') {
			switch (selectedItem) {
				case 0:
					clipPathOptions.content[0][0].value = transformValue(
						newTop,
						clipPathOptions.content[0][0].unit,
						'y'
					);
					break;
				case 1:
					clipPathOptions.content[1][0].value = transformValue(
						100 - newLeft,
						clipPathOptions.content[1][0].unit,
						'x'
					);
					break;
				case 2:
					clipPathOptions.content[2][0].value = transformValue(
						100 - newTop,
						clipPathOptions.content[2][0].unit,
						'y'
					);
					break;
				case 3:
					clipPathOptions.content[3][0].value = transformValue(
						newLeft,
						clipPathOptions.content[3][0].unit,
						'x'
					);
					break;
				default:
					break;
			}
		} else {
			clipPathOptions.content[selectedItem] = [
				{
					value: transformValue(
						newLeft,
						clipPathOptions.content[selectedItem][0].unit,
						'x'
					),
					unit: clipPathOptions.content[selectedItem][0].unit,
				},
				{
					value: transformValue(
						newTop,
						clipPathOptions.content[selectedItem][1].unit,
						'y'
					),
					unit: clipPathOptions.content[selectedItem][1].unit,
				},
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
			ref={visualEditorRef}
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
			{Object.entries(clipPathEditorOptions.current.content).map(
				([key, handle]) => {
					const i = Number(key);

					if (
						clipPathEditorOptions.current.type === 'circle' &&
						i === 0
					)
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
								position={
									clipPathEditorOptions.current.content[i + 1]
								}
							/>
						);

					if (
						clipPathEditorOptions.current.type === 'ellipse' &&
						(i === 0 || i === 1)
					)
						return (
							<ClipPathSinglePoint
								key={`maxi-clip-path-button--${i}`}
								top={
									i === 1
										? `calc(${clipPathEditorOptions.current.content[2][1].value}${clipPathEditorOptions.current.content[2][1].unit} + ${handle[0].value}${handle[0].unit})`
										: `${clipPathEditorOptions.current.content[2][1].value}${clipPathEditorOptions.current.content[2][1].unit}`
								}
								left={
									i === 0
										? `calc(${clipPathEditorOptions.current.content[2][0].value}${clipPathEditorOptions.current.content[2][0].unit} + ${handle[0].value}${handle[0].unit})`
										: `${clipPathEditorOptions.current.content[2][0].value}${clipPathEditorOptions.current.content[2][0].unit}`
								}
								color={colors[i]}
								isMoving={isMoving}
								addOppositePoint
								onMouseOut={onMouseOut}
								onChangeMoving={(isMoving, item) => {
									changeIsMoving(isMoving);
									changeSelectedItem(item);

									if (!isMoving) onChange(clipPathOptions);
								}}
								number={i}
								position={
									clipPathEditorOptions.current.content[2]
								}
							/>
						);
					if (clipPathEditorOptions.current.type === 'inset') {
						const getInsetTop = num => {
							if (num === 0) {
								return `${handle[0].value}${handle[0].unit}`;
							}
							if (num === 2)
								return `calc(100% - ${handle[0].value}${handle[0].unit})`;

							return `calc((100% - ${clipPathEditorOptions.current.content[2][0].value}${clipPathEditorOptions.current.content[2][0].unit} + ${clipPathEditorOptions.current.content[0][0].value}${clipPathEditorOptions.current.content[0][0].unit}) / 2)`;
						};

						const getInsetLeft = num => {
							if (num === 1)
								return `calc(100% - ${handle[0].value}${handle[0].unit})`;
							if (num === 3)
								return `${handle[0].value}${handle[0].unit}`;

							return `calc((100% - ${clipPathEditorOptions.current.content[1][0].value}${clipPathEditorOptions.current.content[1][0].unit} + ${clipPathEditorOptions.current.content[3][0].value}${clipPathEditorOptions.current.content[3][0].unit}) / 2)`;
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
				}
			)}
			<div
				className='maxi-clip-path-visual-editor__preview'
				style={{ clipPath }}
			/>
		</div>
	);
};

const VisualEditorWithHOC = withFallbackStyles(node => {
	const visualEditorNode = node?.querySelector?.(
		'.maxi-clip-path-visual-editor'
	);
	return {
		// TODO something wit height, it's not representing a real one.
		wrapperHeight: visualEditorNode ? visualEditorNode.offsetHeight : 0,
	};
})(ClipPathVisualEditor);

export default forwardRef((props, ref) => (
	<VisualEditorWithHOC {...props} visualEditorRef={ref} />
));
