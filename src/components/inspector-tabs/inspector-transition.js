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
import TransitionControl from '../transition-control';
import {
	getGroupAttributes,
	getDefaultAttribute,
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
		allAttributes: attributes,
		deviceType,
		maxiSetAttributes,
		type,
		isOneType,
	} = props;
	const { transition: rawTransition } = attributes;
	console.log(rawTransition);
	const transition = cloneDeep(rawTransition);

	Object.keys(transition[type]).forEach(key => {
		if (
			transition[type][key]?.hoverProp &&
			!attributes[transition[type][key].hoverProp]
		)
			delete transition[type][key];
	});

	const selected = attributes[`transition-${type}-selected`] || 'none';

	const defaultTransition = getDefaultAttribute('transition')[type][selected];
	const selectedTransition = transition[type][selected];

	const getDefaultTransitionAttribute = prop =>
		defaultTransition[`${prop}-${deviceType}`];

	const onChangeTransition = obj => {
		const newObj = {
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

		maxiSetAttributes(newObj);

		return newObj;
	};
	console.log(transition, type);
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
			{selected && selected !== 'none' && (
				<ResponsiveTabsControl breakpoint={deviceType}>
					<TransitionControl
						{...getGroupAttributes(attributes, 'transition')}
						onChange={onChangeTransition}
						getDefaultTransitionAttribute={
							getDefaultTransitionAttribute
						}
						transition={selectedTransition}
						breakpoint={deviceType}
						type={type}
					/>
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
	const { attributes, deviceType, ...rest } = props;
	const { transition } = attributes;

	const ignoreIndicator = [
		'transition-block-selected',
		'transition-canvas-selected',
	];
	console.log(
		transition,
		isEmpty(transition.block),
		isEmpty(transition.canvas),
		isEmpty(transition.block) && isEmpty(transition.canvas)
	);
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
									{...getGroupAttributes(
										attributes,
										'transition'
									)}
									type='block'
									{...rest}
									deviceType={deviceType}
									allAttributes={attributes}
								/>
							),
							ignoreIndicator,
						},
						{
							label: __('Canvas', 'maxi-blocks'),
							content: (
								<TransitionControlWrapper
									{...getGroupAttributes(
										attributes,
										'transition'
									)}
									type='canvas'
									{...rest}
									deviceType={deviceType}
									allAttributes={attributes}
								/>
							),
							ignoreIndicator,
						},
					]}
				/>
			) : (
				<TransitionControlWrapper
					{...getGroupAttributes(attributes, 'transition')}
					type='canvas'
					isOneType
					{...rest}
					deviceType={deviceType}
					allAttributes={attributes}
				/>
			),
		ignoreIndicator,
	};
};

export default transition;
