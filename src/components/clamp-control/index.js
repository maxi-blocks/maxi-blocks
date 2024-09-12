/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';

/**
 * External dependencies
 */
import { lowerCase } from 'lodash';

const ClampControl = ({
	label,
	valueKey,
	getValue,
	getUnitValue = getValue,
	getPlaceholder = getValue,
	getDefault,
	onChangeFormat,
	prefix,
	className,
	...props
}) => {
	// TODO list:
	// 1. add min, max support in case if some of values isn't provided
	// 2. think how to add fallback
	// .hero {
	//   padding: 4rem 1rem;
	//   padding: clamp(2rem, 10vmax, 10rem) 1rem;
	// }
	// 3. add auto calculation for preferred value
	// 4. add custom field support (to write sth like: 1vw + 1vh)
	// 5. add clamp attrs generator

	const clampStatus = getPlaceholder(`${valueKey}-clamp-status`);
	const clampAutoStatus = getPlaceholder(`${valueKey}-clamp-auto-status`);

	return (
		<div className={className}>
			{clampStatus && <hr />}
			{clampStatus && (
				<>
					<AdvancedNumberControl
						label={`Minimum ${lowerCase(label)}`}
						enableUnit
						unit={getUnitValue(`${valueKey}-clamp-min-unit`)}
						defaultUnit={getDefault(`${valueKey}-clamp-min-unit`)}
						onChangeUnit={val => {
							onChangeFormat({
								[`${prefix}${valueKey}-clamp-min-unit`]: val,
							});
						}}
						placeholder={getPlaceholder(`${valueKey}-clamp-min`)}
						value={getValue(`${valueKey}-clamp-min`)}
						defaultValue={getDefault(`${valueKey}-clamp-min`)}
						onChangeValue={(val, unit) => {
							onChangeFormat({
								[`${prefix}${valueKey}-clamp-min`]: val,
								...(unit && {
									[`${prefix}${valueKey}-clamp-min-unit`]:
										unit,
								}),
							});
						}}
						onReset={() =>
							onChangeFormat(
								{
									[`${prefix}${valueKey}-clamp-min-unit`]:
										getDefault(
											`${valueKey}-clamp-min-unit`
										),
									[`${prefix}${valueKey}-clamp-min`]:
										getDefault(`${valueKey}-clamp-min`),
								},
								{ isReset: true }
							)
						}
						{...props}
					/>
					{!clampAutoStatus && (
						<AdvancedNumberControl
							label={`Preferred ${lowerCase(label)}`}
							enableUnit
							unit={getUnitValue(`${valueKey}-unit`)}
							defaultUnit={getDefault(`${valueKey}-unit`)}
							onChangeUnit={val => {
								onChangeFormat({
									[`${prefix}${valueKey}-unit`]: val,
								});
							}}
							placeholder={getPlaceholder(valueKey)}
							value={getValue(valueKey)}
							defaultValue={getDefault(valueKey)}
							onChangeValue={(val, unit) => {
								onChangeFormat({
									[`${prefix}${valueKey}`]: val,
									...(unit && {
										[`${prefix}${valueKey}-unit`]: unit,
									}),
								});
							}}
							onReset={() =>
								onChangeFormat(
									{
										[`${prefix}${valueKey}-unit`]:
											getDefault(`${valueKey}-unit`),
										[`${prefix}${valueKey}`]:
											getDefault(valueKey),
									},
									{ isReset: true }
								)
							}
							{...props}
						/>
					)}
					<ToggleSwitch
						label={__('Auto-adjust scaling', 'maxi-blocks')}
						selected={clampAutoStatus}
						onChange={val => {
							onChangeFormat({
								[`${prefix}${valueKey}-clamp-auto-status`]: val,
							});
						}}
					/>
					<AdvancedNumberControl
						label={`Maximum ${lowerCase(label)}`}
						enableUnit
						unit={getUnitValue(`${valueKey}-clamp-max-unit`)}
						defaultUnit={getDefault(`${valueKey}-clamp-max-unit`)}
						onChangeUnit={val => {
							onChangeFormat({
								[`${prefix}${valueKey}-clamp-max-unit`]: val,
							});
						}}
						placeholder={getPlaceholder(`${valueKey}-clamp-max`)}
						value={getValue(`${valueKey}-clamp-max`)}
						defaultValue={getDefault(`${valueKey}-clamp-max`)}
						onChangeValue={(val, unit) => {
							onChangeFormat({
								[`${prefix}${valueKey}-clamp-max`]: val,
								...(unit && {
									[`${prefix}${valueKey}-clamp-max-unit`]:
										unit,
								}),
							});
						}}
						onReset={() =>
							onChangeFormat(
								{
									[`${prefix}${valueKey}-clamp-max-unit`]:
										getDefault(
											`${valueKey}-clamp-max-unit`
										),
									[`${prefix}${valueKey}-clamp-max`]:
										getDefault(`${valueKey}-clamp-max`),
								},
								{ isReset: true }
							)
						}
						{...props}
					/>
				</>
			)}
			{!clampStatus && (
				<AdvancedNumberControl
					label={label}
					enableUnit
					unit={getUnitValue(`${valueKey}-unit`)}
					defaultUnit={getDefault(`${valueKey}-unit`)}
					onChangeUnit={val => {
						onChangeFormat({
							[`${prefix}${valueKey}-unit`]: val,
						});
					}}
					placeholder={getPlaceholder(valueKey)}
					value={getValue(valueKey)}
					defaultValue={getDefault(valueKey)}
					onChangeValue={(val, unit) => {
						onChangeFormat({
							[`${prefix}${valueKey}`]: val,
							...(unit && {
								[`${prefix}${valueKey}-unit`]: unit,
							}),
						});
					}}
					onReset={() =>
						onChangeFormat(
							{
								[`${prefix}${valueKey}-unit`]: getDefault(
									`${valueKey}-unit`
								),
								[`${prefix}${valueKey}`]: getDefault(valueKey),
							},
							{ isReset: true }
						)
					}
					{...props}
				/>
			)}
			<ToggleSwitch
				label={__(`Clamp ${lowerCase(label)}`, 'maxi-blocks')}
				selected={clampStatus}
				onChange={val => {
					onChangeFormat({
						[`${prefix}${valueKey}-clamp-status`]: val,
					});
				}}
			/>
			{clampStatus && <hr />}
		</div>
	);
};

export default ClampControl;
