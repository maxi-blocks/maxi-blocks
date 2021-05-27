/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';

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

export const exportStyleCard = (data, fileName) => {
	const a = document.createElement('a');
	document.body.appendChild(a);
	a.style = 'display: none';

	const json = JSON.stringify(data);
	const blob = new Blob([json], { type: 'text/plain' });
	const url = window.URL.createObjectURL(blob);

	a.href = url;
	a.download = fileName;
	a.click();
	document.body.removeChild(a);
};
