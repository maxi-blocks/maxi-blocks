/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SelectControl from '@components/select-control';

/**
 * External dependencies
 */
import { getACFOptions } from './utils';

const ACFSettingsControl = props => {
	const {
		onChange,
		contentType,
		isCL,
		group,
		field,
		showStaticOption = false,
	} = props;
	const prefix = isCL ? 'cl-' : 'dc-';

	const [groupOptions, setGroupOptions] = useState(null);
	const [fieldsOptions, setFieldsOptions] = useState(null);

	useEffect(() => {
		getACFOptions(group, field, contentType, prefix, showStaticOption).then(
			({ validatedAttributes, groupOptions, fieldOptions }) => {
				setGroupOptions(groupOptions);
				setFieldsOptions(fieldOptions);

				onChange(validatedAttributes);
			}
		);
	}, [group, field, contentType, prefix, onChange, showStaticOption]);

	return (
		<>
			<SelectControl
				__nextHasNoMarginBottom
				label='ACF Group'
				value={group}
				options={groupOptions}
				newStyle
				onChange={value =>
					onChange({
						[`${prefix}acf-group`]: +value,
					})
				}
			/>
			{!isCL && (
				<SelectControl
					__nextHasNoMarginBottom
					label='ACF Field'
					value={field}
					options={fieldsOptions}
					newStyle
					onChange={value =>
						onChange({
							[`${prefix}field`]: value,
							[`${prefix}acf-field-type`]: fieldsOptions.find(
								option => option.value === value
							).type,
						})
					}
				/>
			)}
		</>
	);
};

export default ACFSettingsControl;
