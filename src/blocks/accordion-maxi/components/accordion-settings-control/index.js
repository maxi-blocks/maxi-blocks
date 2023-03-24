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
} from '../../../../components';
import {
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

const AccordionSettings = props => {
	const { onChange, breakpoint, clientId } = props;

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
						label={__('Accordion layout', 'maxi-blocks')}
						value={getAttributesValue({
							target: 'accordionLayout',
							props,
						})}
						options={[
							{ label: 'Simple', value: 'simple' },
							{ label: 'Boxed', value: 'boxed' },
						]}
						onChange={val => onChange({ accordionLayout: val })}
					/>
					<ToggleSwitch
						label={__('Collapsible', 'maxi-block')}
						selected={getAttributesValue({
							target: 'isCollapsible',
							props,
						})}
						onChange={val =>
							onChange({
								[getAttributeKey('isCollapsible')]: val,
							})
						}
					/>
					<ToggleSwitch
						label={__(
							'Pane closes when another opens',
							'maxi-block'
						)}
						selected={getAttributesValue({
							target: 'autoPaneClose',
							props,
						})}
						onChange={val =>
							onChange({
								[getAttributeKey('autoPaneClose')]: val,
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
					onChangeValue={val => {
						onChange({
							[getAttributeKey(
								'row-gap',
								false,
								false,
								breakpoint
							)]: val !== undefined ? val : '',
						});
					}}
					onChangeUnit={val => {
						onChange({
							[`row-gap-unit-${breakpoint}`]: val,
						});
					}}
					onReset={() =>
						onChange({
							[getAttributeKey(
								'row-gap',
								false,
								false,
								breakpoint
							)]: getDefaultAttribute(
								getAttributeKey(
									'row-gap',
									false,
									false,
									breakpoint
								)
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
				value={getAttributesValue({
					target: 'animationDuration',
					props,
				})}
				onChangeValue={val => {
					onChange({
						[getAttributeKey('animationDuration')]:
							val !== undefined ? val : '',
					});
				}}
				onReset={() =>
					onChange({
						[getAttributeKey('animationDuration')]:
							getDefaultAttribute(
								getAttributeKey('animationDuration')
							),
						isReset: true,
					})
				}
			/>
		</>
	);
};
export default AccordionSettings;
