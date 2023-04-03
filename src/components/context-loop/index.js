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
import { resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import ToggleSwitch from '../toggle-switch';
import {
	typeOptions,
	relationOptions,
	relationTypes,
} from '../../extensions/DC/constants';
import { getDCOptions, loopContext } from '../../extensions/DC';

/**
 * External dependencies
 */
import { isEmpty, isNil, capitalize, isEqual } from 'lodash';
import classnames from 'classnames';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * Dynamic Content
 */

const DynamicContent = props => {
	const { className, onChange, contentType = 'group' } = props;

	const { contextLoop } = useContext(loopContext);

	const classes = classnames('maxi-dynamic-content', className);

	const {
		'cl-status': status,
		'cl-type': type,
		'cl-relation': relation,
		'cl-id': id,
		'cl-field': field,
		'cl-author': author,
	} = contextLoop;

	const [postAuthorOptions, setPostAuthorOptions] = useState(null);
	const [postIdOptions, setPostIdOptions] = useState(null);

	const changeProps = params => {
		const hasChangesToSave = Object.entries(contextLoop).some(
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

				changeProps({ 'cl-author': id });
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
					<SelectControl
						label={__('Type', 'maxi-blocks')}
						value={type}
						options={typeOptions[contentType]}
						onChange={value => {
							changeProps({
								'cl-type': value,
							});
						}}
						onReset={() =>
							changeProps({
								'cl-type': getDefaultAttribute('cl-type'),
							})
						}
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
							{relationTypes.includes(type) && type === 'users' && (
								<SelectControl
									label={__('Author id', 'maxi-blocks')}
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
												'cl-id': Number(value),
											})
										}
										onReset={() =>
											changeProps({
												'cl-id':
													getDefaultAttribute(
														'cl-id'
													),
											})
										}
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
