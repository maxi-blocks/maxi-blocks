/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import InfoBox from '../info-box';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getAttributesValue,
} from '../../extensions/attributes';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

/**
 * Component
 */
const ArrowControl = props => {
	const { className, onChange, isFullWidth, breakpoint = 'general' } = props;
	const [isFirstOnHierarchy, backgroundLayers] = getAttributesValue({
		target: ['_ioh', 'b_ly'],
		props,
	});
	const arrowStatus = getLastBreakpointAttribute({
		target: 'a.s',
		breakpoint,
		attributes: props,
	});

	const classes = classnames('maxi-arrow-control', className);

	const getOptions = () => {
		let response = [
			{ label: __('Top', 'maxi-blocks'), value: 'top' },
			{ label: __('Bottom', 'maxi-blocks'), value: 'bottom' },
		];

		if (!isFirstOnHierarchy || isFullWidth === 'normal')
			response = response.concat([
				{ label: __('Right', 'maxi-blocks'), value: 'right' },
				{ label: __('Left', 'maxi-blocks'), value: 'left' },
			]);

		return response;
	};

	const onChangeValue = (target, value) =>
		onChange({ [`${target}-${breakpoint}`]: value });

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 999,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const isBackgroundColor = !isEmpty(backgroundLayers)
		? backgroundLayers.some(layer => layer.type === 'color')
		: false;

	return (
		<div className={classes}>
			{!isBackgroundColor && (
				<InfoBox
					message={__(
						'Please set a background colour layer to see the arrow.',
						'maxi-blocks'
					)}
					links={[
						{
							title: __('Background colour', 'maxi-blocks'),
							panel: 'background layer',
						},
					]}
				/>
			)}
			{arrowStatus &&
				getAttributesValue({
					target: 'show-warning-box',
					props,
				}) && (
					<InfoBox
						message={__(
							'Please ensure that the background color is not the same as the page background color.'
						)}
						onClose={() => onChange({ 'show-warning-box': false })}
					/>
				)}
			<ToggleSwitch
				label={__('Show arrow on boundary', 'maxi-blocks')}
				selected={arrowStatus}
				onChange={val => onChange({ [`a.s-${breakpoint}`]: val })}
			/>
			{arrowStatus && (
				<>
					<SettingTabsControl
						label=''
						type='buttons'
						fullWidthMode
						selected={getLastBreakpointAttribute({
							target: 'a.sid',
							breakpoint,
							attributes: props,
						})}
						items={getOptions()}
						onChange={val =>
							onChange({ [`a.sid-${breakpoint}`]: val })
						}
					/>
					<AdvancedNumberControl
						label={__('Position', 'maxi-blocks')}
						value={getLastBreakpointAttribute({
							target: 'a.pos',
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val => {
							onChangeValue(
								'a.pos',
								val !== undefined && val !== '' ? val : ''
							);
						}}
						min={0}
						max={100}
						onReset={() =>
							onChange({
								[`a.pos-${breakpoint}`]: getDefaultAttribute(
									`a.pos-${breakpoint}`
								),
								isReset: true,
							})
						}
						initialPosition={getDefaultAttribute(
							`a.pos-${breakpoint}`
						)}
					/>
					<AdvancedNumberControl
						label={__('Arrow size', 'maxi-blocks')}
						value={getLastBreakpointAttribute({
							target: 'a.w',
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val => {
							const value = isNil(val)
								? getDefaultAttribute(`a.w-${breakpoint}`)
								: val;

							onChangeValue('a.w', value);
						}}
						onReset={() =>
							onChange({
								[`a.w-${breakpoint}`]: getDefaultAttribute(
									`a.w-${breakpoint}`
								),
								isReset: true,
							})
						}
						minMaxSettings={minMaxSettings}
					/>
				</>
			)}
		</div>
	);
};

export default ArrowControl;
