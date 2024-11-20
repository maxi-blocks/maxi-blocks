/* eslint-disable no-alert */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, select } from '@wordpress/data';
import { forwardRef } from '@wordpress/element';
import { Popover } from '@wordpress/components';

/**
 * External dependencies
 */
import JSZip from 'jszip';

/**
 * Internal dependencies
 */
import Icon from '../../components/icon';
import Button from '../../components/button';

/**
 * Icons
 */
import { styleCardBoat, closeIcon } from '../../icons';

const MaxiExportPopUp = forwardRef(({ setIsVisible }, ref) => {
	const { isRTL, currentPostTitle, postContent } = useSelect(select => {
		const { getEditorSettings, getEditedPostContent } =
			select('core/editor');
		const { getCurrentPost } = select('core/editor');
		const { isRTL } = getEditorSettings();
		const currentPost = getCurrentPost();

		return {
			isRTL,
			currentPostTitle:
				currentPost?.title || `maxi-export-${currentPost?.id || ''}`,
			postContent: getEditedPostContent(),
		};
	});

	const getExportData = () => {
		// Get all blocks from the content
		const blocks = wp.blocks.parse(postContent);
		const uniqueIDs = new Set();

		// Recursive function to collect all uniqueIDs
		const collectUniqueIDs = block => {
			if (block.attributes?.uniqueID) {
				uniqueIDs.add(block.attributes.uniqueID);
			}
			if (block.innerBlocks) {
				block.innerBlocks.forEach(innerBlock => {
					collectUniqueIDs(innerBlock);
				});
			}
		};

		// Collect all uniqueIDs
		blocks.forEach(block => {
			collectUniqueIDs(block);
		});

		// Get styles for each uniqueID
		const styles = {};
		uniqueIDs.forEach(uniqueID => {
			const blockStyles =
				select('maxiBlocks/styles').getCSSCache(uniqueID);
			if (blockStyles) {
				styles[uniqueID] = blockStyles;
			}
		});

		return {
			[currentPostTitle]: {
				content: postContent,
				styles,
			},
		};
	};

	const handleDownloadJSON = () => {
		const exportData = getExportData();
		const jsonData = JSON.stringify(exportData, null, 2);
		const blob = new Blob([jsonData], { type: 'application/json' });

		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${currentPostTitle
			.toLowerCase()
			.replace(/\s+/g, '-')}.json`;

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	};

	const handleDownloadZIP = async () => {
		const exportData = getExportData();
		const jsonData = JSON.stringify(exportData, null, 2);

		// Create a new JSZip instance
		const zip = new JSZip();

		// Add the JSON file to the zip with maximum compression
		zip.file(
			`${currentPostTitle.toLowerCase().replace(/\s+/g, '-')}.json`,
			jsonData,
			{
				compression: 'DEFLATE',
				compressionOptions: {
					level: 9, // 9 = maximum compression
				},
			}
		);

		// Add a readme file with maximum compression
		zip.file(
			'readme.txt',
			'This export was created with MaxiBlocks.\nContains page content and styles.',
			{
				compression: 'DEFLATE',
				compressionOptions: {
					level: 9,
				},
			}
		);

		// Generate the zip file with maximum compression
		const zipBlob = await zip.generateAsync({
			type: 'blob',
			compression: 'DEFLATE',
			compressionOptions: {
				level: 9,
			},
		});

		// Create download link
		const url = window.URL.createObjectURL(zipBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${currentPostTitle
			.toLowerCase()
			.replace(/\s+/g, '-')}.zip`;

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	};

	return (
		<Popover
			anchor={ref.current}
			noArrow
			resize
			position={isRTL ? 'bottom left right' : 'bottom right left'}
			className='maxi-style-cards__popover maxi-sidebar'
			focusOnMount
			strategy='fixed'
		>
			<div className='active-style-card'>
				<div className='active-style-card_icon'>
					<Icon icon={styleCardBoat} />
				</div>
				<div className='active-style-card_title'>
					<span>{__('Export', 'maxi-blocks')}</span>
					<h2 className='maxi-style-cards__popover__title'>
						{__('Export current page', 'maxi-blocks')}
					</h2>
				</div>
				<span
					className='maxi-responsive-close has-tooltip'
					onClick={() => setIsVisible(false)}
				>
					<span className='tooltip'>
						{__('Close', 'maxi-blocks')}
					</span>
					<Icon icon={closeIcon} />
				</span>
			</div>

			<div className='maxi-style-cards__sc'>
				<div className='maxi-style-cards__sc__more-sc'>
					<Button
						className='maxi-style-cards__download-button'
						onClick={handleDownloadJSON}
					>
						{__('Download as JSON', 'maxi-blocks')}
					</Button>
					<Button
						className='maxi-style-cards__download-button'
						onClick={handleDownloadZIP}
					>
						{__('Download as ZIP', 'maxi-blocks')}
					</Button>
				</div>
			</div>
		</Popover>
	);
});

export default MaxiExportPopUp;
