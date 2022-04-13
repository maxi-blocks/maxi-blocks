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
import { isNil, capitalize } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleNone, boxShadow } from '../../icons';

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
		/>
	);
};

const BoxShadowControl = props => {
	const {
		onChangeInline,
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
			const itemValue = getLastBreakpointAttribute({
				target: item,
				breakpoint,
				attributes: props,
				isHover,
			});

			return !isNil(itemValue) && itemValue !== 0;
		});
		if (!hasBoxShadow && type === 'none') return true;
		if (type === 'none') return false;

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

	const isNone = getIsActive(boxShadowNone, 'none');

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
						{...(!isToolbar && {
							label: __('Box Shadow', 'maxi-blocks'),
						})}
						className='maxi-shadow-control__color'
						color={getLastBreakpointAttribute({
							target: `${prefix}box-shadow-color`,
							breakpoint,
							attributes: props,
							isHover,
						})}
						prefix={`${prefix}box-shadow-`}
						useBreakpointForDefault
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
							onChangeInline({
								'box-shadow': `${getLastBreakpointAttribute({
									target: `${prefix}box-shadow-horizontal`,
									breakpoint,
									attributes: props,
									isHover,
								})}px ${getLastBreakpointAttribute({
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
					{!isToolbar &&
						boxShadowItems.map(type => (
							<BoxShadowValueControl type={type} {...props} />
						))}
				</>
			)}
		</div>
	);
};

export default BoxShadowControl;
