/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';
import FancyRadioControl from '../fancy-radio-control';
import RangeSliderControl from '../range-slider-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Component
 */
const ArrowControl = props => {
	const {
		className,
		onChange,
		isFullWidth,
		breakpoint = 'general',
		isFirstOnHierarchy,
	} = props;

	const classes = classnames('maxi-arrow-control', className);

	const getOptions = () => {
		let response = [
			{ label: __('Top', 'maxi-blocks'), value: 'top' },
			{ label: __('Bottom', 'maxi-blocks'), value: 'bottom' },
		];

		if (!isFirstOnHierarchy || isFullWidth === 'normal')
			response = response.concat([
				{ label: __('Right', 'maxi-blocks'), value: 'right' },
				{ label: __('Left', 'maxi-blocks'), value: 'left' },
			]);

		return response;
	};

	const onChangeValue = (target, value) => {
		onChange({ [`${target}-${breakpoint}`]: value });
	};

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 999,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	return (
		<div className={classes}>
			{
				<FancyRadioControl
					label={__('Show Arrow', 'maxi-blocks')}
					selected={props['arrow-status']}
					options={[
						{ label: __('Yes', 'maxi-blocks'), value: 1 },
						{ label: __('No', 'maxi-blocks'), value: 0 },
					]}
					onChange={val => onChange({ 'arrow-status': val })}
				/>
			}
			{props['arrow-status'] && (
				<>
					<FancyRadioControl
						label=''
						selected={getLastBreakpointAttribute(
							'arrow-side',
							breakpoint,
							props
						)}
						options={getOptions()}
						optionType='string'
						onChange={val =>
							onChange({ [`arrow-side-${breakpoint}`]: val })
						}
					/>
					<RangeSliderControl
						label={__('Position', 'maxi-blocks')}
						value={getLastBreakpointAttribute(
							'arrow-position',
							breakpoint,
							props
						)}
						defaultValue={getDefaultAttribute(
							`arrow-position-${breakpoint}`
						)}
						min={0}
						max={100}
						onChange={val => {
							onChangeValue('arrow-position', val);
						}}
						allowReset
						initialPosition={getDefaultAttribute(
							`arrow-position-${breakpoint}`
						)}
					/>
					<SizeControl
						label={__('Arrow Size', 'maxi-blocks')}
						disableUnit
						value={getLastBreakpointAttribute(
							'arrow-width',
							breakpoint,
							props
						)}
						onChangeValue={val => {
							const value = isNil(val)
								? getDefaultAttribute(
										`arrow-width-${breakpoint}`
								  )
								: val;

							onChangeValue('arrow-width', value);
						}}
						onReset={() =>
							onChangeValue(
								'arrow-width',
								getDefaultAttribute(`arrow-width-${breakpoint}`)
							)
						}
						minMaxSettings={minMaxSettings}
					/>
				</>
			)}
		</div>
	);
};

export default ArrowControl;
