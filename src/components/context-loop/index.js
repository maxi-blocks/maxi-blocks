/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useCallback,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';
import { resolveSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import SelectControl from '../select-control';
import ToggleSwitch from '../toggle-switch';
import { getDefaultAttribute } from '../../extensions/styles';
import {
	orderByRelations,
	orderByOptions,
	orderOptions,
	orderRelations,
	orderTypes,
	relationOptions,
	relationTypes,
	typeOptions,
} from '../../extensions/DC/constants';
import {
	getCLAttributes,
	getDCOptions,
	LoopContext,
} from '../../extensions/DC';
import { validationsValues } from '../../extensions/DC/utils';
import {
	ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP,
	ALLOWED_ACCUMULATOR_GRANDPARENT_GRANDCHILD_MAP,
} from '../../extensions/DC/withMaxiContextLoop';

/**
 * External dependencies
 */
import { capitalize, isEmpty, isEqual, isNil } from 'lodash';
import classnames from 'classnames';

const ContextLoop = props => {
	const { clientId, className, onChange, contentType = 'group' } = props;

	const { contextLoop } = useContext(LoopContext);

	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [postIdOptions, setPostIdOptions] = useState(null);

	const classes = classnames('maxi-context-loop', className);

	const {
		'cl-status': status,
		'cl-type': type,
		'cl-relation': relation,
		'cl-id': id,
		'cl-field': field,
		'cl-author': author,
		'cl-order-by': orderBy,
		'cl-order': order,
		'cl-accumulator': accumulator,
		'cl-grandchild-accumulator': grandchildAccumulator = false,
	} = getCLAttributes(contextLoop);

	const isTypeHasRelations =
		relationTypes.includes(type) &&
		!!relationOptions?.[contentType]?.[type];

	const isOrderSettings =
		orderTypes.includes(type) && orderRelations.includes(relation);

	const changeProps = (params, alwaysSaveCLStatus = false) => {
		const hasChangesToSave = Object.entries(contextLoop).some(
			([key, val]) => {
				if (alwaysSaveCLStatus && key === 'cl-status') return true;

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

				changeProps({ 'cl-author': id });
			}
		}

		// Sets new content
		if (status && isTypeHasRelations) {
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
				contentType,
				true
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
				label={__('Use context loop', 'maxi-blocks')}
				selected={status}
				onChange={value => changeProps({ 'cl-status': value })}
			/>
			{status && (
				<>
					{isOrderSettings &&
						Object.keys(
							ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP
						).includes(
							select('core/block-editor').getBlockName(clientId)
						) &&
						!isEmpty(
							select(
								'core/block-editor'
							).getBlockParentsByBlockName(
								clientId,
								Object.keys(
									ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP
								)
							)
						) &&
						contextLoop.prevContextLoopStatus && (
							<ToggleSwitch
								label={__(
									'Stop accumulator inheritance',
									'maxi-blocks'
								)}
								selected={props['cl-status']}
								onChange={value =>
									changeProps(
										{
											'cl-status': value || undefined,
										},
										true
									)
								}
							/>
						)}
					<SelectControl
						label={__('Type', 'maxi-blocks')}
						value={type}
						options={typeOptions[contentType]}
						newStyle
						onChange={value => {
							const validatedAttributes = validationsValues(
								value,
								field,
								relation,
								contentType,
								'wp',
								true
							);

							changeProps({
								'cl-type': value,
								...validatedAttributes,
							});
						}}
						onReset={() =>
							changeProps({
								'cl-type': getDefaultAttribute('cl-type'),
							})
						}
					/>
					{isEmpty(postIdOptions) &&
					type !== 'settings' &&
					relationOptions?.[contentType] !== null ? (
						<p>{__('This type is empty', 'maxi-blocks')}</p>
					) : (
						<>
							{isTypeHasRelations && (
								<SelectControl
									label={__('Relation', 'maxi-blocks')}
									value={relation}
									options={relationOptions[contentType][type]}
									onChange={value =>
										changeProps({
											'cl-relation': value,
										})
									}
									onReset={() =>
										changeProps({
											'cl-relation':
												getDefaultAttribute(
													'cl-relation'
												),
										})
									}
								/>
							)}
							{contentType !== 'container' &&
								relationTypes.includes(type) &&
								type === 'users' && (
									<SelectControl
										label={__('Author ID', 'maxi-blocks')}
										value={author}
										options={postAuthorOptions}
										onChange={value =>
											changeProps({
												'cl-author': Number(value),
											})
										}
										onReset={() =>
											changeProps({
												'cl-author':
													getDefaultAttribute(
														'cl-author'
													),
											})
										}
									/>
								)}

							{relationTypes.includes(type) &&
								type !== 'users' &&
								(orderByRelations.includes(relation) ||
									relation === 'by-id') && (
									<SelectControl
										label={__(
											`${capitalize(
												orderByRelations.includes(
													relation
												)
													? relation.replace(
															'by-',
															''
													  )
													: type
											)} ID`,
											'maxi-blocks'
										)}
										value={id}
										options={postIdOptions}
										onChange={value =>
											changeProps({
												'cl-id': Number(value),
											})
										}
										onReset={() =>
											changeProps({
												'cl-id': postIdOptions[0].value,
											})
										}
									/>
								)}
							{isOrderSettings && (
								<>
									{orderByRelations.includes(relation) && (
										<SelectControl
											label={__(
												'Order by',
												'maxi-blocks'
											)}
											value={orderBy}
											options={orderByOptions}
											onChange={value =>
												changeProps({
													'cl-order-by': value,
												})
											}
											onReset={() =>
												changeProps({
													'cl-order-by':
														getDefaultAttribute(
															'cl-order-by'
														),
												})
											}
										/>
									)}
									<SelectControl
										label={__('Order', 'maxi-blocks')}
										value={order}
										options={
											orderOptions[
												orderByRelations.includes(
													relation
												)
													? orderBy
													: relation
											]
										}
										onChange={value =>
											changeProps({
												'cl-order': value,
											})
										}
										onReset={() =>
											changeProps({
												'cl-order':
													getDefaultAttribute(
														'cl-order'
													),
											})
										}
									/>
									<AdvancedNumberControl
										label={__('Accumulator', 'maxi-blocks')}
										value={accumulator}
										onChangeValue={value =>
											changeProps({
												'cl-accumulator': value,
											})
										}
										onReset={() =>
											changeProps({
												'cl-accumulator':
													getDefaultAttribute(
														'cl-accumulator'
													),
											})
										}
										disableRange
									/>
									{Object.keys(
										ALLOWED_ACCUMULATOR_GRANDPARENT_GRANDCHILD_MAP
									).includes(
										select(
											'core/block-editor'
										).getBlockName(clientId)
									) && (
										<ToggleSwitch
											label={__(
												'Enable for grandchildren blocks',
												'maxi-blocks'
											)}
											selected={grandchildAccumulator}
											onChange={value =>
												changeProps({
													'cl-grandchild-accumulator':
														value,
												})
											}
										/>
									)}
								</>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default ContextLoop;
