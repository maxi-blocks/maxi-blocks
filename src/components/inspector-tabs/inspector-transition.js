/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import InfoBox from '../info-box';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import TransitionControl from '../transition-control';
import {
	getGroupAttributes,
	defaultTransitionObj,
	disableDefaultTransitionObj,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { cloneDeep, isEmpty, isEqual } from 'lodash';

/**
 * Component
 */
const TransitionControlWrapper = props => {
	const { attributes, deviceType, maxiSetAttributes, type, isOneType } =
		props;
	const { transition: rawTransition } = attributes;

	const transition = cloneDeep(rawTransition);

	Object.keys(transition[type]).forEach(key => {
		if (
			transition[type][key]?.hoverProp &&
			!attributes[transition[type][key].hoverProp]
		)
			delete transition[type][key];
	});

	const selected = attributes[`transition-${type}-selected`] || 'none';

	const transitionObj = transition[type][selected];

	const onChangeTransition = obj => {
		const newObj = {
			transition: {
				...attributes?.transition,
				[type]: {
					...(attributes?.transition?.[type] || []),
					[selected]: {
						...(attributes?.transition?.[type]?.[selected] || {}),
						...obj,
					},
				},
			},
		};

		maxiSetAttributes(newObj);

		return newObj;
	};

	const [disableDefaultTransition, setDisableDefaultTransition] =
		useState(false);

	const defaultTransition = disableDefaultTransition
		? disableDefaultTransitionObj
		: defaultTransitionObj;

	const getDefaultTransitionAttribute = prop =>
		defaultTransition[`${prop}-${deviceType}`];

	const onChangeSwitch = value => {
		setDisableDefaultTransition(value);

		const filterObjects = obj =>
			Object.keys(obj).reduce((acc, key) => {
				if (obj[key] !== undefined && key !== 'hoverProp') {
					acc[key] = obj[key];
				}

				return acc;
			}, {});

		if (
			isEqual(
				filterObjects(defaultTransition),
				filterObjects(transitionObj)
			)
		)
			switch (value) {
				case true:
					onChangeTransition(disableDefaultTransitionObj);
					break;
				case false:
					onChangeTransition(defaultTransitionObj);
					break;
				default:
					break;
			}
	};

	return !isEmpty(transition[type]) ? (
		<>
			<SelectControl
				label={__('Settings', 'maxi-blocks')}
				value={selected}
				options={[
					{
						label: __('Select setting', 'maxi-blocks'),
						value: 'none',
					},
					...(transition[type] &&
						Object.keys(transition[type]).map(name => ({
							label: __(
								name.charAt(0).toUpperCase() + name.slice(1),
								'maxi-blocks'
							),
							value: name,
						}))),
				]}
				onChange={val => {
					maxiSetAttributes({
						[`transition-${type}-selected`]: val,
					});
				}}
			/>
			{selected && selected !== 'none' && (
				<ResponsiveTabsControl breakpoint={deviceType}>
					<>
						<ToggleSwitch
							label={__(
								'Disable transition defaults',
								'maxi-blocks'
							)}
							selected={disableDefaultTransition}
							onChange={onChangeSwitch}
						/>
						<TransitionControl
							{...getGroupAttributes(attributes, 'transition')}
							onChange={onChangeTransition}
							getDefaultTransitionAttribute={
								getDefaultTransitionAttribute
							}
							transition={transitionObj}
							breakpoint={deviceType}
							type={type}
						/>
					</>
				</ResponsiveTabsControl>
			)}
		</>
	) : (
		<InfoBox
			// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
			message={__(
				`No transition ${
					!isOneType ? `${type}` : ''
				} settings available. Please turn on some hover settings.`,
				'maxi-blocks'
			)}
		/>
	);
};

const transition = ({
	props,
	label = __('Hover transition', 'maxi-blocks'),
}) => {
	const { attributes, deviceType } = props;
	const { transition } = attributes;

	const ignoreIndicator = [
		'transition-block-selected',
		'transition-canvas-selected',
	];

	return {
		label,
		content:
			isEmpty(transition.block) && isEmpty(transition.canvas) ? (
				<InfoBox
					message={__(
						'No transition settings available. Please turn on some hover settings.',
						'maxi-blocks'
					)}
				/>
			) : !isEmpty(transition.block) && !isEmpty(transition.canvas) ? (
				<SettingTabsControl
					breakpoint={deviceType}
					items={[
						{
							label: __('Block', 'maxi-blocks'),
							content: (
								<TransitionControlWrapper
									type='block'
									{...props}
								/>
							),
							ignoreIndicator,
						},
						{
							label: __('Canvas', 'maxi-blocks'),
							content: (
								<TransitionControlWrapper
									type='canvas'
									{...props}
								/>
							),
							ignoreIndicator,
						},
					]}
				/>
			) : (
				<TransitionControlWrapper type='canvas' isOneType {...props} />
			),
		ignoreIndicator,
	};
};

export default transition;
