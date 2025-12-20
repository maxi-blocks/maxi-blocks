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

	// Helper to ensure FocalPointPicker receives valid 0-1 coordinates
	const normalizeCoordinate = raw => {
		if (raw === null || raw === undefined) return 0;
		if (typeof raw === 'number' && Number.isNaN(raw)) return 0;

		let val = raw;
		
		// Handle strings
		if (typeof raw === 'string') {
			val = raw.trim();
			// Explicit percentage
			if (val.endsWith('%')) {
				const parsed = parseFloat(val);
				if (!Number.isFinite(parsed)) return 0;
				return Math.max(0, Math.min(1, parsed / 100));
			}
			// Parse string to number for heuristic check
			val = parseFloat(val);
		}

		if (!Number.isFinite(val)) return 0;

		// Heuristic: if 0-1, assume normalized. Otherwise assume percent/pixel-like and divide by 100.
		// Note: This treats '1.5' as '1.5%' (0.015), and '50' as '50%' (0.5).
		if (val >= 0 && val <= 1) return val;
		
		return Math.max(0, Math.min(1, val / 100));
	};

	// Reusable component for the position picker and advanced settings
	const PositionPickerSection = (
		<>
			<div className='maxi-position-control__focal-picker'>
				<FocalPointPicker
					label={__('Layer placement', 'maxi-blocks')}
					value={{
						x: normalizeCoordinate(
							getLastBreakpointAttribute({
								target: `${prefix}position-left`,
								breakpoint,
								attributes: props,
							})
						),
						y: normalizeCoordinate(
							getLastBreakpointAttribute({
								target: `${prefix}position-top`,
								breakpoint,
								attributes: props,
							})
						),
					}}
					onChange={focalPoint => {
						onChange({
							[`${prefix}position-top-${breakpoint}`]: Math.round(
								focalPoint.y * 100
							),
							[`${prefix}position-top-unit-${breakpoint}`]: '%',
							[`${prefix}position-left-${breakpoint}`]: Math.round(
								focalPoint.x * 100
							),
							[`${prefix}position-left-unit-${breakpoint}`]: '%',
							[`${prefix}position-right-${breakpoint}`]: '',
							[`${prefix}position-bottom-${breakpoint}`]: '',
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
