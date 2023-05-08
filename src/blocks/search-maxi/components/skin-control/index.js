/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SelectControl, SettingTabsControl } from '../../../../components';
import {
	getAttributeKey,
	getDefaultAttribute,
} from '../../../../extensions/attributes';
import { prefixes } from '../../data';

const SkinControl = ({ skin, iconRevealAction, onChange }) => {
	const { buttonPrefix, inputPrefix } = prefixes;
	const buttonWO = buttonPrefix.replace('-', '');
	const inputWO = inputPrefix.replace('-', '');

	const getDefaultAttributes = attributeKeys =>
		attributeKeys.reduce((acc, key) => {
			acc[key] = getDefaultAttribute(key);
			return acc;
		}, {});

	const iconRevealResetStyles = getDefaultAttributes([
		`${buttonPrefix}bo.ra.u-general`,
		`${buttonPrefix}bo.ra.tl-general`,
		`${buttonPrefix}bo.ra.tr-general`,
		`${buttonPrefix}bo.ra.bl-general`,
		`${buttonPrefix}bo.ra.br-general`,
		`${buttonWO}_m.l-general`,
		`${buttonWO}_m.sy-general`,
		'i_pos',
	]);

	const classicResetStyles = {
		[getAttributeKey('_pc', false, `${inputPrefix}bc-`, 'general')]: 1,
	};

	return (
		<>
			<SelectControl
				label={__('Choose', 'maxi-blocks')}
				value={skin}
				options={[
					{
						label: __('Boxed', 'maxi-blocks'),
						value: 'boxed',
					},
					{
						label: __('Classic', 'maxi-blocks'),
						value: 'classic',
					},
					{
						label: __('Icon reveal', 'maxi-blocks'),
						value: 'icon-reveal',
					},
				]}
				onChange={skin => {
					if (skin === 'classic') {
						onChange({
							[getAttributeKey(
								'_pc',
								false,
								`${inputPrefix}bc-`,
								'general'
							)]: 2,
							...iconRevealResetStyles,
						});
					} else if (skin === 'boxed') {
						onChange({
							...iconRevealResetStyles,
							...classicResetStyles,
						});
					} else if (skin === 'icon-reveal') {
						onChange({
							...classicResetStyles,
							[`${buttonPrefix}bo.ra.u-general`]: '%',
							[`${buttonPrefix}bo.ra.tl-general`]: 50,
							[`${buttonPrefix}bo.ra.tr-general`]: 50,
							[`${buttonPrefix}bo.ra.bl-general`]: 50,
							[`${buttonPrefix}bo.ra.br-general`]: 50,
							[`${buttonWO}_m.l-general`]: '-20',
							[`${buttonWO}_m.sy-general`]: 'none',
						});
					}

					onChange({
						skin,
					});
				}}
			/>
			{skin === 'icon-reveal' && (
				<SettingTabsControl
					label={__('Reveal action', 'maxi-blocks')}
					type='buttons'
					selected={iconRevealAction}
					items={[
						{
							label: __('Click', 'maxi-blocks'),
							value: 'click',
						},
						{
							label: __('Hover', 'maxi-blocks'),
							value: 'hover',
						},
					]}
					onChange={iconRevealAction =>
						onChange({
							_ira: iconRevealAction,
						})
					}
				/>
			)}
		</>
	);
};

export default SkinControl;
