/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import SettingTabsControl from '@components/setting-tabs-control';
import ToggleSwitch from '@components/toggle-switch';
import InfoBox from '@components/info-box';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const ArrowControl = props => {
	const {
		className,
		onChange,
		isFullWidth,
		breakpoint = 'general',
		isFirstOnHierarchy,
		'background-layers': backgroundLayers,
	} = props;

	const classes = classnames('maxi-arrow-control', className);

	const getOptions = () => {
		let response = [
			{ label: __('Top', 'maxi-blocks'), value: 'top' },
			{ label: __('Bottom', 'maxi-blocks'), value: 'bottom' },
		];

		if (!isFirstOnHierarchy || !isFullWidth)
			response = response.concat([
				{ label: __('Right', 'maxi-blocks'), value: 'right' },
				{ label: __('Left', 'maxi-blocks'), value: 'left' },
			]);

		return response;
	};

	const onChangeValue = (target, value) => {
		onChange({ [`${target}-${breakpoint}`]: value });
	};

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
			{getLastBreakpointAttribute({
				target: 'arrow-status',
				breakpoint,
				attributes: props,
			}) &&
				props['show-warning-box'] && (
					<InfoBox
						message={__(
							'Please ensure that the background colour is not the same as the page background colour.',
							'maxi-blocks'
						)}
						onClose={() => onChange({ 'show-warning-box': false })}
					/>
				)}
			<ToggleSwitch
				label={__('Show arrow on boundary', 'maxi-blocks')}
				selected={getLastBreakpointAttribute({
					target: 'arrow-status',
					breakpoint,
					attributes: props,
				})}
				onChange={val =>
					onChange({ [`arrow-status-${breakpoint}`]: val })
				}
			/>
			{getLastBreakpointAttribute({
				target: 'arrow-status',
				breakpoint,
				attributes: props,
			}) && (
				<>
					<SettingTabsControl
						label=''
						type='buttons'
						fullWidthMode
						selected={getLastBreakpointAttribute({
							target: 'arrow-side',
							breakpoint,
							attributes: props,
						})}
						items={getOptions()}
						onChange={val =>
							onChange({ [`arrow-side-${breakpoint}`]: val })
						}
					/>
					<AdvancedNumberControl
						label={__('Position', 'maxi-blocks')}
						value={getLastBreakpointAttribute({
							target: 'arrow-position',
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val => {
							onChangeValue(
								'arrow-position',
								val !== undefined && val !== '' ? val : ''
							);
						}}
						min={0}
						max={100}
						onReset={() =>
							onChange({
								[`arrow-position-${breakpoint}`]:
									getDefaultAttribute(
										`arrow-position-${breakpoint}`
									),
								isReset: true,
							})
						}
						initialPosition={getDefaultAttribute(
							`arrow-position-${breakpoint}`
						)}
					/>
					<AdvancedNumberControl
						label={__('Arrow size', 'maxi-blocks')}
						value={getLastBreakpointAttribute({
							target: 'arrow-width',
							breakpoint,
							attributes: props,
						})}
						onChangeValue={val => {
							const value = isNil(val)
								? getDefaultAttribute(
										`arrow-width-${breakpoint}`
								  )
								: val;

							onChangeValue('arrow-width', value);
						}}
						onReset={() =>
							onChange({
								[`arrow-width-${breakpoint}`]:
									getDefaultAttribute(
										`arrow-width-${breakpoint}`
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
