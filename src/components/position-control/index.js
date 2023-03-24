/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AxisControl from '../axis-control';
import SelectControl from '../select-control';
import withRTC from '../../extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';

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
		return [
			'top',
			'right',
			'bottom',
			'left',
			'sync',
			'top-unit',
			'right-unit',
			'bottom-unit',
			'left-unit',
		].reduce((acc, key) => {
			const attrLabel = getAttributeKey(
				`position-${key}`,
				false,
				prefix,
				breakpoint
			);

			acc[attrLabel] = getDefaultAttribute(attrLabel);

			return acc;
		}, {});
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
						onChange={val =>
							onChange({
								[getAttributeKey(
									'position',
									false,
									prefix,
									breakpoint
								)]: val,
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
