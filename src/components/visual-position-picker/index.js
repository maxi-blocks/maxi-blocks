/**
 * WordPress dependencies
 */
import { useState, useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
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
	const [isDragging, setIsDragging] = useState(false);

	// Convert percentage to position object for onChange
	const handlePositionChange = useCallback(
		(xPercent, yPercent) => {
			if (onChange) {
				onChange({
					x: Math.round(xPercent),
					y: Math.round(yPercent),
				});
			}
		},
		[onChange]
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

	// Mouse event handlers
	const handleMouseDown = useCallback(
		e => {
			if (disabled) return;
			e.preventDefault();
			setIsDragging(true);

			const pos = getPositionFromEvent(e);
			if (pos && pointRef.current) {
				// Direct DOM update for instant feedback
				pointRef.current.style.left = `${pos.x}%`;
				pointRef.current.style.top = `${pos.y}%`;
				handlePositionChange(pos.x, pos.y);
			}
		},
		[disabled, getPositionFromEvent, handlePositionChange]
	);

	const handleMouseMove = useCallback(
		e => {
			if (disabled) return;

			const pos = getPositionFromEvent(e);
			if (pos && pointRef.current) {
				// Direct DOM update for instant feedback - bypasses React render
				pointRef.current.style.left = `${pos.x}%`;
				pointRef.current.style.top = `${pos.y}%`;
				handlePositionChange(pos.x, pos.y);
			}
		},
		[disabled, getPositionFromEvent, handlePositionChange]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	// Add global mouse listeners when dragging
	const handleMouseDownWrapper = useCallback(
		e => {
			handleMouseDown(e);

			const onMouseMove = ev => handleMouseMove(ev);
			const onMouseUp = () => {
				handleMouseUp();
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
			};

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		},
		[handleMouseDown, handleMouseMove, handleMouseUp]
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

