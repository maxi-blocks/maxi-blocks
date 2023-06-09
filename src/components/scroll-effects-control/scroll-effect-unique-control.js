/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import SettingTabsControl from '../setting-tabs-control';
import AdvancedNumberControl from '../advanced-number-control';
import { applyEffect } from './scroll-effect-preview';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ScrollEffectsUniqueControl = props => {
	const {
		type,
		className,
		values,
		onChange,
		breakpoint = 'g',
		uniqueID,
		isPreviewEnabled,
	} = props;

	const classes = classnames(
		'maxi-advanced-number-control maxi-scroll-unique-control',
		className
	);

	const labels = ['Start', 'Mid', 'End'];

	const getKey = label => {
		switch (label) {
			case 'Start':
				return '_sta';
			case 'Mid':
				return '.m';
			case 'End':
				return '_e';
			default:
				return label;
		}
	};
	const getSpecialLabels = (type, label) => {
		const labelLowCase = getKey(label);
		const response = {};
		switch (type) {
			case '_v':
				response.label = `${label} position (px)`;
				response.attr = `_of${labelLowCase}`;
				response.min = -4000;
				response.max = 4000;
				break;
			case '_ho':
				response.label = `${label} position (px)`;
				response.attr = `_of${labelLowCase}`;
				response.min = -4000;
				response.max = 4000;
				break;
			case '_rot':
				response.label = `${label} angle (degrees)`;
				response.attr = `_rot${labelLowCase}`;
				response.min = -360;
				response.max = 360;
				break;
			case '_sc':
				response.label = `${label} scale (%)`;
				response.attr = `_sc${labelLowCase}`;
				response.min = 0;
				response.max = 1000;
				break;
			case '_fa':
				response.label = `${label} opacity (%)`;
				response.attr = `_o${labelLowCase}`;
				response.min = 0;
				response.max = 100;
				break;
			case '_blu':
				response.label = `${label} blur (px)`;
				response.attr = `_blu${labelLowCase}`;
				response.min = 0;
				response.max = 20;
				break;

			default:
				break;
		}
		return response;
	};

	return (
		<div className={classes}>
			<SettingTabsControl
				items={labels.map(label => {
					const special = getSpecialLabels(type, label);

					return {
						label: __(`${label} zone`, 'maxi-blocks'),
						content: (
							<AdvancedNumberControl
								label={__(special?.label, 'maxi-blocks')}
								value={getLastBreakpointAttribute({
									target: `sc${type}${special?.attr}`,
									breakpoint,
									attributes: values,
								})}
								onChangeValue={val => {
									onChange({
										[`sc${type}${special?.attr}-${breakpoint}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
									isPreviewEnabled &&
										applyEffect(type, uniqueID, val);
								}}
								min={special?.min}
								step={1}
								max={special?.max}
								onReset={() => {
									onChange({
										[`sc${type}${special?.attr}-${breakpoint}`]:
											getDefaultAttribute(
												`sc${type}${special?.attr}-g`
											),
										isReset: true,
									});
									isPreviewEnabled &&
										applyEffect(
											type,
											uniqueID,
											getDefaultAttribute(
												`sc${type}${special?.attr}-g`
											)
										);
								}}
								initialPosition={getDefaultAttribute(
									`sc${type}${special?.attr}-g`
								)}
							/>
						),
					};
				})}
			/>
		</div>
	);
};

export default ScrollEffectsUniqueControl;
