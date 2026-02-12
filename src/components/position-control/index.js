/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { FocalPointPicker } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import SelectControl from '@components/select-control';
import AxisControl from '@components/axis-control';
import withRTC from '@extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import { arrowIcon } from '@maxi-icons';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const PositionControl = props => {
	const {
		className,
		onChange,
		disablePosition = false,
		breakpoint = 'general',
		prefix = '',
		isHover = false,
		defaultAttributes,
	} = props;

	const [showAdvanced, setShowAdvanced] = useState(false);

	const classes = classnames('maxi-position-control', className);

	const minMaxSettings = {
		px: {
			min: -3000,
			max: 3000,
		},
		em: {
			min: -999,
			max: 999,
		},
		vw: {
			min: -999,
			max: 999,
		},
		'%': {
			min: -999,
			max: 999,
		},
	};

	const getCleanOptions = () => {
		return {
			[`${prefix}position-top-${breakpoint}`]: getDefaultAttribute(
				`${prefix}position-top-${breakpoint}`
			),
			[`${prefix}position-right-${breakpoint}`]: getDefaultAttribute(
				`${prefix}position-right-${breakpoint}`
			),
			[`${prefix}position-bottom-${breakpoint}`]: getDefaultAttribute(
				`${prefix}position-bottom-${breakpoint}`
			),
			[`${prefix}position-left-${breakpoint}`]: getDefaultAttribute(
				`${prefix}position-left-${breakpoint}`
			),
			[`${prefix}position-sync-${breakpoint}`]: getDefaultAttribute(
				`${prefix}position-sync-${breakpoint}`
			),
			[`${prefix}position-top-unit-${breakpoint}`]: getDefaultAttribute(
				`${prefix}position-top-unit-${breakpoint}`
			),
			[`${prefix}position-right-unit-${breakpoint}`]: getDefaultAttribute(
				`${prefix}position-right-unit-${breakpoint}`
			),
			[`${prefix}position-bottom-unit-${breakpoint}`]:
				getDefaultAttribute(
					`${prefix}position-bottom-unit-${breakpoint}`
				),
			[`${prefix}position-left-unit-${breakpoint}`]: getDefaultAttribute(
				`${prefix}position-left-unit-${breakpoint}`
			),
		};
	};

	// Helper to ensure FocalPointPicker receives valid 0-1 coordinates.
	// Uses the explicit unit to decide whether the value can be mapped.
	const normalizeCoordinate = (raw, unit) => {
		if (raw === null || raw === undefined || raw === '') return 0.5;

		const numericValue =
			typeof raw === 'number' ? raw : parseFloat(raw);

		if (!Number.isFinite(numericValue)) return 0.5;

		// Non-percentage units (px, em, vw) can't meaningfully map to 0-1
		if (unit && unit !== '%') return 0.5;

		// Values are stored as 0-100 percentages; convert to 0-1 for the picker
		return Math.max(0, Math.min(1, numericValue / 100));
	};

	// Reusable component for the position picker and advanced settings
	const PositionPickerSection = (
		<>
			<div
				className='maxi-position-control__focal-picker'
				style={{ position: 'relative' }}
			>
				<FocalPointPicker
					label={__('Layer placement', 'maxi-blocks')}
					value={{
						x: normalizeCoordinate(
							getLastBreakpointAttribute({
								target: `${prefix}position-left`,
								breakpoint,
								attributes: props,
							}),
							getLastBreakpointAttribute({
								target: `${prefix}position-left-unit`,
								breakpoint,
								attributes: props,
							})
						),
						y: normalizeCoordinate(
							getLastBreakpointAttribute({
								target: `${prefix}position-top`,
								breakpoint,
								attributes: props,
							}),
							getLastBreakpointAttribute({
								target: `${prefix}position-top-unit`,
								breakpoint,
								attributes: props,
							})
						),
					}}
					onChange={focalPoint => {
						onChange({
							[getAttributeKey('position-top', isHover, prefix, breakpoint)]:
								Math.round(focalPoint.y * 100),
							[getAttributeKey('position-top-unit', isHover, prefix, breakpoint)]:
								'%',
							[getAttributeKey('position-left', isHover, prefix, breakpoint)]:
								Math.round(focalPoint.x * 100),
							[getAttributeKey('position-left-unit', isHover, prefix, breakpoint)]:
								'%',
							[getAttributeKey('position-right', isHover, prefix, breakpoint)]:
								'',
							[getAttributeKey('position-bottom', isHover, prefix, breakpoint)]:
								'',
						});
					}}
				/>
			</div>
			<div className='maxi-position-control__advanced-toggle'>
				<Button onClick={() => setShowAdvanced(!showAdvanced)}>
					{__('More layer placement settings', 'maxi-blocks')}
					<span
						className={`maxi-position-control__toggle-arrow${
							showAdvanced ? '--expanded' : ''
						}`}
					>
						{arrowIcon}
					</span>
				</Button>
			</div>
			{showAdvanced && (
				<div className='maxi-position-control__advanced-options'>
					<AxisControl
						{...props}
						target='position'
						prefix={prefix}
						onChange={obj => onChange(obj)}
						breakpoint={breakpoint}
						minMaxSettings={minMaxSettings}
						optionType='string'
						enableAxisUnits
						allowedUnits={['px', 'em', 'vw', '%', '-']}
						isHover={isHover}
						defaultAttributes={defaultAttributes}
					/>
				</div>
			)}
		</>
	);

	return (
		<div className={classes}>
			{!disablePosition ? (
				<>
					<SelectControl
						__nextHasNoMarginBottom
						label={__('Position', 'maxi-blocks')}
						options={[
							{ label: 'Default', value: 'inherit' },
							{ label: 'Relative', value: 'relative' },
							{ label: 'Absolute', value: 'absolute' },
							{ label: 'Fixed', value: 'fixed' },
							{ label: 'Static', value: 'static' },
							{ label: 'Sticky', value: 'sticky' },
						]}
						value={
							getLastBreakpointAttribute({
								target: `${prefix}position`,
								breakpoint,
								attributes: props,
							}) || ''
						}
						defaultValue={getDefaultAttribute(
							getAttributeKey(
								'position',
								isHover,
								prefix,
								breakpoint
							)
						)}
						onReset={() =>
							onChange({
								[getAttributeKey(
									'position',
									isHover,
									prefix,
									breakpoint
								)]: getDefaultAttribute(
									getAttributeKey(
										'position',
										isHover,
										prefix,
										breakpoint
									)
								),
								isReset: true,
							})
						}
						newStyle
						onChange={val =>
							onChange({
								[`${prefix}position-${breakpoint}`]: val,
								...(isEmpty(val) && getCleanOptions()),
							})
						}
					/>
					{getLastBreakpointAttribute({
						target: `${prefix}position`,
						breakpoint,
						attributes: props,
					}) !== 'inherit' && PositionPickerSection}
				</>
			) : (
				PositionPickerSection
			)}
		</div>
	);
};

export default withRTC(PositionControl);
