/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '@components/select-control';
import SettingTabsControl from '@components/setting-tabs-control';
import { getDefaultAttribute } from '@extensions/styles';
import { prefixes } from '@blocks/search-maxi/data';

const SkinControl = ({ skin, iconRevealAction, onChange }) => {
	const { buttonPrefix, inputPrefix } = prefixes;

	const getDefaultAttributes = attributeKeys =>
		attributeKeys.reduce((acc, key) => {
			acc[key] = getDefaultAttribute(key);
			return acc;
		}, {});

	const iconRevealResetStyles = getDefaultAttributes([
		`${buttonPrefix}border-unit-radius-general`,
		`${buttonPrefix}border-top-left-radius-general`,
		`${buttonPrefix}border-top-right-radius-general`,
		`${buttonPrefix}border-bottom-left-radius-general`,
		`${buttonPrefix}border-bottom-right-radius-general`,
		`${buttonPrefix}margin-left-general`,
		`${buttonPrefix}margin-sync-general`,
	]);

	const classicResetStyles = {
		[`${inputPrefix}background-palette-color-general`]: 1,
	};

	const resetBorders = getDefaultAttributes([
		`${inputPrefix}border-left-width-general`,
		`${inputPrefix}border-right-width-general`,
	]);

	return (
		<>
			<SelectControl
				__nextHasNoMarginBottom
				label={__('Choose', 'maxi-blocks')}
				value={skin}
				newStyle
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
							[`${inputPrefix}background-palette-color-general`]: 2,
							...iconRevealResetStyles,
							...resetBorders,
							[`${inputPrefix}padding-left-general`]: 10,
							[`${inputPrefix}padding-right-general`]: 30,
							'icon-position': 'right',
						});
					} else if (skin === 'boxed') {
						onChange({
							...iconRevealResetStyles,
							...classicResetStyles,
							...resetBorders,
							[`${inputPrefix}padding-left-general`]: 10,
							[`${inputPrefix}padding-right-general`]: 30,
							'icon-position': 'right',
						});
					} else if (skin === 'icon-reveal') {
						onChange({
							...classicResetStyles,
							[`${buttonPrefix}border-unit-radius-general`]: '%',
							[`${buttonPrefix}border-top-left-radius-general`]: 50,
							[`${buttonPrefix}border-top-right-radius-general`]: 50,
							[`${buttonPrefix}border-bottom-left-radius-general`]: 50,
							[`${buttonPrefix}border-bottom-right-radius-general`]: 50,
							[`${buttonPrefix}margin-sync-general`]: 'none',
							[`${inputPrefix}padding-left-general`]: 10,
							[`${inputPrefix}padding-right-general`]: 30,
							...resetBorders,
							'icon-position': 'right',
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
							iconRevealAction,
						})
					}
				/>
			)}
		</>
	);
};

export default SkinControl;
