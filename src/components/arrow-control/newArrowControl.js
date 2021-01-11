/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl } = wp.components;

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';
import FancyRadioControl from '../fancy-radio-control';

import getLastBreakpointAttribute from '../../extensions/styles/getLastBreakpointValue';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';

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
					selected={+props['arrow-status']}
					options={[
						{ label: __('Yes', 'maxi-blocks'), value: 1 },
						{ label: __('No', 'maxi-blocks'), value: 0 },
					]}
					onChange={val => {
						onChange({ 'arrow-status': !!val });
					}}
				/>
			}
			{props['arrow-status'] && (
				<Fragment>
					<FancyRadioControl
						label=''
						selected={getLastBreakpointAttribute(
							'arrow-side',
							breakpoint,
							props
						)}
						options={getOptions()}
						onChange={val => {
							onChangeValue('arrow-side', val);
						}}
					/>
					<RangeControl
						label={__('Position', 'maxi-blocks')}
						value={getLastBreakpointAttribute(
							'arrow-position',
							breakpoint,
							props
						)}
						min='0'
						max='100'
						onChange={val => {
							const value = isNil(val)
								? getDefaultAttribute(
										`arrow-position-${breakpoint}`
								  )
								: val;

							onChangeValue('arrow-position', value);
						}}
						allowReset
						initialPosition={getDefaultAttribute(
							`arrow-position-${breakpoint}`
						)}
					/>
					<SizeControl
						label={__('Arrow Size', 'maxi-blocks')}
						unit={getLastBreakpointAttribute(
							'arrow-widthUnit',
							breakpoint,
							props
						)}
						disableUnit
						defaultUnit={getDefaultAttribute(
							`arrow-width-unit-${breakpoint}`
						)}
						onChangeUnit={val => {
							onChangeValue('arrow-width-unit', val);
						}}
						value={getLastBreakpointAttribute(
							'arrow-width',
							breakpoint,
							props
						)}
						defaultArrow={getDefaultAttribute(
							`arrow-width-${breakpoint}`
						)}
						onChangeValue={val => {
							onChangeValue('arrow-width', val);
						}}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default ArrowControl;
