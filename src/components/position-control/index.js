/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
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

	const PositionAxisControl = (
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
					}) !== 'inherit' && PositionAxisControl}
				</>
			) : (
				PositionAxisControl
			)}
		</div>
	);
};

export default withRTC(PositionControl);
