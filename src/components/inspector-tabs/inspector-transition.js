/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { capitalize, cloneDeep, isEmpty } from 'lodash';

/**
 * Component
 */
const TransitionControlWrapper = props => {
	const {
		attributes,
		deviceType,
		maxiSetAttributes,
		transition,
		type,
		isOneType,
	} = props;
	const { 'transition-change-all': transitionChangeAll } = attributes;

	const selected = attributes[`transition-${type}-selected`];

	const defaultTransition = getDefaultAttribute('transition')[type][selected];
	const selectedTransition = transition[type][selected];

	const transitionStatus = getLastBreakpointAttribute({
		target: 'transition-status',
		attributes: selectedTransition,
		breakpoint: deviceType,
	});

	const getDefaultTransitionAttribute = prop =>
		defaultTransition[`${prop}-${deviceType}`];

	const onChangeTransition = obj => {
		let newObj = {
			transition: {},
		};

		if (transitionChangeAll) {
			Object.keys(attributes?.transition).forEach(type => {
				newObj.transition[type] = {};

				Object.keys(attributes?.transition?.[type]).forEach(key => {
					newObj.transition[type][key] = {
						...attributes?.transition?.[type][key],
						...obj,
					};
				});
			});
		} else {
			newObj = {
				transition: {
					...attributes?.transition,
					[type]: {
						...(attributes?.transition?.[type] || []),
						[selected]: {
							...selectedTransition,
							...obj,
						},
					},
				},
			};
		}
		maxiSetAttributes(newObj);

		return newObj;
	};

	const onChangeSwitch = value =>
		onChangeTransition({
			[`transition-status-${deviceType}`]: !value,
		});

	return !isEmpty(transition[type]) ? (
		<>
			{!transitionChangeAll && (
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
								label: __(capitalize(name), 'maxi-blocks'),
								value: name,
							}))),
					]}
					onChange={val => {
						maxiSetAttributes({
							[`transition-${type}-selected`]: val,
						});
					}}
				/>
			)}
			{selected && selected !== 'none' && (
				<ResponsiveTabsControl breakpoint={deviceType}>
					<>
						<ToggleSwitch
							label={__('Disable transition', 'maxi-blocks')}
							selected={!transitionStatus}
							onChange={onChangeSwitch}
						/>
						{transitionStatus && (
							<TransitionControl
								{...getGroupAttributes(
									attributes,
									'transition'
								)}
								onChange={onChangeTransition}
								getDefaultTransitionAttribute={
									getDefaultTransitionAttribute
								}
								transition={selectedTransition}
								breakpoint={deviceType}
								type={type}
							/>
						)}
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
	const { attributes, deviceType, maxiSetAttributes } = props;
	const {
		transition: rawTransition,
		'transition-change-all': transitionChangeAll,
	} = attributes;

	const transition = cloneDeep(rawTransition);

	Object.keys(transition).forEach(type => {
		Object.keys(transition[type]).forEach(key => {
			if (
				transition[type][key]?.hoverProp &&
				!attributes[transition[type][key].hoverProp]
			)
				delete transition[type][key];
		});
	});

	const availableType = isEmpty(transition?.block) ? 'canvas' : 'block';
	const selected = attributes[`transition-${availableType}-selected`];

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
			) : (
				<>
					<ToggleSwitch
						label={__('Change all transitions', 'maxi-blocks')}
						selected={transitionChangeAll}
						onChange={val =>
							maxiSetAttributes({
								'transition-change-all': val,
								// Set as selected first transition from type if no transition is selected
								...(selected === 'none' && {
									[`transition-${availableType}-selected`]:
										Object.keys(
											transition?.[availableType]
										)[0],
								}),
							})
						}
					/>
					{!isEmpty(rawTransition.block) &&
					!isEmpty(rawTransition.canvas) &&
					!transitionChangeAll ? (
						<SettingTabsControl
							breakpoint={deviceType}
							items={[
								{
									label: __('Block', 'maxi-blocks'),
									content: (
										<TransitionControlWrapper
											type='block'
											transition={transition}
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
											transition={transition}
											{...props}
										/>
									),
									ignoreIndicator,
								},
							]}
						/>
					) : (
						<TransitionControlWrapper
							type={availableType}
							transition={transition}
							isOneType
							{...props}
						/>
					)}
				</>
			),
		ignoreIndicator,
	};
};

export default transition;
