/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useCallback } from '@wordpress/element';
import { resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import SelectControl from '../select-control';
import ToggleSwitch from '../toggle-switch';
import { validationsValues } from '../../extensions/DC/utils';
import {
	typeOptions,
	fieldOptions,
	relationOptions,
	relationTypes,
	limitOptions,
	limitTypes,
	limitFields,
} from '../../extensions/DC/constants';
import getDCOptions from '../../extensions/DC/getDCOptions';
import DateFormatting from './custom-date-formatting';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty, isFinite, isNil, capitalize, isEqual } from 'lodash';
import classnames from 'classnames';

/**
 * Dynamic Content
 */

const DynamicContent = props => {
	const {
		className,
		onChange,
		allowCustomDate = false,
		contentType = 'text',
		...dynamicContent
	} = props;

	const classes = classnames('maxi-dynamic-content', className);

	const {
		'dc-status': status,
		'dc-type': type,
		'dc-relation': relation,
		'dc-id': id,
		'dc-field': field,
		'dc-author': author,
		'dc-limit': limit,
		'dc-error': error,
	} = dynamicContent;

	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [postIdOptions, setPostIdOptions] = useState(null);

	const changeProps = params => {
		const hasChangesToSave = Object.entries(dynamicContent).some(
			([key, val]) => {
				if (!(key in params)) return false;

				return params[key] !== val;
			}
		);

		if (hasChangesToSave) onChange(params);
	};

	const fetchDcData = useCallback(async () => {
		// TODO: check if this code is necessary
		// On init, get post author options and set current user as default
		if (!postAuthorOptions) {
			const authors = await resolveSelect('core').getUsers({
				who: 'authors',
			});

			if (authors) {
				setPostAuthorOptions(
					authors.map(({ id, name }) => ({
						label: `${id} - ${name}`,
						value: id,
					}))
				);

				const { id } = await resolveSelect('core').getCurrentUser();

				changeProps({ 'dc-author': id });
			}
		}

		// Sets new content
		if (status && relationTypes.includes(type)) {
			const dataRequest = {
				type,
				id,
				field,
				postIdOptions,
				relation,
				author,
			};

			const postIDSettings = await getDCOptions(
				dataRequest,
				postIdOptions,
				contentType
			);

			if (postIDSettings) {
				const { newValues, newPostIdOptions } = postIDSettings;

				changeProps(newValues);

				if (
					!isNil(newPostIdOptions) &&
					!isEqual(postIdOptions, newPostIdOptions)
				)
					setPostIdOptions(newPostIdOptions);
			}
		}
	});

	useEffect(() => {
		fetchDcData().catch(console.error);
	}, [fetchDcData]);

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Use dynamic content', 'maxi-blocks')}
				selected={status}
				onChange={value => changeProps({ 'dc-status': value })}
			/>
			{status && (
				<>
					<SelectControl
						label={__('Type', 'maxi-blocks')}
						value={type}
						options={typeOptions[contentType]}
						onChange={value => {
							const dcFieldActual = validationsValues(
								value,
								field,
								contentType
							);

							changeProps({
								'dc-type': value,
								'dc-show': 'current',
								'dc-error': '',
								...dcFieldActual,
							});
						}}
					/>
					{isEmpty(postIdOptions) && type !== 'settings' ? (
						<p>{__('This type is empty', 'maxi-blocks')}</p>
					) : (
						<>
							{relationTypes.includes(type) && (
								<SelectControl
									label={__('Relation', 'maxi-blocks')}
									value={relation}
									options={relationOptions[contentType][type]}
									onChange={value =>
										changeProps({
											'dc-relation': value,
											'dc-show': 'current',
											'dc-error': '',
										})
									}
								/>
							)}
							{relationTypes.includes(type) &&
								type === 'users' && (
									<SelectControl
										label={__('Author id', 'maxi-blocks')}
										value={author}
										options={postAuthorOptions}
										onChange={value =>
											changeProps({
												'dc-author': Number(value),
											})
										}
									/>
								)}
							{relationTypes.includes(type) &&
								type !== 'users' &&
								['author', 'by-id'].includes(relation) && (
									<SelectControl
										label={__(
											`${capitalize(type)} id`,
											'maxi-blocks'
										)}
										value={id}
										options={postIdOptions}
										onChange={value =>
											changeProps({
												'dc-error': '',
												'dc-show': 'current',
												'dc-id': Number(value),
											})
										}
									/>
								)}
							{(['settings'].includes(type) ||
								(relation === 'by-id' && isFinite(id)) ||
								(relation === 'author' &&
									!isEmpty(postIdOptions)) ||
								['date', 'modified', 'random'].includes(
									relation
								)) && (
								<SelectControl
									label={__('Field', 'maxi-blocks')}
									value={field}
									options={fieldOptions[contentType][type]}
									onChange={value =>
										changeProps({
											'dc-field': value,
										})
									}
								/>
							)}
							{limitTypes.includes(type) &&
								limitFields.includes(field) &&
								!error && (
									<AdvancedNumberControl
										label={__(
											'Character limit',
											'maxi-blocks'
										)}
										value={limit}
										onChangeValue={value =>
											changeProps({
												'dc-limit': Number(value),
											})
										}
										disableReset={limitOptions.disableReset}
										step={limitOptions.steps}
										withInputField={
											limitOptions.withInputField
										}
										onReset={() =>
											changeProps({
												'dc-limit':
													getDefaultAttribute(
														'dc-limit'
													),
											})
										}
										min={limitOptions.min}
										max={limitOptions.max}
										initialPosition={
											limit || limitOptions.defaultValue
										}
									/>
								)}
							{field === 'date' && !error && (
								<DateFormatting
									allowCustomDate={allowCustomDate}
									onChange={obj => changeProps(obj)}
									{...dynamicContent}
								/>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default DynamicContent;
