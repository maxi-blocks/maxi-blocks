/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import ToggleSwitch from '../toggle-switch';
import AdvancedNumberControl from '../advanced-number-control';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

const AccordionSettings = props => {
	const { accordionLayout, clientId, onChange, autoPaneClose, breakpoint } =
		props;
	return (
		<>
			{breakpoint === 'general' && (
				<SelectControl
					label={__('Accordion layout', 'maxi-blocks')}
					value={accordionLayout}
					options={[
						{ label: 'Simple', value: 'simple' },
						{ label: 'Boxed', value: 'boxed' },
					]}
					onChange={val => {
						const blocks = select(
							'core/block-editor'
						).getClientIdsOfDescendants([clientId]);

						blocks.forEach(block => {
							if (
								select('core/block-editor').getBlockName(
									block
								) === 'maxi-blocks/pane-maxi'
							) {
								dispatch(
									'core/block-editor'
								).updateBlockAttributes(block, {
									accordionLayout: val,
								});
							}
						});

						onChange({ accordionLayout: val });
					}}
				/>
			)}
			{breakpoint === 'general' && (
				<ToggleSwitch
					label={__('Pane closes when another opens', 'maxi-block')}
					selected={autoPaneClose}
					onChange={val =>
						onChange({
							autoPaneClose: val,
						})
					}
				/>
			)}
			<AdvancedNumberControl
				label={__('Spacing', 'maxi-blocks')}
				min={0}
				max={999}
				step={1}
				breakpoint={breakpoint}
				value={props[`pane-spacing-${breakpoint}`]}
				onChangeValue={val => {
					onChange({
						[`pane-spacing-${breakpoint}`]:
							val !== undefined && val !== '' ? val : '',
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
		</>
	);
};
export default AccordionSettings;
