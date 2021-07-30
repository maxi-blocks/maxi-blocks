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
		clientId,
	} = props;

	const classes = classnames('maxi-shadow-control', className);

	const onChangeDefault = defaultProp => {
		const response = {};

		defaultProp['box-shadow-color'] =
			props[`box-shadow-color-${breakpoint}`];

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
				<>
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
						paletteColor={getLastBreakpointAttribute(
							'box-shadow-palette-color',
							breakpoint,
							props,
							isHover
						)}
						paletteStatus={getLastBreakpointAttribute(
							'box-shadow-palette-color-status',
							breakpoint,
							props,
							isHover
						)}
						onChange={({ color, paletteColor, paletteStatus }) => {
							onChange({
								[`box-shadow-color-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: color,
								[`box-shadow-palette-color-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: paletteColor,
								[`box-shadow-palette-color-status-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: paletteStatus,
							});
						}}
						disableGradient
						disableImage
						disableVideo
						showPalette
						isHover={isHover}
						deviceType={breakpoint}
						clientId={clientId}
					/>
					{!disableAdvanced && (
						<>
							<AdvancedNumberControl
								label={__('Horizontal', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									'box-shadow-horizontal',
									breakpoint,
									props,
									isHover
								)}
								onChangeValue={val => {
									onChange({
										[`box-shadow-horizontal-${breakpoint}${
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
										[`box-shadow-horizontal-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: 0,
									})
								}
								initialPosition={getDefaultAttribute(
									`box-shadow-horizontal-${breakpoint}${
										isHover ? '-hover' : ''
									}`
								)}
							/>
							<AdvancedNumberControl
								label={__('Vertical', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									'box-shadow-vertical',
									breakpoint,
									props,
									isHover
								)}
								onChangeValue={val => {
									onChange({
										[`box-shadow-vertical-${breakpoint}${
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
										[`box-shadow-vertical-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: 0,
									})
								}
								initialPosition={getDefaultAttribute(
									`box-shadow-vertical-${breakpoint}${
										isHover ? '-hover' : ''
									}`
								)}
							/>
							<AdvancedNumberControl
								label={__('Blur', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									'box-shadow-blur',
									breakpoint,
									props,
									isHover
								)}
								onChangeValue={val => {
									onChange({
										[`box-shadow-blur-${breakpoint}${
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
										[`box-shadow-blur-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: 0,
									})
								}
								initialPosition={getDefaultAttribute(
									`box-shadow-blur-${breakpoint}${
										isHover ? '-hover' : ''
									}`
								)}
							/>
							<AdvancedNumberControl
								label={__('Spread', 'maxi-blocks')}
								value={getLastBreakpointAttribute(
									'box-shadow-spread',
									breakpoint,
									props,
									isHover
								)}
								onChangeValue={val => {
									onChange({
										[`box-shadow-spread-${breakpoint}${
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
										[`box-shadow-spread-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: 0,
									})
								}
								initialPosition={getDefaultAttribute(
									`box-shadow-spread-${breakpoint}${
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
