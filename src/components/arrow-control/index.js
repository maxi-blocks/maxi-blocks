/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import FancyRadioControl from '../fancy-radio-control';
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

	const simpleBackgroundColorStatus =
		!props['background-layers-status'] &&
		props['background-active-media'] !== 'color';

	// Checks if border is active on some responsive stage
	const isBorderActive = Object.entries(props).some(([key, val]) => {
		if (key.includes('border-style') && !isNil(val) && val !== 'none')
			return true;

		return false;
	});
	// Checks if all border styles are 'solid' or 'none'
	const isCorrectBorder = Object.entries(props).every(([key, val]) => {
		if (key.includes('border-style')) {
			if (
				key === 'border-style-general' &&
				val !== 'solid' &&
				val !== 'none'
			)
				return false;

			if (!isNil(val) && val !== 'solid' && val !== 'none') return false;
		}

		return true;
	});

	return (
		<div className={classes}>
			{simpleBackgroundColorStatus && (
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
			{props['background-layers-status'] && (
				<InfoBox
					message={__(
						'Please disable background layers and use simple background colour to see the arrow.',
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
			{isBorderActive && !isCorrectBorder && (
				<InfoBox
					message={__(
						'Please set solid or none to all responsive border types to see the arrow.',
						'maxi-blocks'
					)}
					links={[
						{
							title: __('Border type', 'maxi-blocks'),
							panel: 'border',
						},
					]}
				/>
			)}
			<FancyRadioControl
				label={__('Show Arrow', 'maxi-blocks')}
				selected={props['arrow-status']}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
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
