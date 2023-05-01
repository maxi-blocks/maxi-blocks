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
							target: '_acl',
							props,
						})}
						options={[
							{ label: 'Simple', value: 'simple' },
							{ label: 'Boxed', value: 'boxed' },
						]}
						onChange={val => onChange({ _acl: val })}
					/>
					<ToggleSwitch
						label={__('Collapsible', 'maxi-block')}
						selected={getAttributesValue({
							target: '_ico',
							props,
						})}
						onChange={val =>
							onChange({
								[getAttributeKey('_ico')]: val,
							})
						}
					/>
					<ToggleSwitch
						label={__(
							'Pane closes when another opens',
							'maxi-block'
						)}
						selected={getAttributesValue({
							target: '_apc',
							props,
						})}
						onChange={val =>
							onChange({
								[getAttributeKey('_apc')]: val,
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
						target: '_rg',
						breakpoint,
						attributes: props,
					})}
					unit={getLastBreakpointAttribute({
						target: '_rg.u',
						breakpoint,
						attributes: props,
					})}
					enableUnit
					allowedUnits={['px', 'em', 'vh']}
					onChangeValue={val => {
						onChange({
							[getAttributeKey('_rg', false, false, breakpoint)]:
								val !== undefined ? val : '',
						});
					}}
					onChangeUnit={val => {
						onChange({
							[`_rg.u-${breakpoint}`]: val,
						});
					}}
					onReset={() =>
						onChange({
							[getAttributeKey('_rg', false, false, breakpoint)]:
								getDefaultAttribute(
									getAttributeKey(
										'_rg',
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
					target: '_ad',
					props,
				})}
				onChangeValue={val => {
					onChange({
						[getAttributeKey('_ad')]: val !== undefined ? val : '',
					});
				}}
				onReset={() =>
					onChange({
						[getAttributeKey('_ad')]: getDefaultAttribute(
							getAttributeKey('_ad')
						),
						isReset: true,
					})
				}
			/>
		</>
	);
};
export default AccordionSettings;
