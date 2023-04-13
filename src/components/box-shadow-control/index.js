/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import Icon from '../icon';
import {
	boxShadowNone,
	boxShadowTotal,
	boxShadowBottom,
	boxShadowSolid,
} from './defaults';
import withRTC from '../../extensions/maxi-block/withRTC';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getAttributeKey,
} from '../../extensions/attributes';
import ToggleSwitch from '../toggle-switch';

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
			min: type === '_blu' ? 0 : -3999,
			max: 3999,
			minRange: -1999,
			maxRange: 1999,
		},
		em: {
			min: type === '_blu' ? 0 : -999,
			max: 999,
			minRange: -300,
			maxRange: 300,
		},
		vw: {
			min: type === '_blu' ? 0 : -999,
			max: 999,
			minRange: -300,
			maxRange: 300,
		},
	};

	const boxShadowDictionary = {
		_ho: 'horizontal',
		_v: 'vertical',
		_blu: 'blur',
		_sp: 'spread',
	};

	return (
		<AdvancedNumberControl
			{...(!isToolbar && {
				label: __(capitalize(boxShadowDictionary[type]), 'maxi-blocks'),
			})}
			value={getLastBreakpointAttribute({
				target: `bs${type}`,
				prefix,
				breakpoint,
				attributes: props,
				isHover,
			})}
			defaultValue={getLastBreakpointAttribute({
				target: `bs${type}`,
				prefix,
				breakpoint,
				attributes: props,
				isHover,
			})}
			onChangeValue={val => {
				onChange({
					[getAttributeKey(`bs${type}`, isHover, prefix, breakpoint)]:
						val !== undefined && val !== '' ? val : '',
				});
			}}
			min={-100}
			max={100}
			minMaxSettings={minMaxSettings}
			onReset={() =>
				onChange({
					[getAttributeKey(`bs${type}`, isHover, prefix, breakpoint)]:
						getDefaultAttribute(
							getAttributeKey(
								`bs${type}`,
								isHover,
								prefix,
								breakpoint
							)
						),
					[getAttributeKey(
						`bs${type}.u`,
						isHover,
						prefix,
						breakpoint
					)]: getDefaultAttribute(
						getAttributeKey(
							`bs${type}.u`,
							isHover,
							prefix,
							breakpoint
						)
					),
					isReset: true,
				})
			}
			initialPosition={getDefaultAttribute(
				getAttributeKey(`bs${type}`, isHover, prefix, breakpoint)
			)}
			{...(!isToolbar && { enableUnit: true })}
			unit={getLastBreakpointAttribute({
				target: `bs${type}.u`,
				prefix,
				breakpoint,
				attributes: props,
				isHover,
			})}
			onChangeUnit={val =>
				onChange({
					[getAttributeKey(
						`bs${type}.u`,
						isHover,
						prefix,
						breakpoint
					)]: val,
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
		label = 'Box shadow',
		dropShadow = false,
		disableInset = false,
	} = props;

	const boxShadowItems = ['_ho', '_v', '_blu']; // horizontal, vertical, blur
	!dropShadow && boxShadowItems.push('_sp'); // spread

	const onChangeDefault = defaultProp => {
		const response = {};

		defaultProp[getAttributeKey('bs_pc', false, prefix)] =
			getLastBreakpointAttribute({
				target: 'bs_pc',
				prefix,
				breakpoint,
				attributes: props,
				isHover,
			});

		defaultProp[getAttributeKey('bs_cc', false, prefix)] =
			getLastBreakpointAttribute({
				target: 'bs_cc',
				prefix,
				breakpoint,
				attributes: props,
				isHover,
			});

		Object.entries(defaultProp).forEach(([key, value]) => {
			response[getAttributeKey(key, isHover, null, breakpoint)] = value;
		});

		onChange(response);
	};

	const getIsActive = typeObj => {
		const items = [
			`${prefix}bs_po`,
			`${prefix}bs_ho`,
			`${prefix}bs_ho.u`,
			`${prefix}bs_v`,
			`${prefix}bs_v.u`,
			`${prefix}bs_blu`,
			`${prefix}bs_blu.u`,
			`${prefix}bs_sp`,
			`${prefix}bs_sp.u`,
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
						activeItem: getIsActive({
							...boxShadowNone(prefix),
						}),
						content: (
							<Icon
								className='maxi-default-styles-control__button__icon'
								icon={styleNone}
							/>
						),
						onChange: () => onChangeDefault(boxShadowNone(prefix)),
					},
					{
						activeItem: getIsActive({
							...boxShadowTotal(prefix),
						}),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__total' />
						),
						onChange: () => onChangeDefault(boxShadowTotal(prefix)),
					},
					{
						activeItem: getIsActive({
							...boxShadowBottom(prefix),
						}),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__bottom' />
						),
						onChange: () =>
							onChangeDefault(boxShadowBottom(prefix)),
					},
					{
						activeItem: getIsActive({
							...boxShadowSolid(prefix),
						}),
						content: (
							<div className='maxi-shadow-control__default maxi-shadow-control__default__solid' />
						),
						onChange: () => onChangeDefault(boxShadowSolid(prefix)),
					},
				]}
			/>
			{isToolbar && !dropShadow && (
				<>
					<div className='maxi-shadow-control__icon'>
						<Icon icon={boxShadow} />
					</div>
					<BoxShadowValueControl type='_sp' isToolbar {...props} />
				</>
			)}
			<ColorControl
				label={__(label, 'maxi-blocks')}
				className='maxi-shadow-control__color'
				color={getLastBreakpointAttribute({
					target: 'bs_cc',
					prefix,
					breakpoint,
					attributes: props,
					isHover,
				})}
				prefix={`${prefix}bs`}
				paletteStatus={getLastBreakpointAttribute({
					target: 'bs_ps',
					prefix,
					breakpoint,
					attributes: props,
					isHover,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: 'bs_pc',
					prefix,
					breakpoint,
					attributes: props,
					isHover,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: 'bs_po',
					prefix,
					breakpoint,
					attributes: props,
					isHover,
				})}
				onChangeInline={({ color }) => {
					onChangeInline &&
						onChangeInline({
							'box-shadow': `${getLastBreakpointAttribute({
								target: 'bs_ho',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}px ${getLastBreakpointAttribute({
								target: 'bs_v',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}px ${getLastBreakpointAttribute({
								target: 'bs_blu',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}px ${getLastBreakpointAttribute({
								target: 'bs_sp',
								prefix,
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
						[getAttributeKey(
							'_cc',
							isHover,
							`${prefix}bs`,
							breakpoint
						)]: color,
						[getAttributeKey(
							'_ps',
							isHover,
							`${prefix}bs`,
							breakpoint
						)]: paletteStatus,
						[getAttributeKey(
							'_pc',
							isHover,
							`${prefix}bs`,
							breakpoint
						)]: paletteColor,
						[getAttributeKey(
							'_po',
							isHover,
							`${prefix}bs`,
							breakpoint
						)]: paletteOpacity,
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
					{!dropShadow && !disableInset && (
						<ToggleSwitch
							label={__('Inset', 'maxi-block')}
							selected={getLastBreakpointAttribute({
								target: 'bs_in',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChange={val =>
								onChange({
									[getAttributeKey(
										'bs_in',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
						/>
					)}
					{boxShadowItems.map(type => (
						<BoxShadowValueControl
							type={type}
							key={type}
							{...props}
						/>
					))}
				</>
			)}
		</div>
	);
};

export default withRTC(BoxShadowControl);
