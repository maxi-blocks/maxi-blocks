/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';

const AccordionSettings = props => {
	const { accordionLayout, clientId, onChange } = props;
	return (
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
						select('core/block-editor').getBlockName(block) ===
						'maxi-blocks/pane-maxi'
					) {
						dispatch('core/block-editor').updateBlockAttributes(
							block,
							{ accordionLayout: val }
						);
					}
				});

				onChange({ accordionLayout: val });
			}}
		/>
	);
};
export default AccordionSettings;
