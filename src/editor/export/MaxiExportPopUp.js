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
import frontendStyleGenerator from '../../extensions/styles/frontendStyleGenerator';
import { processCss } from '../../extensions/styles/store/controls';

/**
 * Icons
 */
import { styleCardBoat, closeIcon } from '../../icons';

const MaxiExportPopUp = forwardRef(({ setIsVisible }, ref) => {
	const { isRTL, currentPostTitle, postContent, postType } = useSelect(
		select => {
			const { getEditorSettings, getEditedPostContent, getCurrentPost } =
				select('core/editor');
			const { isRTL } = getEditorSettings();
			const currentPost = getCurrentPost();

			return {
				isRTL,
				currentPostTitle:
					currentPost?.title ||
					`maxi-export-${currentPost?.id || ''}`,
				postContent: getEditedPostContent(),
				postType: currentPost?.type || 'post',
			};
		}
	);

	const isFSE = select('core/edit-site') !== undefined;

	const { entityType, entityTitle, entitySlug, wpPatternSyncStatus } =
		useSelect(
			select => {
				if (!isFSE) {
					return {
						entityType: postType,
						entityTitle: currentPostTitle,
						entitySlug: currentPostTitle
							.toLowerCase()
							.replace(/\s+/g, '-'),
						wpPatternSyncStatus: '',
					};
				}

				const { getEditedPostId, getEditedPostType } =
					select('core/edit-site');
				const editedPostType = getEditedPostType();
				const editedPostId = getEditedPostId();

				let type = '';
				let title = '';
				let slug = '';
				let patternSyncStatus = '';

				const getEntityRecord = (postType, id) =>
					select('core').getEntityRecord('postType', postType, id);

				if (editedPostType === 'wp_template') {
					type = 'template';
					const record = getEntityRecord('wp_template', editedPostId);
					title = record?.title?.rendered || '';
					slug = record?.slug || `template-${editedPostId}`;
				} else if (editedPostType === 'wp_template_part') {
					type = 'template-part';
					const record = getEntityRecord(
						'wp_template_part',
						editedPostId
					);
					title = record?.title?.rendered || '';
					slug = record?.slug || `template-part-${editedPostId}`;
				} else if (editedPostType === 'wp_block') {
					type = 'pattern';
					const record = getEntityRecord('wp_block', editedPostId);
					title = record?.title?.raw || '';
					slug = record?.slug || `pattern-${editedPostId}`;
					patternSyncStatus = record?.wp_pattern_sync_status || '';
				}

				return {
					entityType: type || editedPostType,
					entityTitle: title || `maxi-export-${editedPostId}`,
					entitySlug: slug || `maxi-export-${editedPostId}`,
					wpPatternSyncStatus: patternSyncStatus,
				};
			},
			[isFSE, currentPostTitle, postType]
		);

	const getExportData = async () => {
		const blocks = wp.blocks.parse(postContent);
		const uniqueIDs = new Set();

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

		blocks.forEach(block => {
			collectUniqueIDs(block);
		});

		// Get styles for each uniqueID
		const styles = {};
		try {
			await Promise.all(
				Array.from(uniqueIDs).map(async uniqueID => {
					const blockStyles =
						select('maxiBlocks/styles').getBlockStyles(uniqueID);

					if (blockStyles) {
						try {
							// Format the styles as expected by frontendStyleGenerator
							const styleArray = [uniqueID, blockStyles];
							const generatedStyle =
								frontendStyleGenerator(styleArray);

							if (generatedStyle) {
								const cssString = await processCss(
									generatedStyle
								);

								if (cssString) {
									styles[uniqueID] = cssString;
								}
							}
						} catch (error) {
							console.error(
								'Error processing styles for uniqueID:',
								uniqueID,
								error
							);
						}
					}
				})
			);
		} catch (error) {
			console.error('Error in getExportData:', error);
		}

		// Get custom data and remove empty values
		const rawCustomData = select(
			'maxiBlocks/customData'
		).getPostCustomData();
		const customData = Object.fromEntries(
			Object.entries(rawCustomData).filter(([_, value]) => {
				// Remove empty strings, null, undefined, empty arrays and empty objects
				if (value === null || value === undefined || value === '')
					return false;
				if (Array.isArray(value) && value.length === 0) return false;
				if (
					typeof value === 'object' &&
					Object.keys(value).length === 0
				)
					return false;
				return true;
			})
		);

		const exportData = {
			content: postContent,
			styles,
			isFSE,
			entityType,
			entityTitle,
			entitySlug,
			...(entityType === 'pattern' &&
				wpPatternSyncStatus && { wpPatternSyncStatus }),
		};

		if (Object.keys(customData).length > 0) {
			exportData.customData = customData;
		}

		// Get fonts
		const fonts = select('maxiBlocks/text').getPostFonts();
		if (fonts.length > 0) {
			exportData.fonts = fonts;
		}

		return exportData;
	};

	const handleDownloadJSON = async () => {
		const exportData = await getExportData();
		const jsonData = JSON.stringify(exportData, null, 2);
		const blob = new Blob([jsonData], { type: 'application/json' });

		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${entitySlug}.json`;

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	};

	const handleDownloadZIP = async () => {
		const exportData = await getExportData();
		const jsonData = JSON.stringify(exportData, null, 2);

		const zip = new JSZip();

		zip.file(`${entitySlug}.json`, jsonData, {
			compression: 'DEFLATE',
			compressionOptions: {
				level: 9,
			},
		});

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
		link.download = `${entitySlug}.zip`;

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
