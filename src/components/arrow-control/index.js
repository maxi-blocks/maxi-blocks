/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import SizeControl from '../size-control';
import __experimentalFancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isNil } from 'lodash';

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

	const arrow = { ...props.arrow };

	const defaultArrow = { ...props.defaultArrow };

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
				<__experimentalFancyRadioControl
					label={__('Show Arrow', 'maxi-blocks')}
					selected={arrow.active}
					options={[
						{ label: __('Yes', 'maxi-blocks'), value: 1 },
						{ label: __('No', 'maxi-blocks'), value: 0 },
					]}
					onChange={val => {
						arrow.active = Number(val);
						onChange(arrow);
					}}
				/>
			}
			{!!arrow.active && (
				<Fragment>
					<__experimentalFancyRadioControl
						label=''
						selected={getLastBreakpointValue(
							arrow,
							'side',
							breakpoint
						)}
						options={getOptions()}
						onChange={val => {
							arrow[breakpoint].side = val;
							onChange(arrow);
						}}
					/>
					<RangeControl
						label={__('Position', 'maxi-blocks')}
						value={getLastBreakpointValue(
							arrow,
							'position',
							breakpoint
						)}
						min='0'
						max='100'
						onChange={val => {
							isNil(val)
								? (arrow[breakpoint].position =
										defaultArrow[breakpoint].position)
								: (arrow[breakpoint].position = val);

							onChange(arrow);
						}}
						allowReset
						initialPosition={defaultArrow[breakpoint].position}
					/>
					<SizeControl
						label={__('Arrow Size', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							arrow,
							'widthUnit',
							breakpoint
						)}
						disableUnit
						defaultUnit={defaultArrow[breakpoint].widthUnit}
						onChangeUnit={val => {
							arrow[breakpoint].widthUnit = val;
							onChange(arrow);
						}}
						value={getLastBreakpointValue(
							arrow,
							'width',
							breakpoint
						)}
						defaultArrow={defaultArrow[breakpoint].width}
						onChangeValue={val => {
							arrow[breakpoint].width = val;
							onChange(arrow);
						}}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default ArrowControl;
