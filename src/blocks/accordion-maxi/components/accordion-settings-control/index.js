/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	ToggleSwitch,
	SelectControl,
} from '@components';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';

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

	const spacingMinMaxSettings = {
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
						__nextHasNoMarginBottom
						label={__('Accordion layout', 'maxi-blocks')}
						value={accordionLayout}
						options={[
							{ label: 'Simple', value: 'simple' },
							{ label: 'Boxed', value: 'boxed' },
						]}
						onChange={val => onChange({ accordionLayout: val })}
					/>
					<ToggleSwitch
						label={__('Collapsible', 'maxi-blocks')}
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
							'maxi-blocks'
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
					minMaxSettings={spacingMinMaxSettings}
					value={getLastBreakpointAttribute({
						target: 'row-gap',
						breakpoint,
						attributes: props,
					})}
					unit={getLastBreakpointAttribute({
						target: 'row-gap-unit',
						breakpoint,
						attributes: props,
					})}
					enableUnit
					allowedUnits={['px', 'em', 'vh']}
					onChangeValue={(val, inline) => {
						onChange({
							[`row-gap-${breakpoint}`]:
								val !== undefined ? val : '',
							meta: {
								inline,
							},
						});
					}}
					onChangeUnit={val => {
						onChange({
							[`row-gap-unit-${breakpoint}`]: val,
						});
					}}
					onReset={() =>
						onChange({
							[`row-gap-${breakpoint}`]: getDefaultAttribute(
								`row-gap-${breakpoint}`
							),
							isReset: true,
						})
					}
				/>
			)}
			<AdvancedNumberControl
				label={__('Animation duration', 'maxi-blocks')}
				min={0}
				max={10}
				step={0.1}
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
						isReset: true,
					})
				}
			/>
		</>
	);
};
export default AccordionSettings;
