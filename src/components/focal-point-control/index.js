/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FocalPointPicker } from '@wordpress/components';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ResetButton from '@components/reset-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

export const clampFocalPointValue = value => {
	const numericValue = typeof value === 'number' ? value : parseFloat(value);

	if (!Number.isFinite(numericValue)) return 0.5;

	return Math.max(0, Math.min(1, numericValue));
};

export const normalizeFocalPoint = value => ({
	x: clampFocalPointValue(value?.x),
	y: clampFocalPointValue(value?.y),
});

export const focalPointToPercent = value =>
	Math.round(clampFocalPointValue(value) * 100);

const percentToFocalPointValue = value => {
	if (value === '' || value === null || value === undefined) return null;

	const numericValue = typeof value === 'number' ? value : parseFloat(value);

	if (!Number.isFinite(numericValue)) return null;

	return clampFocalPointValue(numericValue / 100);
};

const FocalPointAxisControl = ({ axis, label, value, onChange, onReset }) => (
	<div className='maxi-focal-point-control__axis'>
		<AdvancedNumberControl
			className='maxi-focal-point-control__axis-input'
			label={label}
			value={focalPointToPercent(value)}
			min={0}
			max={100}
			step={1}
			disableRange
			disableReset
			onChangeValue={nextValue => {
				const nextAxisValue = percentToFocalPointValue(nextValue);

				if (nextAxisValue !== null) onChange(axis, nextAxisValue);
			}}
		/>
		<ResetButton
			className='maxi-focal-point-control__axis-reset'
			onReset={onReset}
		/>
	</div>
);

const FocalPointControl = ({
	className,
	label,
	url,
	value,
	onChange = () => {},
	onReset = () => {},
	onResetX,
	onResetY,
}) => {
	const normalizedValue = useMemo(() => normalizeFocalPoint(value), [value]);
	const [draftPoint, setDraftPoint] = useState(normalizedValue);

	useEffect(() => {
		setDraftPoint(normalizedValue);
	}, [normalizedValue]);

	const commitPoint = useCallback(
		nextPoint => {
			const normalizedPoint = normalizeFocalPoint(nextPoint);

			setDraftPoint(normalizedPoint);
			onChange(normalizedPoint);
		},
		[onChange]
	);

	const updateAxis = useCallback(
		(axis, axisValue) => {
			commitPoint({
				...draftPoint,
				[axis]: axisValue,
			});
		},
		[commitPoint, draftPoint]
	);

	const resetX = onResetX || onReset;
	const resetY = onResetY || onReset;

	return (
		<div className={classnames('maxi-focal-point-control', className)}>
			<FocalPointPicker
				className='maxi-focal-point-control__picker'
				label={label}
				url={url}
				value={draftPoint}
				onChange={commitPoint}
			/>
			<div className='maxi-focal-point-control__custom-controls'>
				<div className='maxi-focal-point-control__axis-controls'>
					<FocalPointAxisControl
						axis='x'
						label={__('Left', 'maxi-blocks')}
						value={draftPoint.x}
						onChange={updateAxis}
						onReset={resetX}
					/>
					<FocalPointAxisControl
						axis='y'
						label={__('Top', 'maxi-blocks')}
						value={draftPoint.y}
						onChange={updateAxis}
						onReset={resetY}
					/>
				</div>
			</div>
		</div>
	);
};

export default FocalPointControl;
