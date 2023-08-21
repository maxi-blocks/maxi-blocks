/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import { downloadTextFile } from '../../../../editor/style-cards/utils';

/**
 * External dependencies
 */
import classnames from 'classnames';

const HistoryButtons = ({
	className,
	buttonClassName,
	results,
	setResults,
	setSelectedResultId,
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
							{__('Import history', 'maxi-blocks')}
						</Button>
					)}
				/>
			</MediaUploadCheck>
			<Button className={buttonClasses} onClick={handleHistoryExport}>
				{__('Export history', 'maxi-blocks')}
			</Button>
		</div>
	);
};

export default HistoryButtons;
