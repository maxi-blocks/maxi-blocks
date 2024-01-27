/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import standardSC from '../../../core/defaults/defaultSC.json';
import { getIsSiteEditor, getSiteEditorIframeBody } from '../../extensions/fse';

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

export const processSCAttributes = (SC, attr, type) => {
	const result = {};
	const defaultResult = {};

	if (!isEmpty(SC) && SC.styleCard?.[type]) {
		// Iterate through keys in the specified type
		for (const key of Object.keys(SC.styleCard[type])) {
			// Check if the key contains the attr substring
			if (key.includes(attr)) {
				const value = SC.styleCard[type][key];
				if (!isNil(value)) {
					// Add the key-value pair to the result object
					result[key] = value;
				}
			}
		}
	}

	if (!isEmpty(SC) && SC.defaultStyleCard?.[type]) {
		// Iterate through keys in the specified type
		for (const key of Object.keys(SC.defaultStyleCard[type])) {
			// Check if the key contains the attr substring
			if (key.includes(attr)) {
				const value = SC.defaultStyleCard[type][key];
				if (!isNil(value)) {
					// Add the key-value pair to the result object
					defaultResult[key] = value;
				}
			}
		}
	}

	return { ...defaultResult, ...result };
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

export const showHideHamburgerNavigation = type => {
	let editor = null;
	if (getIsSiteEditor()) {
		editor =
			getSiteEditorIframeBody() || document.querySelector('.edit-site');
	} else editor = document.querySelector('.edit-post-visual-editor');

	const applyStylesBasedOnType = () => {
		const hamburgerNavigation = editor.querySelector(
			'.maxi-container-block .wp-block-navigation__responsive-container-open'
		);

		let menuNavigation = null;

		// Check if the very next sibling has the class 'wp-block-navigation__responsive-container'
		if (
			hamburgerNavigation &&
			hamburgerNavigation.nextElementSibling &&
			hamburgerNavigation.nextElementSibling.classList.contains(
				'wp-block-navigation__responsive-container'
			)
		) {
			menuNavigation = hamburgerNavigation.nextElementSibling;
		}

		if (hamburgerNavigation && menuNavigation) {
			// Handle type as a string ('show' or 'hide')
			if (typeof type === 'string') {
				if (type === 'show') {
					hamburgerNavigation.classList.add('always-shown');
					menuNavigation.classList.add('hidden-by-default');
				} else {
					hamburgerNavigation.classList.remove('always-shown');
					menuNavigation.classList.remove('hidden-by-default');
				}
			}
			// Handle type as a number (screen size)
			else if (typeof type === 'number') {
				const editorWidth = editor.clientWidth;
				if (editorWidth <= type) {
					// Show for editor sizes type and down
					hamburgerNavigation.classList.add('always-shown');
					menuNavigation.classList.add('hidden-by-default');
				} else {
					// Hide for editor sizes larger than type
					hamburgerNavigation.classList.remove('always-shown');
					menuNavigation.classList.remove('hidden-by-default');
				}
			}
		}
	};

	// Initialize styles based on type
	applyStylesBasedOnType();

	const resizeObserver = new ResizeObserver(() => {
		applyStylesBasedOnType();
	});

	// Start observing the .edit-post-visual-editor
	if (editor) {
		resizeObserver.observe(editor);
	}

	// Return a function to allow cleanup of the observer
	return () => {
		if (editor) {
			resizeObserver.unobserve(editor);
		}
	};
};
