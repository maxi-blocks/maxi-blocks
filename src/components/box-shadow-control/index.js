/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import Icon from '../icon';
import AdvancedNumberControl from '../advanced-number-control';
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
		prefix = '',
		clientId,
	} = props;

	const classes = classnames('maxi-shadow-control', className);

	const onChangeDefault = defaultProp => {
		const response = {};

		defaultProp[`${prefix}box-shadow-color`] =
			props[`${prefix}box-shadow-color-${breakpoint}`];

		Object.entries(defaultProp).forEach(([key, value]) => {
			response[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] = value;
		});

		onChange(response);
	};

	const getIsActive = (typeObj, type) => {
		const items = [
			`${prefix}box-shadow-palette-opacity`,
			`${prefix}box-shadow-horizontal`,
			`${prefix}box-shadow-vertical`,
			`${prefix}box-shadow-blur`,
			`${prefix}box-shadow-spread`,
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
						activeItem: getIsActive(
							{ ...boxShadowNone(prefix) },
							'none'
						),
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChangeDefault(boxShadowNone(prefix)),
					},
					{
						activeItem: getIsActive(
							{ ...boxShadowTotal(prefix) },
							'total'
						),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__total' />
						),
						onChange: () => onChangeDefault(boxShadowTotal(prefix)),
					},
					{
						activeItem: getIsActive(
							{ ...boxShadowBottom(prefix) },
							'bottom'
						),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__bottom' />
						),
						onChange: () =>
							onChangeDefault(boxShadowBottom(prefix)),
					},
					{
						activeItem: getIsActive(
							{ ...boxShadowSolid(prefix) },
							'solid'
						),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__solid' />
						),
						onChange: () => onChangeDefault(boxShadowSolid(prefix)),
					},
				]}
			/>
			{!getIsActive(boxShadowNone, 'none') && (
				<>
					<ColorControl
						label={__('Box Shadow', 'maxi-blocks')}
						className='maxi-shadow-control__color'
						color={getLastBreakpointAttribute(
							`${prefix}box-shadow-color`,
							breakpoint,
							props,
							isHover
						)}
						prefix={`${prefix}box-shadow-`}
						useBreakpoint
						paletteStatus={getLastBreakpointAttribute(
							`${prefix}box-shadow-palette-status`,
							breakpoint,
							props,
							isHover
						)}
						paletteColor={getLastBreakpointAttribute(
							`${prefix}box-shadow-palette-color`,
							breakpoint,
							props,
							isHover
						)}
						paletteOpacity={getLastBreakpointAttribute(
							`${prefix}box-shadow-palette-opacity`,
							breakpoint,
							props,
							isHover
						)}
						onChange={({
							color,
							paletteColor,
							paletteStatus,
							paletteOpacity,
						}) => {
							onChange({
								[`${prefix}box-shadow-palette-status-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: paletteStatus,
								[`${prefix}box-shadow-palette-color-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: paletteColor,
								[`${prefix}box-shadow-palette-opacity-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: paletteOpacity,
								[`${prefix}box-shadow-color-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: color,
							});
						}}
						disableGradient
						disableImage
						disableVideo
						isHover={isHover}
						deviceType={breakpoint}
						clientId={clientId}
					/>
					{!disableAdvanced && (
						<>
							<AdvancedNumberControl
								label={__('Horizontal', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									`${prefix}box-shadow-horizontal`,
									breakpoint,
									props,
									isHover
								)}
								onChangeValue={val => {
									onChange({
										[`${prefix}box-shadow-horizontal-${breakpoint}${
											isHover ? '-hover' : ''
										}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								min={-100}
								max={100}
								onReset={() =>
									onChange({
										[`${prefix}box-shadow-horizontal-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: 0,
									})
								}
								initialPosition={getDefaultAttribute(
									`${prefix}box-shadow-horizontal-${breakpoint}${
										isHover ? '-hover' : ''
									}`
								)}
							/>
							<AdvancedNumberControl
								label={__('Vertical', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									`${prefix}box-shadow-vertical`,
									breakpoint,
									props,
									isHover
								)}
								onChangeValue={val => {
									onChange({
										[`${prefix}box-shadow-vertical-${breakpoint}${
											isHover ? '-hover' : ''
										}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								min={-100}
								max={100}
								onReset={() =>
									onChange({
										[`${prefix}box-shadow-vertical-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: 0,
									})
								}
								initialPosition={getDefaultAttribute(
									`${prefix}box-shadow-vertical-${breakpoint}${
										isHover ? '-hover' : ''
									}`
								)}
							/>
							<AdvancedNumberControl
								label={__('Blur', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									`${prefix}box-shadow-blur`,
									breakpoint,
									props,
									isHover
								)}
								onChangeValue={val => {
									onChange({
										[`${prefix}box-shadow-blur-${breakpoint}${
											isHover ? '-hover' : ''
										}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								min={-100}
								max={100}
								onReset={() =>
									onChange({
										[`${prefix}box-shadow-blur-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: 0,
									})
								}
								initialPosition={getDefaultAttribute(
									`${prefix}box-shadow-blur-${breakpoint}${
										isHover ? '-hover' : ''
									}`
								)}
							/>
							<AdvancedNumberControl
								label={__('Spread', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									`${prefix}box-shadow-spread`,
									breakpoint,
									props,
									isHover
								)}
								onChangeValue={val => {
									onChange({
										[`${prefix}box-shadow-spread-${breakpoint}${
											isHover ? '-hover' : ''
										}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								min={-100}
								max={100}
								onReset={() =>
									onChange({
										[`${prefix}box-shadow-spread-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: 0,
									})
								}
								initialPosition={getDefaultAttribute(
									`${prefix}box-shadow-spread-${breakpoint}${
										isHover ? '-hover' : ''
									}`
								)}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default BoxShadowControl;
