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
	const {
		onChange,
		className,
		breakpoint,
		disableAdvanced = false,
		isHover = false,
	} = props;

	const classes = classnames('maxi-shadow-control', className);

	const onChangeValue = (target, val) => {
		onChange({
			[`${target}-${breakpoint}${isHover ? '-hover' : ''}`]: !isNil(+val)
				? val
				: getDefaultAttribute(
						`${target}-${breakpoint}${isHover ? '-hover' : ''}`
				  ),
		});
	};

	const onChangeDefault = defaultBoxShadow => {
		const response = {};

		Object.entries(defaultBoxShadow).forEach(([key, value]) => {
			response[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] = value;
		});

		onChange(response);
	};

	const getIsActive = (typeObj, type) => {
		const items = [
			'box-shadow-horizontal',
			'box-shadow-vertical',
			'box-shadow-blur',
			'box-shadow-spread',
		];

		const hasBoxShadow = items.some(item => {
			const itemValue = getLastBreakpointAttribute(
				item,
				breakpoint,
				props,
				isHover
			);

			return !isNil(itemValue) && itemValue !== 0;
		});
		if (!hasBoxShadow && type === 'none') return true;
		if (type === 'none') return false;

		const isActive = !items.some(item => {
			const itemValue = getLastBreakpointAttribute(
				item,
				breakpoint,
				props,
				isHover
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
					'box-shadow-color',
					breakpoint,
					props,
					isHover
				)}
				defaultColor={getDefaultAttribute(
					`box-shadow-color-${breakpoint}${isHover ? '-hover' : ''}`
				)}
				onChange={val => onChangeValue('box-shadow-color', val)}
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
							'box-shadow-horizontal',
							breakpoint,
							props,
							isHover
						)}
						onChange={val => {
							const value = isNil(val)
								? getDefaultAttribute(
										`box-shadow-horizontal-${breakpoint}`
								  )
								: val;
							onChangeValue('box-shadow-horizontal', value);
						}}
						min={-100}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute(
							`box-shadow-horizontal-${breakpoint}${
								isHover ? '-hover' : ''
							}`
						)}
					/>
					<RangeControl
						label={__('Vertical', 'maxi-blocks')}
						className='maxi-shadow-control__vertical'
						value={getLastBreakpointAttribute(
							'box-shadow-vertical',
							breakpoint,
							props,
							isHover
						)}
						onChange={val => {
							const value = isNil(val)
								? getDefaultAttribute(
										`box-shadow-vertical-${breakpoint}`
								  )
								: val;
							onChangeValue('box-shadow-vertical', value);
						}}
						min={-100}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute(
							`box-shadow-vertical-${breakpoint}${
								isHover ? '-hover' : ''
							}`
						)}
					/>
					<RangeControl
						label={__('Blur', 'maxi-blocks')}
						className='maxi-shadow-control__blur'
						value={getLastBreakpointAttribute(
							'box-shadow-blur',
							breakpoint
						)}
						props
						onChange={val => {
							const value = isNil(val)
								? getDefaultAttribute(
										`box-shadow-blur-${breakpoint}`
								  )
								: val;
							onChangeValue('box-shadow-blur', value);
						}}
						min={0}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute(
							`box-shadow-blur-${breakpoint}${
								isHover ? '-hover' : ''
							}`
						)}
					/>
					<RangeControl
						label={__('Spread', 'maxi-blocks')}
						className='maxi-shadow-control__spread-control'
						value={getLastBreakpointAttribute(
							'box-shadow-spread',
							breakpoint,
							props,
							isHover
						)}
						onChange={val => {
							const value = isNil(val)
								? getDefaultAttribute(
										`box-shadow-spread-${breakpoint}`
								  )
								: val;
							onChangeValue('box-shadow-spread', value);
						}}
						min={-100}
						max={100}
						allowReset
						initialPosition={getDefaultAttribute(
							`box-shadow-spread-${breakpoint}${
								isHover ? '-hover' : ''
							}`
						)}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default BoxShadowControl;
