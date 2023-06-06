/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
/**
 * Internal dependencies
 */
import Icon from '../icon';
import SettingTabsControl from '../setting-tabs-control';
import ScrollEffectUniqueControl from './scroll-effect-unique-control';
import {
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import { scrollTypes } from '../../extensions/attributes/defaults/scroll';
import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';
import * as defaultShortcuts from './shortcuts';
import { applyEffect, removeEffect } from './scroll-effect-preview';
import { getActiveTabName } from '../../extensions/inspector';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { toLower, capitalize, pickBy, cloneDeep, toNumber } from 'lodash';

/**
 * Styles and icons
 */
import {
	motionHorizontal,
	motionVertical,
	motionFade,
	motionBlur,
	motionRotate,
	motionScale,
} from '../../icons';
import './editor.scss';

/**
 * Component
 */
const ScrollEffectsControl = props => {
	const { className, onChange, breakpoint = 'g', uniqueID, depth } = props;
	const classes = classnames('maxi-scroll-effects-control', className);

	const activeTabName = getActiveTabName(depth);

	const getActiveEffects = () => {
		const response = [];
		scrollTypes.forEach(([_, type]) => {
			if (
				getAttributesValue({
					target: `sc${type}.s`,
					props,
					breakpoint,
				})
			)
				response.push(type);
		});

		return response;
	};

	const firstActiveEffect = getActiveEffects()?.[0] || '_v';
	const [scrollStatus, setScrollStatus] = useState(firstActiveEffect);

	const motionOptions = [
		{
			icon: <Icon icon={motionVertical} />,
			value: '_v',
			extraIndicatorsResponsive: ['sc_v.s'],
		},
		{
			icon: <Icon icon={motionHorizontal} />,
			value: '_ho',
			extraIndicatorsResponsive: ['sc_ho.s'],
		},
		{
			icon: <Icon icon={motionRotate} />,
			value: '_rot',
			extraIndicatorsResponsive: ['sc_rot.s'],
		},
		{
			icon: <Icon icon={motionScale} />,
			value: '_sc',
			extraIndicatorsResponsive: ['sc_sc.s'],
		},
		{
			icon: <Icon icon={motionFade} />,
			value: '_fa',
			extraIndicatorsResponsive: ['sc_fa.s'],
		},
		{
			icon: <Icon icon={motionBlur} />,
			value: '_blu',
			extraIndicatorsResponsive: ['sc_blu.s'],
		},
	];

	const easingOptions = [
		{
			label: __('Ease', 'maxi-blocks'),
			value: 'ease',
		},
		{
			label: __('Linear', 'maxi-blocks'),
			value: 'linear',
		},
		{
			label: __('Ease In', 'maxi-blocks'),
			value: 'ease-in',
		},
		{
			label: __('Ease Out', 'maxi-blocks'),
			value: 'ease-out',
		},
		{
			label: __('Ease In Out', 'maxi-blocks'),
			value: 'ease-in-out',
		},
	];

	const getShortcutEffect = type => {
		let response = {};
		switch (type) {
			case '_v':
				response = [
					{
						label: __('Choose', 'maxi-blocks'),
						value: 0,
					},
					{
						label: __('Up less', 'maxi-blocks'),
						value: 1,
					},
					{
						label: __('Down less', 'maxi-blocks'),
						value: 2,
					},
					{
						label: __('Up some', 'maxi-blocks'),
						value: 3,
					},
					{
						label: __('Down some', 'maxi-blocks'),
						value: 4,
					},
					{
						label: __('Up more', 'maxi-blocks'),
						value: 5,
					},
					{
						label: __('Down more', 'maxi-blocks'),
						value: 6,
					},
				];
				break;

			case '_ho':
				response = [
					{
						label: __('Choose', 'maxi-blocks'),
						value: 0,
					},
					{
						label: __('Right less', 'maxi-blocks'),
						value: 1,
					},
					{
						label: __('Left less', 'maxi-blocks'),
						value: 2,
					},
					{
						label: __('Right some', 'maxi-blocks'),
						value: 3,
					},
					{
						label: __('Left some', 'maxi-blocks'),
						value: 4,
					},
					{
						label: __('Right more', 'maxi-blocks'),
						value: 5,
					},
					{
						label: __('Left more', 'maxi-blocks'),
						value: 6,
					},
				];
				break;

			case '_rot':
				response = [
					{
						label: __('Choose', 'maxi-blocks'),
						value: 0,
					},
					{
						label: __('Right less', 'maxi-blocks'),
						value: 1,
					},
					{
						label: __('Left less', 'maxi-blocks'),
						value: 2,
					},
					{
						label: __('Right some', 'maxi-blocks'),
						value: 3,
					},
					{
						label: __('Left some', 'maxi-blocks'),
						value: 4,
					},
					{
						label: __('Right more', 'maxi-blocks'),
						value: 5,
					},
					{
						label: __('Left more', 'maxi-blocks'),
						value: 6,
					},
				];
				break;

			case '_sc':
				response = [
					{
						label: __('Choose', 'maxi-blocks'),
						value: 0,
					},
					{
						label: __('Up less', 'maxi-blocks'),
						value: 1,
					},
					{
						label: __('Down less', 'maxi-blocks'),
						value: 2,
					},
					{
						label: __('Up some', 'maxi-blocks'),
						value: 3,
					},
					{
						label: __('Down some', 'maxi-blocks'),
						value: 4,
					},
					{
						label: __('Up more', 'maxi-blocks'),
						value: 5,
					},
					{
						label: __('Down more', 'maxi-blocks'),
						value: 6,
					},
				];
				break;

			case '_fa':
				response = [
					{
						label: __('Choose', 'maxi-blocks'),
						value: 0,
					},
					{
						label: __('In less', 'maxi-blocks'),
						value: 1,
					},
					{
						label: __('Out less', 'maxi-blocks'),
						value: 2,
					},
					{
						label: __('In some', 'maxi-blocks'),
						value: 3,
					},
					{
						label: __('Out some', 'maxi-blocks'),
						value: 4,
					},
					{
						label: __('In more', 'maxi-blocks'),
						value: 5,
					},
					{
						label: __('Out more', 'maxi-blocks'),
						value: 6,
					},
				];
				break;

			case '_blu':
				response = [
					{
						label: __('Choose', 'maxi-blocks'),
						value: 0,
					},
					{
						label: __('In less', 'maxi-blocks'),
						value: 1,
					},
					{
						label: __('Out less', 'maxi-blocks'),
						value: 2,
					},
					{
						label: __('In some', 'maxi-blocks'),
						value: 3,
					},
					{
						label: __('Out some', 'maxi-blocks'),
						value: 4,
					},
					{
						label: __('In more', 'maxi-blocks'),
						value: 5,
					},
					{
						label: __('Out more', 'maxi-blocks'),
						value: 6,
					},
				];
				break;

			default:
				response = [
					{
						label: __('Choose', 'maxi-blocks'),
						value: 'none',
					},
					{
						label: __('Placeholder effect', 'maxi-blocks'),
						value: 'placeholder-effect',
					},
					{
						label: __('Another', 'maxi-blocks'),
						value: 'another',
					},
				];
				break;
		}

		return response;
	};

	const motionProps = pickBy(props, (val, key) => {
		return key.startsWith('sc');
	});

	const viewportOptions = [
		{
			label: __('Top of screen', 'maxi-blocks'),
			value: 'top',
		},
		{
			label: __('Middle of screen', 'maxi-blocks'),
			value: 'mid',
		},
		{
			label: __('Bottom of screen', 'maxi-blocks'),
			value: 'bottom',
		},
	];

	const globalShortcutsOptions = [
		{
			label: __('Choose', 'maxi-blocks'),
			value: 0,
		},
		{
			label: __('Disable all', 'maxi-blocks'),
			value: 1,
		},

		{
			label: __('In vertical Blur', 'maxi-blocks'),
			value: 2,
		},
		{
			label: __('Out vertical Blur', 'maxi-blocks'),
			value: 3,
		},
		{
			label: __('In horizontal Blur', 'maxi-blocks'),
			value: 4,
		},
		{
			label: __('Out horizontal Blur', 'maxi-blocks'),
			value: 5,
		},
		{
			label: __('In rotate Blur', 'maxi-blocks'),
			value: 6,
		},
		{
			label: __('Out rotate Blur', 'maxi-blocks'),
			value: 7,
		},
		{
			label: __('In scale Blur', 'maxi-blocks'),
			value: 8,
		},
		{
			label: __('Out scale Blur', 'maxi-blocks'),
			value: 9,
		},

		{
			label: __('Fade in up less', 'maxi-blocks'),
			value: 10,
		},
		{
			label: __('Fade in down less', 'maxi-blocks'),
			value: 11,
		},
		{
			label: __('Fade in left less', 'maxi-blocks'),
			value: 12,
		},
		{
			label: __('Fade in right less', 'maxi-blocks'),
			value: 13,
		},
		{
			label: __('Fade in up some', 'maxi-blocks'),
			value: 14,
		},
		{
			label: __('Fade in down some', 'maxi-blocks'),
			value: 15,
		},
		{
			label: __('Fade in left some', 'maxi-blocks'),
			value: 16,
		},
		{
			label: __('Fade in right some', 'maxi-blocks'),
			value: 17,
		},

		{
			label: __('Rotate up less', 'maxi-blocks'),
			value: 18,
		},
		{
			label: __('Rotate down less', 'maxi-blocks'),
			value: 19,
		},
		{
			label: __('Rotate left less', 'maxi-blocks'),
			value: 20,
		},
		{
			label: __('Rotate right less', 'maxi-blocks'),
			value: 21,
		},
		{
			label: __('Rotate up some', 'maxi-blocks'),
			value: 22,
		},
		{
			label: __('Rotate down some', 'maxi-blocks'),
			value: 23,
		},
		{
			label: __('Rotate left some', 'maxi-blocks'),
			value: 24,
		},
		{
			label: __('Rotate right some', 'maxi-blocks'),
			value: 25,
		},

		{
			label: __('Scale in Fade in less', 'maxi-blocks'),
			value: 26,
		},
		{
			label: __('Scale out Fade out less', 'maxi-blocks'),
			value: 27,
		},
		{
			label: __('Scale up Fade in less', 'maxi-blocks'),
			value: 28,
		},
		{
			label: __('Scale down Fade in less', 'maxi-blocks'),
			value: 29,
		},
	];

	const onChangeShortcut = (number, type) => {
		const newDefaultShortcuts = cloneDeep({ ...defaultShortcuts });

		if (type)
			onChange({
				...newDefaultShortcuts?.[type]?.[`shortcut${number}`],
				_set: {
					...props._set,
					[type]: number,
				},
			});
		else
			onChange({
				...newDefaultShortcuts?.[`shortcut${number}`],
				_sef: toNumber(number),
			});
	};

	useEffect(() => {
		if (activeTabName) {
			setScrollStatus(toLower(activeTabName));
		}
	});

	return (
		<div className={classes}>
			<SelectControl
				className='maxi-scroll-combinations-select'
				label={__('Scroll combinations', 'maxi-blocks')}
				onChange={val => onChangeShortcut(val)}
				value={props._sef}
				options={globalShortcutsOptions}
			/>
			<SettingTabsControl
				type='buttons'
				fullWidthMode
				selected={scrollStatus}
				items={motionOptions}
				onChange={val => setScrollStatus(val)}
				depth={depth}
				hasBorder
			/>
			{scrollTypes.map(([label, type]) => {
				const isPreviewEnabled = getLastBreakpointAttribute({
					target: `sc${type}.ps`,
					breakpoint,
					attributes: props,
				});
				return (
					<div
						key={`maxi-scroll-effects-control-${type}-${breakpoint}`}
					>
						{scrollStatus === type && (
							<ToggleSwitch
								// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
								label={__(
									`Activate ${label} scroll`,
									'maxi-blocks'
								)}
								selected={getLastBreakpointAttribute({
									target: `sc${type}.s`,
									breakpoint,
									attributes: props,
								})}
								onChange={val => {
									onChange({
										[`sc${type}.s-${breakpoint}`]: val,
									});
									val &&
										isPreviewEnabled &&
										applyEffect(type, uniqueID, 'Start');
									!val &&
										removeEffect(type, uniqueID) &&
										onChange({
											[`sc${type}.ps-g`]: false,
										});
								}}
							/>
						)}
						{scrollStatus === type &&
							getAttributesValue({
								target: `sc${type}.s`,
								props,
								breakpoint,
							}) && (
								<>
									<SelectControl
										label={__(
											'Direction preset',
											'maxi-blocks'
										)}
										value={props._set?.[type]}
										onChange={val =>
											onChangeShortcut(val, type)
										}
										options={getShortcutEffect(type)}
									/>
									<SelectControl
										label={__(
											'Easing function',
											'maxi-blocks'
										)}
										value={getLastBreakpointAttribute({
											target: `sc${type}_ea`,
											breakpoint,
											attributes: props,
										})}
										onChange={val =>
											onChange({
												[`sc${type}_ea-${breakpoint}`]:
													val,
											})
										}
										options={easingOptions}
									/>
									<AdvancedNumberControl
										label={__('Speed (ms)', 'maxi-blocks')}
										value={getLastBreakpointAttribute({
											target: `sc${type}_spe`,
											breakpoint,
											attributes: props,
										})}
										onChangeValue={val => {
											onChange({
												[`sc${type}_spe-${breakpoint}`]:
													val !== undefined &&
													val !== ''
														? val
														: '',
											});
										}}
										min={0}
										step={10}
										max={10000}
										onReset={() =>
											onChange({
												[`sc${type}_spe-${breakpoint}`]:
													getDefaultAttribute(
														`sc${type}_spe-g`
													),
												isReset: true,
											})
										}
										initialPosition={getDefaultAttribute(
											`sc${type}_spe-g`
										)}
									/>
									<AdvancedNumberControl
										label={__('Delay (ms)', 'maxi-blocks')}
										value={getLastBreakpointAttribute({
											target: `sc${type}_de`,
											breakpoint,
											attributes: props,
										})}
										onChangeValue={val => {
											onChange({
												[`sc${type}_de-${breakpoint}`]:
													val !== undefined &&
													val !== ''
														? val
														: '',
											});
										}}
										min={0}
										step={10}
										max={10000}
										onReset={() =>
											onChange({
												[`sc${type}_de-${breakpoint}`]:
													getDefaultAttribute(
														`sc${type}_de-g`
													),
												isReset: true,
											})
										}
										initialPosition={getDefaultAttribute(
											`sc${type}_de-g`
										)}
									/>
									<SelectControl
										label={__(
											'Viewport entry',
											'maxi-blocks'
										)}
										value={getLastBreakpointAttribute({
											target: `sc${type}_vpt`,
											breakpoint,
											attributes: props,
										})}
										onChange={val =>
											onChange({
												[`sc${type}_vpt-${breakpoint}`]:
													val,
											})
										}
										options={viewportOptions}
										defaultValue='mid'
									/>
									<ToggleSwitch
										label={__(
											'Simulate scroll effect live (test)',
											'maxi-block'
										)}
										selected={isPreviewEnabled}
										onChange={val => {
											onChange({
												[`sc${type}.ps-g`]: val,
											});
											val &&
												applyEffect(
													type,
													uniqueID,
													'Start'
												);
											!val &&
												removeEffect(type, uniqueID);
										}}
									/>
									<ScrollEffectUniqueControl
										label={__(
											`${capitalize(type)}`,
											'maxi-blocks'
										)}
										type={type}
										values={motionProps}
										onChange={value => onChange(value)}
										uniqueID={uniqueID}
										isPreviewEnabled={isPreviewEnabled}
									/>
									<ToggleSwitch
										label={__(
											'Reverse scroll playback',
											'maxi-blocks'
										)}
										selected={
											+getLastBreakpointAttribute({
												target: `sc${type}_sr`,
												breakpoint,
												attributes: props,
											})
										}
										onChange={val =>
											onChange({
												[`sc${type}_sr-${breakpoint}`]:
													!!+val,
											})
										}
									/>
								</>
							)}
					</div>
				);
			})}
		</div>
	);
};

export default ScrollEffectsControl;
