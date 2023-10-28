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
import { acfFieldTypes } from '../../../extensions/DC/constants';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const ACFSettingsControl = props => {
	const { dynamicContent, onChange, contentType } = props;
	const { acfGroup: group, field } = dynamicContent;

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

			if (!isEmpty(options)) {
				if (!options.find(option => option.value === field))
					onChange({
						'dc-acf-group': options[0].value,
					});

				setGroupOptions(options);
			} else {
				setGroupOptions([
					{
						label: 'No groups found',
						value: '',
					},
				]);
			}
		});
	}, []);

	useEffect(() => {
		getACFGroupFields(group).then(fields => {
			const options = fields
				.filter(field =>
					acfFieldTypes[contentType].includes(field.type)
				)
				.map(field => {
					return {
						label: field.title,
						value: field.id,
						type: field.type,
					};
				});

			if (!isEmpty(options)) {
				if (!options.find(option => option.value === field))
					onChange({
						'dc-field': options[0].value,
						'dc-acf-field-type': options[0].type,
					});

				setFieldsOptions(options);
			} else {
				// In case we receive fields but none of them are suitable for the current content type
				if (!isEmpty(fields)) {
					setFieldsOptions([
						{
							label: 'No suitable fields found',
							value: '',
						},
					]);
				}

				setFieldsOptions([
					{
						label: 'No fields found',
						value: '',
					},
				]);
			}
		});
	}, [group]);

	return (
		<>
			<SelectControl
				label='ACF Group'
				value={group}
				options={groupOptions}
				onChange={value =>
					onChange({
						'dc-acf-group': value,
					})
				}
			/>
			<SelectControl
				label='ACF Field'
				value={field}
				options={fieldsOptions}
				onChange={value =>
					onChange({
						'dc-field': value,
						'dc-acf-field-type': fieldsOptions.find(
							option => option.value === value
						).type,
					})
				}
			/>
		</>
	);
};

export default ACFSettingsControl;
