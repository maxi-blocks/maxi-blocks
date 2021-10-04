/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import FancyRadioControl from '../fancy-radio-control';
import ToggleSwitch from '../toggle-switch';
import InfoBox from '../info-box';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Component
 */
const getIsBackgroundColor = props => {
	const bgLayersStatus = Object.entries(props).some(([key, val]) => {
		if (key.includes('background-layers-status')) return !!val;

		return false;
	});

	if (bgLayersStatus) return false;

	// eslint-disable-next-line consistent-return
	const activeMedias = Object.entries(props).filter(([key, val]) => {
		if (key.includes('background-active-media')) return val === 'color';

		return false;
	});
	const isBackgroundColor =
		activeMedias.length > 0 &&
		activeMedias.every(activeMedia => activeMedia[1] === 'color');

	return isBackgroundColor;
};

const ArrowControl = props => {
	const {
		className,
		onChange,
		isFullWidth,
		breakpoint = 'general',
		isFirstOnHierarchy,
	} = props;

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

	const isBackgroundColor = getIsBackgroundColor(props);

	return (
		<div className={classes}>
			{!isBackgroundColor && (
				<InfoBox
					message={__(
						'Please set background colour to see the arrow.',
						'maxi-blocks'
					)}
					links={[
						{
							title: __('Background colour', 'maxi-blocks'),
							panel: 'background',
						},
					]}
				/>
			)}
			<ToggleSwitch
				label={__('Show Arrow', 'maxi-blocks')}
				selected={props['arrow-status']}
				onChange={val => onChange({ 'arrow-status': val })}
			/>
			{props['arrow-status'] && (
				<>
					<FancyRadioControl
						label=''
						selected={getLastBreakpointAttribute(
							'arrow-side',
							breakpoint,
							props
						)}
						options={getOptions()}
						optionType='string'
						onChange={val =>
							onChange({ [`arrow-side-${breakpoint}`]: val })
						}
					/>
					<AdvancedNumberControl
						label={__('Position', 'maxi-blocks')}
						value={getLastBreakpointAttribute(
							'arrow-position',
							breakpoint,
							props
						)}
						onChangeValue={val => {
							onChangeValue(
								'arrow-position',
								val !== undefined && val !== '' ? val : ''
							);
						}}
						min={0}
						max={100}
						onReset={() =>
							onChangeValue(
								'arrow-position',
								getDefaultAttribute(
									`arrow-position-${breakpoint}`
								)
							)
						}
						initialPosition={getDefaultAttribute(
							`arrow-position-${breakpoint}`
						)}
					/>
					<AdvancedNumberControl
						label={__('Arrow Size', 'maxi-blocks')}
						value={getLastBreakpointAttribute(
							'arrow-width',
							breakpoint,
							props
						)}
						onChangeValue={val => {
							const value = isNil(val)
								? getDefaultAttribute(
										`arrow-width-${breakpoint}`
								  )
								: val;

							onChangeValue('arrow-width', value);
						}}
						onReset={() =>
							onChangeValue(
								'arrow-width',
								getDefaultAttribute(`arrow-width-${breakpoint}`)
							)
						}
						minMaxSettings={minMaxSettings}
					/>
				</>
			)}
		</div>
	);
};

export default ArrowControl;
