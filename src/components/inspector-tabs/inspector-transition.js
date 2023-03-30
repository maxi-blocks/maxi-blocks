/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import {
	createTransitionObj,
	getTransitionData,
} from '../../extensions/attributes/transitions';
import InfoBox from '../info-box';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import TransitionControl from '../transition-control';

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
	const [transitionChangeAll, transitionTypeSelect] = getAttributesValue({
		target: ['_tca', `_t-${type}-selected`],
		props: attributes,
	});

	const selected =
		transitionTypeSelect === 'none' && transitionChangeAll
			? Object.keys(transition?.[type])[0]
			: transitionTypeSelect;

	const selectedTransition = transition[type][selected];
	const defaultTransition =
		getDefaultAttribute('_t')?.[type]?.[selected] || createTransitionObj();

	const getDefaultTransitionAttribute = prop =>
		defaultTransition[`${prop}-${deviceType}`];

	const onChangeTransition = (obj = {}, splitMode) => {
		if (!transitionData) return null;

		const newObj = {
			transition: {},
		};

		if (transitionChangeAll) {
			Object.keys(attributes?._t).forEach(currentType => {
				newObj._t[currentType] = {};

				Object.keys(attributes._t?.[currentType]).forEach(key => {
					newObj._t[currentType][key] = {
						...attributes._t[currentType][key],
						...(splitMode === 'out'
							? {
									out: {
										...attributes._t[currentType][key].out,
										...attributes._t[type][selected].out,
										...obj,
									},
							  }
							: {
									...attributes._t[type][selected],
									...obj,
							  }),
					};
				});
			});
		} else {
			newObj._t = {
				...attributes?._t,
				[type]: {
					...(attributes?._t?.[type] || []),
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
				if (key.startsWith('_t') && key.includes('selected')) {
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
						...(transitionData[type] &&
							Object.entries(transitionData[type]).reduce(
								(acc, [key, { title }]) => {
									if (!transition[type][key]) return acc;

									acc.push({
										label: __(title, 'maxi-blocks'),
										value: key,
									});

									return acc;
								},
								[]
							)),
					]}
					onChange={val => {
						maxiSetAttributes({
							[`_t${type}-selected`]: val,
						});
					}}
				/>
			)}
			{selected && selected !== 'none' && (
				<TransitionControl
					{...getTransitionAttributes(attributes, '_t')}
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
	selectors,
	label = __('Hover transition', 'maxi-blocks'),
}) => {
	const { attributes, deviceType, maxiSetAttributes, name } = props;
	const [rawTransition, transitionChangeAll] = getAttributesValue({
		target: ['_t', '_tca'],
		props: attributes,
	});

	const transition = cloneDeep(rawTransition);

	const transitionData = getTransitionData(name, selectors, attributes);

	Object.keys(transition).forEach(type => {
		Object.keys(transition[type]).forEach(key => {
			if (!transitionData?.[type]?.[key]) return;

			const { hoverProp, isTransform = false } =
				transitionData[type][key];

			if (hoverProp) {
				if (
					(isArray(hoverProp) &&
						hoverProp.every(
							prop =>
								!getAttributesValue({
									target: prop,
									props: attributes,
								})
						)) ||
					!getAttributesValue({
						target: hoverProp,
						props: attributes,
					})
				)
					delete transition[type][key];
			}

			if (
				isTransform &&
				['_sc', '_rot', '_tr', '_ori'].every(
					prop =>
						!getLastBreakpointAttribute({
							target: `_t${prop}`,
							breakpoint: deviceType,
							attributes,
							keys: [key.replace('transform ', ''), '.sh'],
						})
				)
			)
				delete transition[type][key];
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
							_tca: val,
						});
					}}
				/>
				{Object.values(rawTransition).length > 1 &&
				Object.values(rawTransition).every(obj => !isEmpty(obj)) &&
				!transitionChangeAll ? (
					<SettingTabsControl
						breakpoint={deviceType}
						items={Object.keys(rawTransition).map(type => ({
							label: __(
								capitalize(
									// For blocks that don't have a `canvas` tab, the block's transition attributes are in `transition.canvas`.
									// To avoid confusion with labeling, display the `block` instead of the `canvas`
									// if the `block` transition attribute is missing.
									type === 'canvas' &&
										!Object.keys(rawTransition).includes(
											'block'
										)
										? 'block'
										: type
								),
								'maxi-blocks'
							),
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
