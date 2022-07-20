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
import { capitalize } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleNone, boxShadow } from '../../icons';
import ToggleSwitch from '../toggle-switch';

/**
 * Component
 */
const BoxShadowValueControl = props => {
	const {
		type,
		isToolbar = false,
		prefix = '',
		breakpoint,
		isHover = false,
		onChange,
	} = props;

	const minMaxSettings = {
		px: {
			min: type === 'blur' ? 0 : -3999,
			max: 3999,
			minRange: -1999,
			maxRange: 1999,
		},
		em: {
			min: type === 'blur' ? 0 : -999,
			max: 999,
			minRange: -300,
			maxRange: 300,
		},
		vw: {
			min: type === 'blur' ? 0 : -999,
			max: 999,
			minRange: -300,
			maxRange: 300,
		},
	};

	return (
		<AdvancedNumberControl
			{...(!isToolbar && { label: __(capitalize(type), 'maxi-blocks') })}
			value={getLastBreakpointAttribute({
				target: `${prefix}box-shadow-${type}`,
				breakpoint,
				attributes: props,
				isHover,
			})}
			onChangeValue={val => {
				onChange({
					[`${prefix}box-shadow-${type}-${breakpoint}${
						isHover ? '-hover' : ''
					}`]: val !== undefined && val !== '' ? val : '',
				});
			}}
			min={-100}
			max={100}
			minMaxSettings={minMaxSettings}
			onReset={() =>
				onChange({
					[`${prefix}box-shadow-${type}-${breakpoint}${
						isHover ? '-hover' : ''
					}`]: 0,
				})
			}
			initialPosition={getDefaultAttribute(
				`${prefix}box-shadow-${type}-${breakpoint}${
					isHover ? '-hover' : ''
				}`
			)}
			{...(!isToolbar && { enableUnit: true })}
			unit={getLastBreakpointAttribute({
				target: `${prefix}box-shadow-${type}-unit`,
				breakpoint,
				attributes: props,
				isHover,
			})}
			onChangeUnit={val =>
				onChange({
					[`${prefix}box-shadow-${type}-unit-${breakpoint}${
						isHover ? '-hover' : ''
					}`]: val,
				})
			}
			allowedUnits={['px', 'em', 'vw']}
		/>
	);
};

const BoxShadowControl = props => {
	const {
		onChangeInline = null,
		onChange,
		className,
		breakpoint,
		isToolbar = false,
		isHover = false,
		prefix = '',
		clientId,
	} = props;

	const boxShadowItems = ['horizontal', 'vertical', 'blur', 'spread'];

	const onChangeDefault = defaultProp => {
		const response = {};

		defaultProp[`${prefix}box-shadow-palette-color`] =
			getLastBreakpointAttribute({
				target: `${prefix}box-shadow-palette-color`,
				breakpoint,
				attributes: props,
				isHover,
			});

		defaultProp[`${prefix}box-shadow-color`] = getLastBreakpointAttribute({
			target: `${prefix}box-shadow-color`,
			breakpoint,
			attributes: props,
			isHover,
		});

		Object.entries(defaultProp).forEach(([key, value]) => {
			response[`${key}-${breakpoint}${isHover ? '-hover' : ''}`] = value;
		});

		onChange(response);
	};

	const getIsActive = typeObj => {
		const items = [
			`${prefix}box-shadow-palette-opacity`,
			`${prefix}box-shadow-horizontal`,
			`${prefix}box-shadow-horizontal-unit`,
			`${prefix}box-shadow-vertical`,
			`${prefix}box-shadow-vertical-unit`,
			`${prefix}box-shadow-blur`,
			`${prefix}box-shadow-blur-unit`,
			`${prefix}box-shadow-spread`,
			`${prefix}box-shadow-spread-unit`,
		];

		const isActive = !items.some(item => {
			const itemValue = getLastBreakpointAttribute({
				target: item,
				breakpoint,
				attributes: props,
				isHover,
			});

			return itemValue !== typeObj[item];
		});

		if (isActive) return true;

		return false;
	};

	const isNone = getIsActive(boxShadowNone(prefix));

	const classes = classnames(
		'maxi-shadow-control',
		isNone && 'maxi-shadow-control--disable',
		className
	);

	return (
		<div className={classes}>
			<DefaultStylesControl
				items={[
					{
						activeItem: getIsActive({ ...boxShadowNone(prefix) }),
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChangeDefault(boxShadowNone(prefix)),
					},
					{
						activeItem: getIsActive({ ...boxShadowTotal(prefix) }),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__total' />
						),
						onChange: () => onChangeDefault(boxShadowTotal(prefix)),
					},
					{
						activeItem: getIsActive({ ...boxShadowBottom(prefix) }),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__bottom' />
						),
						onChange: () =>
							onChangeDefault(boxShadowBottom(prefix)),
					},
					{
						activeItem: getIsActive({ ...boxShadowSolid(prefix) }),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__solid' />
						),
						onChange: () => onChangeDefault(boxShadowSolid(prefix)),
					},
				]}
			/>
			{isToolbar && (
				<>
					<div className='maxi-shadow-control__icon'>
						<Icon icon={boxShadow} />
					</div>
					<BoxShadowValueControl type='spread' isToolbar {...props} />
				</>
			)}
			{(isToolbar || !isNone) && (
				<>
					<ColorControl
						label={__('Box shadow', 'maxi-blocks')}
						className='maxi-shadow-control__color'
						color={getLastBreakpointAttribute({
							target: `${prefix}box-shadow-color`,
							breakpoint,
							attributes: props,
							isHover,
						})}
						prefix={`${prefix}box-shadow-`}
						paletteStatus={getLastBreakpointAttribute({
							target: `${prefix}box-shadow-palette-status`,
							breakpoint,
							attributes: props,
							isHover,
						})}
						paletteColor={getLastBreakpointAttribute({
							target: `${prefix}box-shadow-palette-color`,
							breakpoint,
							attributes: props,
							isHover,
						})}
						paletteOpacity={getLastBreakpointAttribute({
							target: `${prefix}box-shadow-palette-opacity`,
							breakpoint,
							attributes: props,
							isHover,
						})}
						onChangeInline={({ color }) => {
							onChangeInline &&
								onChangeInline({
									'box-shadow': `${getLastBreakpointAttribute(
										{
											target: `${prefix}box-shadow-horizontal`,
											breakpoint,
											attributes: props,
											isHover,
										}
									)}px ${getLastBreakpointAttribute({
										target: `${prefix}box-shadow-vertical`,
										breakpoint,
										attributes: props,
										isHover,
									})}px ${getLastBreakpointAttribute({
										target: `${prefix}box-shadow-blur`,
										breakpoint,
										attributes: props,
										isHover,
									})}px ${getLastBreakpointAttribute({
										target: `${prefix}box-shadow-spread`,
										breakpoint,
										attributes: props,
										isHover,
									})}px ${color}`,
								});
						}}
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
					{!isToolbar && (
						<>
							<ToggleSwitch
								label={__('Inset', 'maxi-block')}
								selected={getLastBreakpointAttribute({
									target: `${prefix}box-shadow-inset`,
									breakpoint,
									attributes: props,
									isHover,
								})}
								onChange={val =>
									onChange({
										[`${prefix}box-shadow-inset-${breakpoint}${
											isHover ? '-hover' : ''
										}`]: val,
									})
								}
							/>
							{boxShadowItems.map(type => (
								<BoxShadowValueControl
									type={type}
									key={type}
									{...props}
								/>
							))}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default BoxShadowControl;
