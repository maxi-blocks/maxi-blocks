/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { Button, Popover, SelectControl } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

// Custom close icon SVG
const CloseIcon = () => (
	<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
		<path fill="var(--maxi-primary-color)" d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.21 11.79a1 1 0 010 1.42 1 1 0 01-1.42 0L12 13.41l-1.79 1.8a1 1 0 01-1.42 0 1 1 0 010-1.42l1.8-1.79-1.8-1.79a1 1 0 011.42-1.42l1.79 1.8 1.79-1.8a1 1 0 011.42 1.42L13.41 12z"></path>
	</svg>
);

const units = ['px', '%', 'em', 'ch', 'rem', 'vw', 'vh', 'auto'];
const commonValues = ['auto', '0', '10', '40', '80'];

const SpacingPopover = ({ spacingValue, onChange, gridArea }) => {
	const buttonRef = useRef();
	const [isOpen, setIsOpen] = useState(false);
	const [startVal, setStartVal] = useState(null);

	const handleStart = useCallback(event => {
		setStartVal(event.clientY);
	}, []);

	useEffect(() => {
		const handleUpdate = event => {
			if (startVal === null) return;
			const snapshot = Math.trunc((event.clientY - startVal) / 50);
			const numericValue = parseInt(spacingValue?.value || '0', 10);
			if (Number.isNaN(numericValue)) return;
			onChange({
				...spacingValue,
				value: (numericValue - snapshot).toString(),
			});
		};

		const handleEnd = () => setStartVal(null);

		document.addEventListener('mousemove', handleUpdate);
		document.addEventListener('mouseup', handleEnd);
		return () => {
			document.removeEventListener('mousemove', handleUpdate);
			document.removeEventListener('mouseup', handleEnd);
		};
	}, [startVal, spacingValue, onChange]);

	const currentValue = spacingValue?.value ?? '0';
	const currentUnit = spacingValue?.unit || (currentValue === 'auto' ? '' : 'px');

	return (
		<div className='maxi-spacing-popover' style={{ gridArea }}>
			<Button
				ref={buttonRef}
				className='maxi-spacing-popover__trigger'
				onMouseDown={handleStart}
				onClick={() => setIsOpen(true)}
				aria-expanded={isOpen}
			>
				{currentValue || '0'}
				{currentValue !== 'auto' && currentUnit ? currentUnit : ''}
			</Button>
			{isOpen && (
				<Popover
					anchor={buttonRef.current}
					placement='bottom'
					onClose={() => setIsOpen(false)}
					className='maxi-spacing-popover__panel'
				>
					<div className='maxi-spacing-popover__header'>
						<div className='maxi-spacing-popover__label'>
							{gridArea.charAt(0).toUpperCase() + gridArea.slice(1)}
						</div>
						<div className='maxi-spacing-popover__inputs'>
							<input
								type='text'
								value={currentValue}
								onChange={event =>
									onChange({
										...spacingValue,
										value: event.target.value,
									})
								}
								className='maxi-spacing-popover__number'
							/>
							<SelectControl
								hideLabelFromVision
								label='Unit'
								className='maxi-spacing-popover__unit-select'
								value={currentUnit}
								onChange={newUnit =>
									onChange({
										...spacingValue,
										unit: newUnit,
									})
								}
								options={units.map(unit => ({
									label: unit,
									value: unit,
								}))}
							/>
						</div>
						<Button
							icon={<CloseIcon />}
							onClick={() => setIsOpen(false)}
							className='maxi-spacing-popover__close'
							label='Close'
							isSmall
						/>
					</div>
					<div className='maxi-spacing-popover__common-values'>
						{commonValues.map(val => (
							<Button
								key={val}
								onClick={() =>
									onChange({
										...spacingValue,
										value: val,
									})
								}
								className={classnames(
									'maxi-spacing-popover__common-value',
									val === currentValue && 'is-active'
								)}
							>
								{val === '0' ? '↻ 0' : val}
							</Button>
						))}
					</div>
				</Popover>
			)}
		</div>
	);
};

export default SpacingPopover;
