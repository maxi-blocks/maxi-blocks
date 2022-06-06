/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';

const AccordionSettings = props => {
	const { accordionLayout, onChange } = props;
	return (
		<SelectControl
			label={__('Accordion layout', 'maxi-blocks')}
			value={accordionLayout}
			options={[
				{ label: 'Simple', value: 'simple' },
				{ label: 'Boxed', value: 'boxed' },
			]}
			onChange={val => {
				onChange({ accordionLayout: val });
			}}
		/>
	);
};
export default AccordionSettings;
