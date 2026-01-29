/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import DialogBox from '@components/dialog-box';
import downloadTextFile from '@editor/style-cards/downloadTextFile';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

const HistoryButtons = ({
	className,
	buttonClassName,
	results,
	setResults,
	setSelectedResultId,
	switchToGenerateTab,
}) => {
	const handleHistorySelect = media => {
		fetch(media.url)
			// Need to parse the response 2 times,
			// because it was stringified twice in the export function
			.then(response => response.json())
			.then(response => JSON.parse(response))
			.then(jsonData => {
				setResults(jsonData);
				setSelectedResultId(jsonData[0].id);
			})
			.catch(error => {
				console.error(error);
			});
	};

	const handleHistoryExport = () => {
		downloadTextFile(results, 'history.txt');
	};

	const handleHistoryClean = () => {
		setResults([]);
		switchToGenerateTab();
	};

	const classes = classnames(
		'maxi-prompt-control-history-buttons',
		className
	);

	const buttonClasses = classnames(
		'maxi-prompt-control-history-buttons__button',
		buttonClassName
	);

	return (
		<div className={classes}>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={handleHistorySelect}
					allowedTypes='text'
					render={({ open }) => (
						<Button className={buttonClasses} onClick={open}>
							{__('Import', 'maxi-blocks')}
						</Button>
					)}
				/>
			</MediaUploadCheck>
			<Button className={buttonClasses} onClick={handleHistoryExport}>
				{__('Export', 'maxi-blocks')}
			</Button>
			{!isEmpty(results) && (
				<DialogBox
					message={__(
						'Are you sure you want to clean the history?',
						'maxi-blocks'
					)}
					cancelLabel={__('Cancel', 'maxi-blocks')}
					confirmLabel={__('Clean', 'maxi-blocks')}
					onConfirm={handleHistoryClean}
					buttonClassName={buttonClasses}
					buttonChildren={__('Clean', 'maxi-blocks')}
				/>
			)}
		</div>
	);
};

export default HistoryButtons;
