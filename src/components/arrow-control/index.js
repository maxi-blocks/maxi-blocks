/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl, RangeControl, RadioControl } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import SizeControl from '../size-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isNil } from 'lodash';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const ArrowControl = props => {
	const {
		arrow,
		defaultArrow,
		className,
		onChange,
		breakpoint = 'general',
		isFirstOnHierarchy,
	} = props;

	const value = !isObject(arrow) ? JSON.parse(arrow) : arrow;

	const defaultValue = !isObject(defaultArrow)
		? JSON.parse(defaultArrow)
		: defaultArrow;

	const classes = classnames('maxi-arrow-control', className);

	const getOptions = () => {
		let response = [
			{ label: __('Top', 'maxi-blocks'), value: 'top' },
			{ label: __('Bottom', 'maxi-blocks'), value: 'bottom' },
		];

		if (!isFirstOnHierarchy)
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
				<div className='maxi-fancy-radio-control'>
					<RadioControl
						label={__('Show Arrow', 'maxi-blocks')}
						selected={value.active}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => {
							value.active = Number(val);
							onChange(JSON.stringify(value));
						}}
					/>
				</div>
			}
			{!!value.active && (
				<Fragment>
					<SelectControl
						label={__('Side', 'maxi-blocks')}
						options={getOptions()}
						value={getLastBreakpointValue(
							value,
							'side',
							breakpoint
						)}
						onChange={val => {
							value[breakpoint].side = val;
							onChange(JSON.stringify(value));
						}}
					/>
					<RangeControl
						label={__('Position', 'maxi-blocks')}
						value={getLastBreakpointValue(
							value,
							'position',
							breakpoint
						)}
						min='0'
						max='100'
						onChange={val => {
							isNil(val)
								? (value[breakpoint].position =
										defaultValue[breakpoint].position)
								: (value[breakpoint].position = val);

							onChange(JSON.stringify(value));
						}}
						allowReset
						initialPosition={defaultValue[breakpoint].position}
					/>
					<SizeControl
						label={__('Arrow Size', 'maxi-blocks')}
						unit={getLastBreakpointValue(
							value,
							'widthUnit',
							breakpoint
						)}
						disableUnit
						defaultUnit={defaultValue[breakpoint].widthUnit}
						onChangeUnit={val => {
							value[breakpoint].widthUnit = val;
							onChange(JSON.stringify(value));
						}}
						value={getLastBreakpointValue(
							value,
							'width',
							breakpoint
						)}
						defaultValue={defaultValue[breakpoint].width}
						onChangeValue={val => {
							value[breakpoint].width = val;
							onChange(JSON.stringify(value));
						}}
						minMaxSettings={minMaxSettings}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default ArrowControl;
