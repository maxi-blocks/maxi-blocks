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

	const getDefaultAttributes = attributeKeys =>
		attributeKeys.reduce((acc, key) => {
			acc[key] = getDefaultAttribute(key);
			return acc;
		}, {});

	const iconRevealResetStyles = getDefaultAttributes([
		`${buttonPrefix}bo.ra.u-g`,
		`${buttonPrefix}bo.ra.tl-g`,
		`${buttonPrefix}bo.ra.tr-g`,
		`${buttonPrefix}bo.ra.bl-g`,
		`${buttonPrefix}bo.ra.br-g`,
		`${buttonWO}_m.l-g`,
		`${buttonWO}_m.sy-g`,
		'i_pos',
	]);

	const classicResetStyles = {
		[getAttributeKey({
			key: '_pc',
			prefix: `${inputPrefix}bc-`,
			breakpoint: 'g',
		})]: 1,
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
							[getAttributeKey({
								key: '_pc',
								prefix: `${inputPrefix}bc-`,
								breakpoint: 'g',
							})]: 2,
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
							[`${buttonPrefix}bo.ra.u-g`]: '%',
							[`${buttonPrefix}bo.ra.tl-g`]: 50,
							[`${buttonPrefix}bo.ra.tr-g`]: 50,
							[`${buttonPrefix}bo.ra.bl-g`]: 50,
							[`${buttonPrefix}bo.ra.br-g`]: 50,
							[`${buttonWO}_m.l-g`]: '-20',
							[`${buttonWO}_m.sy-g`]: 'none',
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
