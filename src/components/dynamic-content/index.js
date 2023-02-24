/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
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
} from '../../extensions/DC/constants';
import getDCOptions from '../../extensions/DC/getDCOptions';
import DateFormatting from './custom-date-formatting';

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
		...dynamicContent
	} = props;

	const classes = classnames('maxi-dynamic-content', className);

	const { 'dc-content': content, 'dc-custom-date': isCustomDate } =
		dynamicContent;

	const [status, setStatus] = useState(dynamicContent['dc-status']);
	const [type, setType] = useState(dynamicContent['dc-type']);
	const [relation, setRelation] = useState(dynamicContent['dc-relation']);
	const [id, setId] = useState(dynamicContent['dc-id']);
	const [field, setField] = useState(dynamicContent['dc-field']);
	const [author, setAuthor] = useState(dynamicContent['dc-author']);
	const [show, setShow] = useState(dynamicContent['dc-show']);
	const [limit, setLimit] = useState(dynamicContent['dc-limit']);
	const [error, setError] = useState(dynamicContent['dc-error']);

	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [postIdOptions, setPostIdOptions] = useState(null);

	const updateState = params => {
		const paramFn = {
			'dc-status': setStatus,
			'dc-type': setType,
			'dc-relation': setRelation,
			'dc-id': setId,
			'dc-field': setField,
			'dc-author': setAuthor,
			'dc-show': setShow,
			'dc-limit': setLimit,
			'dc-error': setError,
		};
		const paramValues = {
			'dc-status': status,
			'dc-type': type,
			'dc-relation': relation,
			'dc-id': id,
			'dc-field': field,
			'dc-author': author,
			'dc-show': show,
			'dc-limit': limit,
			'dc-error': error,
		};

		Object.entries(params).forEach(([key, val]) => {
			if (paramFn[key] && paramValues[key] !== val) paramFn[key](val);
		});
	};

	const changeProps = (params, updateStates = true) => {
		if (params && updateStates) updateState(params);

		const newProps = {
			'dc-status': status,
			'dc-type': type,
			'dc-relation': relation,
			'dc-id': id,
			'dc-field': field,
			'dc-author': author,
			'dc-show': show,
			'dc-limit': limit,
			'dc-error': error,
			'dc-content': content,
			'dc-custom-date': isCustomDate,
			...params,
		};

		const hasChangesToSave = Object.entries(dynamicContent).some(
			([key, val]) => {
				if (!(key in newProps)) return false;

				return newProps[key] !== val;
			}
		);

		if (hasChangesToSave) onChange(newProps);
	};

	useEffect(async () => {
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

				updateState({ 'dc-author': id });
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
				postIdOptions
			);

			if (postIDSettings) {
				const { newValues, newPostIdOptions } = postIDSettings;

				changeProps(newValues);

				if (
					!isNil(newPostIdOptions) &&
					!isEqual(postIdOptions, newPostIdOptions)
				)
					setPostIdOptions(newPostIdOptions);
			} else changeProps();
		}

		return null;
	});

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Use dynamic content', 'maxi-blocks')}
				selected={status}
				onChange={value => updateState({ 'dc-status': value })}
			/>
			{status && (
				<>
					<SelectControl
						label={__('Type', 'maxi-blocks')}
						value={type}
						options={typeOptions}
						onChange={value => {
							const dcFieldActual = validationsValues(
								value,
								field
							);

							updateState({
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
									options={relationOptions[type]}
									onChange={value =>
										updateState({
											'dc-relation': value,
											'dc-show': 'current',
											'dc-error': '',
										})
									}
								/>
							)}
							{relationTypes.includes(type) && type === 'users' && (
								<SelectControl
									label={__('Author id', 'maxi-blocks')}
									value={author}
									options={postAuthorOptions}
									onChange={value =>
										updateState({
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
											updateState({
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
									options={fieldOptions[type]}
									onChange={value =>
										updateState({
											'dc-field': value,
										})
									}
								/>
							)}
							{['excerpt', 'content'].includes(field) && !error && (
								<AdvancedNumberControl
									label={__('Character limit', 'maxi-blocks')}
									value={limit}
									onChangeValue={value =>
										updateState({
											'dc-limit': Number(value),
										})
									}
									disableReset={limitOptions.disableReset}
									step={limitOptions.steps}
									withInputField={limitOptions.withInputField}
									onReset={() =>
										updateState({
											'dc-limit': Number(
												limitOptions.defaultValue ||
													'150'
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
