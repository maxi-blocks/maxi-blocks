/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { useContext, useEffect, useState } from '@wordpress/element';
/**
 * Internal dependencies
 */
import Icon from '../icon';
import SettingTabsControl from '../setting-tabs-control';
import ScrollEffectUniqueControl from './scroll-effect-unique-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { scrollTypes } from '../../extensions/styles/defaults/scroll';
import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';
import * as defaultShortcuts from './shortcuts';
import { applyEffect, removeEffect } from './scroll-effect-preview';
import { getActiveTabName } from '../../extensions/inspector';
import { getBlockPosition } from '../../extensions/repeater/utils';
import RepeaterContext from '../../blocks/row-maxi/repeaterContext';

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
	const {
		clientId,
		className,
		onChange,
		breakpoint = 'general',
		uniqueID,
		depth,
	} = props;

	const repeaterContext = useContext(RepeaterContext);

	const classes = classnames('maxi-scroll-effects-control', className);

	const activeTabName = getActiveTabName(depth);

	const getActiveEffects = () => {
		const response = [];
		scrollTypes.forEach(type => {
			if (props[`scroll-${type}-status-${breakpoint}`])
				response.push(type);
		});

		return response;
	};

	const firstActiveEffect = getActiveEffects()?.[0] || 'vertical';
	const [scrollStatus, setScrollStatus] = useState(firstActiveEffect);

	const motionOptions = [
		{
			icon: <Icon icon={motionVertical} />,
			value: 'vertical',
			extraIndicatorsResponsive: ['scroll-vertical-status'],
		},
		{
			icon: <Icon icon={motionHorizontal} />,
			value: 'horizontal',
			extraIndicatorsResponsive: ['scroll-horizontal-status'],
		},
		{
			icon: <Icon icon={motionRotate} />,
			value: 'rotate',
			extraIndicatorsResponsive: ['scroll-rotate-status'],
		},
		{
			icon: <Icon icon={motionScale} />,
			value: 'scale',
			extraIndicatorsResponsive: ['scroll-scale-status'],
		},
		{
			icon: <Icon icon={motionFade} />,
			value: 'fade',
			extraIndicatorsResponsive: ['scroll-fade-status'],
		},
		{
			icon: <Icon icon={motionBlur} />,
			value: 'blur',
			extraIndicatorsResponsive: ['scroll-blur-status'],
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
			case 'vertical':
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

			case 'horizontal':
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

			case 'rotate':
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

			case 'scale':
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

			case 'fade':
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

			case 'blur':
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
		return key.includes('scroll-');
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
				shortcutEffectType: {
					...props.shortcutEffectType,
					[type]: number,
				},
			});
		else
			onChange({
				...newDefaultShortcuts?.[`shortcut${number}`],
				shortcutEffect: toNumber(number),
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
				value={props.shortcutEffect}
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
			{scrollTypes.map(type => {
				const isPreviewEnabled = getLastBreakpointAttribute({
					target: `scroll-${type}-preview-status`,
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
									`Activate ${type} scroll`,
									'maxi-blocks'
								)}
								selected={getLastBreakpointAttribute({
									target: `scroll-${type}-status`,
									breakpoint,
									attributes: props,
								})}
								onChange={val => {
									onChange({
										[`scroll-${type}-status-${breakpoint}`]:
											val,
									});
									val &&
										isPreviewEnabled &&
										applyEffect(type, uniqueID, 'Start');
									!val &&
										removeEffect(type, uniqueID) &&
										onChange({
											[`scroll-${type}-preview-status-general`]: false,
										});
								}}
							/>
						)}
						{scrollStatus === type &&
							props[`scroll-${type}-status-${breakpoint}`] && (
								<>
									<SelectControl
										label={__(
											'Direction preset',
											'maxi-blocks'
										)}
										value={props.shortcutEffectType?.[type]}
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
											target: `scroll-${type}-easing`,
											breakpoint,
											attributes: props,
										})}
										onChange={val =>
											onChange({
												[`scroll-${type}-easing-${breakpoint}`]:
													val,
											})
										}
										options={easingOptions}
									/>
									<AdvancedNumberControl
										label={__('Speed (ms)', 'maxi-blocks')}
										value={getLastBreakpointAttribute({
											target: `scroll-${type}-speed`,
											breakpoint,
											attributes: props,
										})}
										onChangeValue={val => {
											onChange({
												[`scroll-${type}-speed-${breakpoint}`]:
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
												[`scroll-${type}-speed-${breakpoint}`]:
													getDefaultAttribute(
														`scroll-${type}-speed-general`
													),
												isReset: true,
											})
										}
										initialPosition={getDefaultAttribute(
											`scroll-${type}-speed-general`
										)}
									/>
									<AdvancedNumberControl
										label={__('Delay (ms)', 'maxi-blocks')}
										value={getLastBreakpointAttribute({
											target: `scroll-${type}-delay`,
											breakpoint,
											attributes: props,
										})}
										onChangeValue={val => {
											onChange({
												[`scroll-${type}-delay-${breakpoint}`]:
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
												[`scroll-${type}-delay-${breakpoint}`]:
													getDefaultAttribute(
														`scroll-${type}-delay-general`
													),
												isReset: true,
											})
										}
										initialPosition={getDefaultAttribute(
											`scroll-${type}-delay-general`
										)}
									/>
									<SelectControl
										label={__(
											'Viewport entry',
											'maxi-blocks'
										)}
										value={getLastBreakpointAttribute({
											target: `scroll-${type}-viewport-top`,
											breakpoint,
											attributes: props,
										})}
										onChange={val =>
											onChange({
												[`scroll-${type}-viewport-top-${breakpoint}`]:
													val,
											})
										}
										options={viewportOptions}
										defaultValue='mid'
									/>
									<ToggleSwitch
										label={__(
											'Simulate scroll effect live (test)',
											'maxi-blocks'
										)}
										selected={isPreviewEnabled}
										onChange={val => {
											onChange({
												[`scroll-${type}-preview-status-general`]:
													val,
											});

											const handlePreviewStatusChange =
												uniqueIDToAffect => {
													if (val) {
														applyEffect(
															type,
															uniqueIDToAffect,
															'Start'
														);
													} else {
														removeEffect(
															type,
															uniqueIDToAffect
														);
													}
												};

											handlePreviewStatusChange(uniqueID);

											if (
												repeaterContext?.repeaterStatus
											) {
												const innerBlockPositions =
													repeaterContext?.getInnerBlocksPositions?.();

												const blockPosition =
													getBlockPosition(
														clientId,
														innerBlockPositions
													);

												if (
													innerBlockPositions?.[
														blockPosition
													]
												) {
													innerBlockPositions[
														blockPosition
													].forEach(blockClientId => {
														if (
															blockClientId ===
															clientId
														)
															return;

														const blockUniqueId =
															select(
																'core/block-editor'
															).getBlock(
																blockClientId
															)?.attributes
																?.uniqueID;

														if (blockUniqueId) {
															handlePreviewStatusChange(
																blockUniqueId
															);
														}
													});
												}
											}
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
												target: `scroll-${type}-status-reverse`,
												breakpoint,
												attributes: props,
											})
										}
										onChange={val =>
											onChange({
												[`scroll-${type}-status-reverse-${breakpoint}`]:
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
