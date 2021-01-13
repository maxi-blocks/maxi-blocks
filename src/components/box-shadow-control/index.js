/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl, Icon } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import {
	boxShadowNone,
	boxShadowTotal,
	boxShadowBottom,
	boxShadowSolid,
} from './defaults';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEqual, cloneDeep } from 'lodash';

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

	const boxShadow = { ...props.boxShadow };
	const defaultBoxShadow = { ...props.defaultBoxShadow };

	const classes = classnames('maxi-shadow-control', className);

	const onChangeValue = (target, val) => {
		if (typeof val === 'undefined')
			boxShadow[breakpoint][target] =
				defaultBoxShadow[breakpoint][target];
		else boxShadow[breakpoint][target] = val;

		onChange(boxShadow);
	};

	const onChangeDefault = defaultBoxShadow => {
		boxShadow[breakpoint] = cloneDeep(defaultBoxShadow);

		onChange(boxShadow);
	};

	const getIsActive = typeObj => {
		const defaultShadows = {
			shadowHorizontal: typeObj['shadowHorizontal'],
			shadowVertical: typeObj['shadowVertical'],
			shadowBlur: typeObj['shadowBlur'],
			shadowSpread: typeObj['shadowSpread'],
		};
		const currentShadows = {
			shadowHorizontal:
				getLastBreakpointValue(
					boxShadow,
					'shadowHorizontal',
					breakpoint
				) || 0,
			shadowVertical:
				getLastBreakpointValue(
					boxShadow,
					'shadowVertical',
					breakpoint
				) || 0,
			shadowBlur:
				getLastBreakpointValue(boxShadow, 'shadowBlur', breakpoint) ||
				0,
			shadowSpread:
				getLastBreakpointValue(boxShadow, 'shadowSpread', breakpoint) ||
				0,
		};

		return isEqual(defaultShadows, currentShadows);
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
			<ColorControl
				label={__('Box Shadow', 'maxi-blocks')}
				className='maxi-shadow-control__color'
				color={getLastBreakpointValue(
					boxShadow,
					'shadowColor',
					breakpoint
				)}
				defaultColor={defaultBoxShadow[breakpoint].shadowColor}
				onChange={val => onChangeValue('shadowColor', val)}
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
						value={Number(
							getLastBreakpointValue(
								boxShadow,
								'shadowHorizontal',
								breakpoint
							)
						)}
						onChange={val => onChangeValue('shadowHorizontal', val)}
						min={-100}
						max={100}
						allowReset
						initialPosition={
							defaultBoxShadow[breakpoint].shadowHorizontal
						}
					/>
					<RangeControl
						label={__('Vertical', 'maxi-blocks')}
						className='maxi-shadow-control__vertical'
						value={Number(
							getLastBreakpointValue(
								boxShadow,
								'shadowVertical',
								breakpoint
							)
						)}
						onChange={val => onChangeValue('shadowVertical', val)}
						min={-100}
						max={100}
						allowReset
						initialPosition={
							defaultBoxShadow[breakpoint].shadowVertical
						}
					/>
					<RangeControl
						label={__('Blur', 'maxi-blocks')}
						className='maxi-shadow-control__blur'
						value={Number(
							getLastBreakpointValue(
								boxShadow,
								'shadowBlur',
								breakpoint
							)
						)}
						onChange={val => onChangeValue('shadowBlur', val)}
						min={0}
						max={100}
						allowReset
						initialPosition={
							defaultBoxShadow[breakpoint].shadowBlur
						}
					/>
					<RangeControl
						label={__('Spread', 'maxi-blocks')}
						className='maxi-shadow-control__spread-control'
						value={Number(
							getLastBreakpointValue(
								boxShadow,
								'shadowSpread',
								breakpoint
							)
						)}
						onChange={val => onChangeValue('shadowSpread', val)}
						min={-100}
						max={100}
						allowReset
						initialPosition={
							defaultBoxShadow[breakpoint].shadowSpread
						}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default BoxShadowControl;
