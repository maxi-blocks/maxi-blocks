/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import standardSC from '../../../core/defaults/defaultSC.json';

/**
 * External dependencies
 */
import { isEmpty, isNil, isString } from 'lodash';
import { diff } from 'deep-object-diff';

/**
 * Utils
 */
export const showMaxiSCSavedActiveSnackbar = nameSC => {
	dispatch('core/notices').createNotice(
		'info',
		__(`${nameSC} saved`, 'maxi-blocks'),
		{
			isDismissible: true,
			type: 'snackbar',
			actions: [
				{
					onClick: () =>
						window.open(
							select('core/editor').getPermalink(),
							'_blank'
						),
					label: __('View', 'maxi-blocks'),
				},
			],
		}
	);
};

export const showMaxiSCSavedSnackbar = nameSC => {
	dispatch('core/notices').createNotice(
		'info',
		__(`${nameSC} saved`, 'maxi-blocks'),
		{
			isDismissible: true,
			type: 'snackbar',
		}
	);
};

export const showMaxiSCAppliedActiveSnackbar = nameSC => {
	dispatch('core/notices').createNotice(
		'info',
		__(`${nameSC} applied`, 'maxi-blocks'),
		{
			isDismissible: true,
			type: 'snackbar',
			actions: [
				{
					onClick: () =>
						window.open(
							select('core/editor').getPermalink(),
							'_blank'
						),
					label: __('View', 'maxi-blocks'),
				},
			],
		}
	);
};

export const downloadTextFile = (data, fileName) => {
	const a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';

	// Need stringify twice to get 'text/plain' mime type
	const json = JSON.stringify(JSON.stringify(data));
	const blob = new Blob([json], { type: 'text/plain' });
	const url = window.URL.createObjectURL(blob);

	a.href = url;
	a.download = fileName;
	a.click();
	document.body.removeChild(a);
};

export const exportStyleCard = (data, fileName) => {
	const reducedSC = diff(standardSC?.sc_maxi, data);
	downloadTextFile(reducedSC, fileName);
};

export const getDefaultSCAttribute = (SC, attr, type) => {
	if (!isEmpty(SC)) {
		const defaultValue = SC.defaultStyleCard?.[type]?.[attr];
		if (!isNil(defaultValue)) {
			if (isString(defaultValue) && defaultValue.includes('var')) {
				const colorNumber = defaultValue.match(/color-\d/);
				const colorValue = SC.defaultStyleCard[colorNumber];
				if (!isNil(colorValue)) return colorValue;
			} else return defaultValue;
		}
	}

	return null;
};

export const processSCAttribute = (SC, attr, type) => {
	if (!isEmpty(SC)) {
		const value = SC.styleCard?.[type]?.[attr];
		if (!isNil(value)) return value;

		return getDefaultSCAttribute(SC, attr, type);
	}

	return null;
};

export const getActiveColourFromSC = (sc, number) => {
	if (isEmpty(sc)) return '0,0,0';

	if (!isEmpty(sc?.value))
		return (
			sc.value?.light?.styleCard?.color?.[number] ||
			sc.value?.light?.defaultStyleCard?.color?.[number]
		);

	return (
		sc?.light?.styleCard?.color?.[number] ||
		sc?.light?.defaultStyleCard?.color?.[number]
	);
};
