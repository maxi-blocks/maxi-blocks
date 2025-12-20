/**
 * WordPress dependencies
 */
import { useState, useRef, useCallback, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { throttle } from 'lodash';
import './editor.scss';

/**
 * VisualPositionPicker Component
 * A draggable box for visually setting position values (Top/Right/Bottom/Left)
 */
const VisualPositionPicker = ({
	className,
	label = __('Layer placement', 'maxi-blocks'),
	top = 50,
	left = 50,
	onChange,
	disabled = false,
}) => {
	const containerRef = useRef(null);
	const pointRef = useRef(null);
	const isDraggingRef = useRef(false);
	const cleanupRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);

	// Ref pattern ensures throttle doesn't recreate on every render if onChange changes
	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	const throttledOnChange = useMemo(
		() =>
			throttle(
				(x, y) => {
					if (onChangeRef.current) {
						onChangeRef.current({
							x: Math.round(x),
							y: Math.round(y),
						});
					}
				},
				50, // 50ms throttle for smooth updates
				{ leading: true, trailing: true }
			),
		[]
	);

	// Cleanup throttle on unmount
	useEffect(() => {
		return () => throttledOnChange.cancel();
	}, [throttledOnChange]);

	// Direct immediate update
	const handlePositionChange = useCallback(
		(xPercent, yPercent, isThrottled = false) => {
			if (isThrottled) {
				throttledOnChange(xPercent, yPercent);
			} else if (onChange) {
				throttledOnChange.cancel(); // Cancel pending throttles if immediate update happens
				onChange({
					x: Math.round(xPercent),
					y: Math.round(yPercent),
				});
			}
		},
		[onChange, throttledOnChange]
	);

	// Calculate position from mouse event
	const getPositionFromEvent = useCallback(
		e => {
			if (!containerRef.current) return null;

			const rect = containerRef.current.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 100;
			const y = ((e.clientY - rect.top) / rect.height) * 100;

			// Clamp values between 0 and 100
			return {
				x: Math.max(0, Math.min(100, x)),
				y: Math.max(0, Math.min(100, y)),
			};
		},
		[]
	);

	// Cleanup listeners on unmount
	useEffect(() => {
		return () => {
			if (cleanupRef.current) {
				cleanupRef.current();
			}
		};
	}, []);

	// Mouse event handlers
	const handleMouseMove = useCallback(
		e => {
			if (disabled || !isDraggingRef.current) return;

			const pos = getPositionFromEvent(e);
			if (pos && pointRef.current) {
				// Direct DOM update for instant visual feedback
				pointRef.current.style.left = `${pos.x}%`;
				pointRef.current.style.top = `${pos.y}%`;
				// Use throttled update for React state/attributes
				handlePositionChange(pos.x, pos.y, true);
			}
		},
		[disabled, getPositionFromEvent, handlePositionChange]
	);

	const handleMouseUp = useCallback(() => {
		isDraggingRef.current = false;
		setIsDragging(false);
		throttledOnChange.flush(); // Ensure final position is saved
	}, [throttledOnChange]);

	const handleMouseDown = useCallback(
		e => {
			if (disabled) return;
			e.preventDefault();
			
			isDraggingRef.current = true;
			setIsDragging(true);

			const pos = getPositionFromEvent(e);
			if (pos && pointRef.current) {
				// Direct DOM update
				pointRef.current.style.left = `${pos.x}%`;
				pointRef.current.style.top = `${pos.y}%`;
				// Immediate update on start
				handlePositionChange(pos.x, pos.y, false);
			}
		},
		[disabled, getPositionFromEvent, handlePositionChange]
	);

	const handleMouseDownWrapper = useCallback(
		e => {
			handleMouseDown(e);

			const onMouseMove = ev => handleMouseMove(ev);
			const onMouseUp = () => {
				handleMouseUp();
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
				cleanupRef.current = null;
			};

			cleanupRef.current = onMouseUp;
			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		},
		[handleMouseDown, handleMouseMove, handleMouseUp]
	);

	const handleKeyDown = useCallback(
		e => {
			if (disabled) return;
			const step = e.shiftKey ? 10 : 1;
			let newX = left,
				newY = top;

			switch (e.key) {
				case 'ArrowLeft':
					newX = Math.max(0, left - step);
					break;
				case 'ArrowRight':
					newX = Math.min(100, left + step);
					break;
				case 'ArrowUp':
					newY = Math.max(0, top - step);
					break;
				case 'ArrowDown':
					newY = Math.min(100, top + step);
					break;
				default:
					return;
			}
			e.preventDefault();
			// Immediate update for keys
			handlePositionChange(newX, newY, false);
		},
		[disabled, left, top, handlePositionChange]
	);

	const classes = classnames('maxi-visual-position-picker', className, {
		'maxi-visual-position-picker--dragging': isDragging,
		'maxi-visual-position-picker--disabled': disabled,
	});

	return (
		<div className={classes}>
			{label && (
				<label className='maxi-visual-position-picker__label'>
					{label}
				</label>
			)}
			<div
				ref={containerRef}
				className='maxi-visual-position-picker__container'
				onMouseDown={handleMouseDownWrapper}
				onKeyDown={handleKeyDown}
				role='button'
				tabIndex={disabled ? -1 : 0}
				aria-label={__('Drag to set position', 'maxi-blocks')}
			>
				{/* Grid lines */}
				<div className='maxi-visual-position-picker__grid'>
					<div className='maxi-visual-position-picker__grid-line maxi-visual-position-picker__grid-line--horizontal maxi-visual-position-picker__grid-line--33' />
					<div className='maxi-visual-position-picker__grid-line maxi-visual-position-picker__grid-line--horizontal maxi-visual-position-picker__grid-line--66' />
					<div className='maxi-visual-position-picker__grid-line maxi-visual-position-picker__grid-line--vertical maxi-visual-position-picker__grid-line--33' />
					<div className='maxi-visual-position-picker__grid-line maxi-visual-position-picker__grid-line--vertical maxi-visual-position-picker__grid-line--66' />
				</div>

				{/* Draggable point */}
				<div
					ref={pointRef}
					className='maxi-visual-position-picker__point'
					style={{
						left: `${left}%`,
						top: `${top}%`,
					}}
				/>
			</div>

			{/* Position values display */}
			<div className='maxi-visual-position-picker__values'>
				<span className='maxi-visual-position-picker__value'>
					X: {Math.round(left)}%
				</span>
				<span className='maxi-visual-position-picker__value'>
					Y: {Math.round(top)}%
				</span>
			</div>
		</div>
	);
};

export default VisualPositionPicker;

