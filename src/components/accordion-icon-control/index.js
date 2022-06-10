/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SelectControl } from '..';
import MaxiModal from '../../editor/library/modal';

const AccordionIconSettings = props => {
	const { onChange, blockStyle } = props;

	return (
		<>
			<SelectControl
				label={__('Icon position', 'maxi-blocks')}
				options={[
					{
						label: 'Right',
						value: 'right',
					},
					{
						label: 'Left',
						value: 'left',
					},
				]}
				value={props['icon-position']}
				onChange={val =>
					onChange({
						'icon-position': val,
					})
				}
			/>
			<MaxiModal
				type='accordion-icon'
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={props['icon-content']}
				label='Icon'
			/>
			<MaxiModal
				type='accordion-icon-active'
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={props['icon-content-active']}
				label='Icon Active'
			/>
		</>
	);
};
export default AccordionIconSettings;
