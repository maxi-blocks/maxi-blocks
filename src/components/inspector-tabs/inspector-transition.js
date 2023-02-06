/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import InfoBox from '../info-box';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import TransitionControl from '../transition-control';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getTransitionData,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import { capitalize, cloneDeep, isArray, isEmpty } from 'lodash';

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
		transitionData,
	} = props;
	const { 'transition-change-all': transitionChangeAll } = attributes;

	const selected =
		attributes[`transition-${type}-selected`] === 'none' &&
		transitionChangeAll
			? Object.keys(transition?.[type])[0]
			: attributes[`transition-${type}-selected`];

	const selectedTransition = transition[type][selected];
	const defaultTransition = getDefaultAttribute('transition')[type][selected];

	const getDefaultTransitionAttribute = prop =>
		defaultTransition[`${prop}-${deviceType}`];

	const onChangeTransition = (obj = {}, splitMode) => {
		if (!transitionData) return null;

		const newObj = {
			transition: {},
		};

		if (transitionChangeAll) {
			Object.keys(attributes?.transition).forEach(currentType => {
				newObj.transition[currentType] = {};

				Object.keys(attributes.transition?.[currentType]).forEach(
					key => {
						newObj.transition[currentType][key] = {
							...attributes.transition[currentType][key],
							...(splitMode === 'out'
								? {
										out: {
											...attributes.transition[
												currentType
											][key].out,
											...attributes.transition[type][
												selected
											].out,
											...obj,
										},
								  }
								: {
										...attributes.transition[type][
											selected
										],
										...obj,
								  }),
						};
					}
				);
			});
		} else {
			newObj.transition = {
				...attributes?.transition,
				[type]: {
					...(attributes?.transition?.[type] || []),
					[selected]: {
						...selectedTransition,
						...(splitMode === 'out'
							? {
									out: {
										...selectedTransition.out,
										...obj,
									},
							  }
							: obj),
					},
				},
			};
		}
		maxiSetAttributes(newObj);

		return newObj;
	};

	useEffect(() => {
		if (transitionChangeAll) onChangeTransition();
	}, [transitionChangeAll]);

	const getTransitionAttributes = () => {
		return {
			...getGroupAttributes(attributes, 'transition'),
			...Object.entries(attributes).reduce((acc, [key, value]) => {
				if (key.startsWith('transition-') && key.includes('selected')) {
					acc[key] = value;
				}

				return acc;
			}),
		};
	};

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
				<TransitionControl
					{...getTransitionAttributes(attributes, 'transition')}
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
	const { attributes, deviceType, maxiSetAttributes, name } = props;
	const {
		transition: rawTransition,
		'transition-change-all': transitionChangeAll,
	} = attributes;

	const transition = cloneDeep(rawTransition);

	const transitionData = getTransitionData(name);

	Object.keys(transition).forEach(type => {
		Object.keys(transition[type]).forEach(key => {
			const hoverProp = transitionData?.[type]?.[key]?.hoverProp;
			if (!hoverProp) return;

			if (isArray(hoverProp))
				hoverProp.every(prop => !attributes[prop]) &&
					delete transition[type][key];
			else !attributes[hoverProp] && delete transition[type][key];
		});
	});

	const availableType = Object.keys(transition).filter(
		type => !isEmpty(transition[type])
	)[0];

	return {
		label,
		content: Object.values(transition).every(obj => isEmpty(obj)) ? (
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
					onChange={val => {
						maxiSetAttributes({
							'transition-change-all': val,
						});
					}}
				/>
				{Object.values(rawTransition).length > 1 &&
				Object.values(rawTransition).every(obj => !isEmpty(obj)) &&
				!transitionChangeAll ? (
					<SettingTabsControl
						breakpoint={deviceType}
						items={Object.keys(rawTransition).map(type => ({
							label: __(capitalize(type), 'maxi-blocks'),
							content: (
								<TransitionControlWrapper
									type={type}
									transition={transition}
									transitionData={transitionData}
									{...props}
								/>
							),
						}))}
					/>
				) : (
					<TransitionControlWrapper
						type={availableType}
						transition={transition}
						transitionData={transitionData}
						isOneType
						{...props}
					/>
				)}
			</>
		),
	};
};

export default transition;
