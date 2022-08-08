/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	AdvancedNumberControl,
	ToggleSwitch,
	SelectControl,
} from '../../../../components';

/**
 * Internal dependencies
 */

import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

const AccordionSettings = props => {
	const {
		accordionLayout,
		onChange,
		autoPaneClose,
		isCollapsible,
		animationDuration,
		breakpoint,
		clientId,
	} = props;

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
			step: 1,
		},
		em: {
			min: 0,
			max: 99,
			step: 1,
		},
		vh: {
			min: 0,
			max: 99,
			step: 1,
		},
	};

	const showSpacing = select('core/block-editor').getBlockCount(clientId) > 1;

	return (
		<>
			{breakpoint === 'general' && (
				<>
					<SelectControl
						label={__('Accordion layout', 'maxi-blocks')}
						value={accordionLayout}
						options={[
							{ label: 'Simple', value: 'simple' },
							{ label: 'Boxed', value: 'boxed' },
						]}
						onChange={val => onChange({ accordionLayout: val })}
					/>
					<ToggleSwitch
						label={__('Collapsible', 'maxi-block')}
						selected={isCollapsible}
						onChange={val =>
							onChange({
								isCollapsible: val,
							})
						}
					/>
					<ToggleSwitch
						label={__(
							'Pane closes when another opens',
							'maxi-block'
						)}
						selected={autoPaneClose}
						onChange={val =>
							onChange({
								autoPaneClose: val,
							})
						}
					/>
				</>
			)}
			{showSpacing && (
				<AdvancedNumberControl
					label={__('Spacing', 'maxi-blocks')}
					minMaxSettings={minMaxSettings}
					value={getLastBreakpointAttribute({
						target: 'pane-spacing',
						breakpoint,
						attributes: props,
					})}
					unit={getLastBreakpointAttribute({
						target: 'pane-spacing-unit',
						breakpoint,
						attributes: props,
					})}
					enableUnit
					allowedUnits={['px', 'em', 'vh']}
					onChangeValue={val => {
						onChange({
							[`pane-spacing-${breakpoint}`]:
								val !== undefined ? val : '',
						});
					}}
					onChangeUnit={val => {
						onChange({
							[`pane-spacing-unit-${breakpoint}`]: val,
						});
					}}
					onReset={() =>
						onChange({
							[`pane-spacing-${breakpoint}`]: getDefaultAttribute(
								`pane-spacing-${breakpoint}`
							),
						})
					}
				/>
			)}
			<AdvancedNumberControl
				label={__('Animation duration (ms)', 'maxi-blocks')}
				min={0}
				max={9999}
				step={1}
				value={animationDuration}
				onChangeValue={val => {
					onChange({
						animationDuration: val !== undefined ? val : '',
					});
				}}
				onReset={() =>
					onChange({
						animationDuration:
							getDefaultAttribute('animationDuration'),
					})
				}
			/>
		</>
	);
};
export default AccordionSettings;
