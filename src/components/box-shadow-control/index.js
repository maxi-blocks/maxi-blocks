/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import Icon from '../icon';
import RangeSliderControl from '../range-slider-control';
import {
	boxShadowNone,
	boxShadowTotal,
	boxShadowBottom,
	boxShadowSolid,
} from './defaults';
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
			[`${target}-${breakpoint}${isHover ? '-hover' : ''}`]: val,
		});
	};

	const onChangeDefault = defaultProp => {
		const response = {};

		Object.entries(defaultProp).forEach(([key, value]) => {
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
						activeItem: getIsActive(boxShadowNone, 'none'),
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
			{!getIsActive(boxShadowNone, 'none') && (
				<Fragment>
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
							`box-shadow-color-${breakpoint}${
								isHover ? '-hover' : ''
							}`
						)}
						onChange={val => {
							onChange({
								[`box-shadow-color-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: val,
							});
						}}
						disableGradient
						disableImage
						disableVideo
					/>
					{!disableAdvanced && (
						<Fragment>
							<RangeSliderControl
								label={__('Horizontal', 'maxi-blocks')}
								className='maxi-shadow-control__horizontal'
								defaultValue={getDefaultAttribute(
									`box-shadow-horizontal-${breakpoint}`
								)}
								value={getLastBreakpointAttribute(
									'box-shadow-horizontal',
									breakpoint,
									props,
									isHover
								)}
								onChange={val =>
									onChangeValue('box-shadow-horizontal', val)
								}
								min={-100}
								max={100}
								allowReset
								initialPosition={getDefaultAttribute(
									`box-shadow-horizontal-${breakpoint}${
										isHover ? '-hover' : ''
									}`
								)}
							/>
							<RangeSliderControl
								label={__('Vertical', 'maxi-blocks')}
								className='maxi-shadow-control__vertical'
								defaultValue={getDefaultAttribute(
									`box-shadow-vertical-${breakpoint}`
								)}
								value={getLastBreakpointAttribute(
									'box-shadow-vertical',
									breakpoint,
									props,
									isHover
								)}
								onChange={val =>
									onChangeValue('box-shadow-vertical', val)
								}
								min={-100}
								max={100}
								allowReset
								initialPosition={getDefaultAttribute(
									`box-shadow-vertical-${breakpoint}${
										isHover ? '-hover' : ''
									}`
								)}
							/>
							<RangeSliderControl
								label={__('Blur', 'maxi-blocks')}
								className='maxi-shadow-control__blur'
								defaultValue={getDefaultAttribute(
									`box-shadow-blur-${breakpoint}`
								)}
								value={getLastBreakpointAttribute(
									'box-shadow-blur',
									breakpoint
								)}
								props
								onChange={val =>
									onChangeValue('box-shadow-blur', val)
								}
								min={0}
								max={100}
								allowReset
								initialPosition={getDefaultAttribute(
									`box-shadow-blur-${breakpoint}${
										isHover ? '-hover' : ''
									}`
								)}
							/>
							<RangeSliderControl
								label={__('Spread', 'maxi-blocks')}
								className='maxi-shadow-control__spread-control'
								defaultValue={getDefaultAttribute(
									`box-shadow-spread-${breakpoint}`
								)}
								value={getLastBreakpointAttribute(
									'box-shadow-spread',
									breakpoint,
									props,
									isHover
								)}
								onChange={val =>
									onChangeValue('box-shadow-spread', val)
								}
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
				</Fragment>
			)}
		</div>
	);
};

export default BoxShadowControl;
