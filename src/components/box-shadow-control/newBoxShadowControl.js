/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl, Icon } = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import {
	boxShadowNone,
	boxShadowTotal,
	boxShadowBottom,
	boxShadowSolid,
} from './newDefaults';

import getLastBreakpointAttribute from '../../extensions/styles/getLastBreakpointValue';
import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleNone } from '../../icons';

/**
 * Component
 */
const BoxShadowControl = props => {
	const { onChange, className, breakpoint, disableAdvanced = false } = props;

	const classes = classnames('maxi-shadow-control', className);

	const onChangeValue = (target, val) => {
		onChange({
			[`${target}-${breakpoint}`]: !isNil(+val)
				? val
				: getDefaultAttribute(`${target}-${breakpoint}`),
		});
	};

	const onChangeDefault = defaultBoxShadow => {
		const response = {};

		Object.entries(defaultBoxShadow).forEach(([key, value]) => {
			response[`${key}-${breakpoint}`] = value;
		});

		onChange(response);
	};

	const getIsActive = (typeObj, type) => {
		const items = [
			'boxShadow-horizontal',
			'boxShadow-vertical',
			'boxShadow-blur',
			'boxShadow-spread',
		];

		const hasBoxShadow = items.some(item => {
			const itemValue = getLastBreakpointAttribute(
				item,
				breakpoint,
				props
			);

			return !isNil(itemValue) && itemValue !== 0;
		});
		if (!hasBoxShadow && type === 'none') return true;
		if (type === 'none') return false;

		const isActive = !items.some(item => {
			const itemValue = getLastBreakpointAttribute(
				item,
				breakpoint,
				props
			);

			return itemValue !== typeObj[item];
		});

		if (isActive) return true;
		return false;
	};

	return (
		<div className={classes}>
			<DefaultStylesControl
				items={[
					{
						activeItem: getIsActive(null, 'none'),
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChangeDefault(boxShadowNone),
					},
					{
						activeItem: getIsActive(boxShadowTotal, 'total'),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__total' />
						),
						onChange: () => onChangeDefault(boxShadowTotal),
					},
					{
						activeItem: getIsActive(boxShadowBottom, 'bottom'),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__bottom' />
						),
						onChange: () => onChangeDefault(boxShadowBottom),
					},
					{
						activeItem: getIsActive(boxShadowSolid, 'solid'),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__solid' />
						),
						onChange: () => onChangeDefault(boxShadowSolid),
					},
				]}
			/>
			<ColorControl
				label={__('Box Shadow', 'maxi-blocks')}
				className='maxi-shadow-control__color'
				color={getLastBreakpointAttribute(
					'boxShadow-color',
					breakpoint
				)}
				defaultColor={getDefaultAttribute(
					`boxShadow-color-${breakpoint}`
				)}
				onChange={val => onChangeValue('boxShadow-color', +val)}
				disableGradient
				disableImage
				disableVideo
				disableGradientAboveBackground
			/>
			{!disableAdvanced && (
				<Fragment>
					<RangeControl
						label={__('Horizontal', 'maxi-blocks')}
						className='maxi-shadow-control__horizontal'
						value={getLastBreakpointAttribute(
							'boxShadow-horizontal',
							breakpoint,
							props
						)}
						onChange={val =>
							onChangeValue('boxShadow-horizontal', +val)
						}
						min={-100}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute(
							`boxShadow-horizontal-${breakpoint}`
						)}
					/>
					<RangeControl
						label={__('Vertical', 'maxi-blocks')}
						className='maxi-shadow-control__vertical'
						value={getLastBreakpointAttribute(
							'boxShadow-vertical',
							breakpoint,
							props
						)}
						onChange={val =>
							onChangeValue('boxShadow-vertical', +val)
						}
						min={-100}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute(
							`boxShadow-vertical-${breakpoint}`
						)}
					/>
					<RangeControl
						label={__('Blur', 'maxi-blocks')}
						className='maxi-shadow-control__blur'
						value={getLastBreakpointAttribute(
							'boxShadow-blur',
							breakpoint
						)}
						props
						onChange={val => onChangeValue('boxShadow-blur', +val)}
						min={0}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute(
							`boxShadow-blur-${breakpoint}`
						)}
					/>
					<RangeControl
						label={__('Spread', 'maxi-blocks')}
						className='maxi-shadow-control__spread-control'
						value={getLastBreakpointAttribute(
							'boxShadow-spread',
							breakpoint,
							props
						)}
						onChange={val =>
							onChangeValue('boxShadow-spread', +val)
						}
						min={-100}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute(
							`boxShadow-spread-${breakpoint}`
						)}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default BoxShadowControl;
