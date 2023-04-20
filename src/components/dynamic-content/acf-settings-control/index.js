/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SelectControl from '../../select-control';
import {
	getACFFieldGroups,
	getACFGroupFields,
} from '../../../extensions/DC/getACFData';

const AcfSettingsControl = props => {
	const { dynamicContent, changeProps } = props;
	const { 'dc-acf-group': group, 'dc-field': field } = dynamicContent;

	const [groupOptions, setGroupOptions] = useState(null);
	const [fieldsOptions, setFieldsOptions] = useState(null);

	useEffect(() => {
		getACFFieldGroups().then(groups => {
			const options = groups.map(group => {
				return {
					label: group.title,
					value: group.id,
				};
			});

			setGroupOptions(options);
		});
	}, []);

	useEffect(() => {
		getACFGroupFields(group).then(fields => {
			const options = fields.map(field => {
				return {
					label: field.title,
					value: field.id,
				};
			});

			if (!options.find(option => option.value === field)) {
				changeProps({
					'dc-field': options[0].value,
				});
			}

			setFieldsOptions(options);
		});
	}, [group]);

	return (
		<>
			<SelectControl
				label='ACF Group'
				value={group}
				options={groupOptions}
				onChange={value =>
					changeProps({
						'dc-acf-group': value,
					})
				}
			/>
			<SelectControl
				label='ACF Field'
				value={field}
				options={fieldsOptions}
				onChange={value =>
					changeProps({
						'dc-field': value,
					})
				}
			/>
		</>
	);
};

export default AcfSettingsControl;
