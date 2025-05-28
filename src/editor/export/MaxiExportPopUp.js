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
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import Icon from '@components/icon';
import Button from '@components/button';
import frontendStyleGenerator from '@extensions/styles/frontendStyleGenerator';
import { processCss } from '@extensions/styles/store/controls';

/**
 * Icons
 */
import { cloudLib, closeIcon } from '@maxi-icons';

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
							// Process main block styles
							const mainStyleArray = [uniqueID, blockStyles];
							const mainGeneratedStyle =
								frontendStyleGenerator(mainStyleArray);
							let finalCssString = '';

							if (mainGeneratedStyle) {
								const mainCssString = await processCss(
									mainGeneratedStyle
								);
								if (mainCssString) {
									finalCssString = mainCssString;
								}
							}

							// Handle accordion pane styles separately
							if (uniqueID.includes('accordion')) {
								const paneStyles = select(
									'maxiBlocks/styles'
								).getBlockStyles(
									`${uniqueID} .maxi-pane-block[data-accordion="${uniqueID}"]`
								);

								if (paneStyles) {
									const paneStyleArray = [
										`${uniqueID} .maxi-pane-block[data-accordion="${uniqueID}"]`,
										paneStyles,
									];
									const paneGeneratedStyle =
										frontendStyleGenerator(paneStyleArray);
									if (paneGeneratedStyle) {
										const paneCssString = await processCss(
											paneGeneratedStyle
										);
										if (paneCssString) {
											finalCssString += paneCssString;
										}
									}
								}
							}

							if (finalCssString) {
								styles[uniqueID] = finalCssString;
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
			Object.entries(rawCustomData)
				.filter(([_, value]) => {
					// Remove empty strings, null, undefined, empty arrays and empty objects
					if (value === null || value === undefined || value === '')
						return false;
					if (Array.isArray(value) && value.length === 0)
						return false;
					if (
						typeof value === 'object' &&
						Object.keys(value).length === 0
					)
						return false;
					return true;
				})
				.map(([key, value]) => {
					try {
						// Handle both string and object values
						const parsedValue =
							typeof value === 'string'
								? JSON.parse(value)
								: value;

						// Get the inner value, whether it's nested or not
						const innerValue = parsedValue[key] || parsedValue;

						return [key, JSON.stringify(innerValue)];
					} catch (error) {
						console.error(
							`Error processing customData for key ${key}:`,
							error
						);
						return [key, JSON.stringify(value)];
					}
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
		const getFontsForBlock = async uniqueID => {
			try {
				const data = await apiFetch({
					path: `/maxi-blocks/v1.0/fonts/${uniqueID}`,
					method: 'GET',
				});
				return data;
			} catch (error) {
				return null;
			}
		};

		// Get fonts for each uniqueID
		const blockFonts = {};
		try {
			await Promise.all(
				Array.from(uniqueIDs).map(async uniqueID => {
					const fonts = await getFontsForBlock(uniqueID);
					if (fonts) {
						blockFonts[uniqueID] = fonts;
					}
				})
			);
		} catch (error) {
			console.error('Error fetching fonts:', error);
		}

		// Only add fonts to exportData if we have any
		if (Object.keys(blockFonts).length > 0) {
			exportData.fonts = blockFonts;
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

	return (
		<Popover
			anchor={ref.current}
			noArrow
			resize
			position={isRTL ? 'bottom left right' : 'bottom right left'}
			className='maxi-style-cards__popover maxi-sidebar maxi-export-popover'
			focusOnMount
			strategy='fixed'
		>
			<div className='active-style-card'>
				<div className='active-style-card_icon export-icon'>
					<Icon icon={cloudLib} />
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
				<div className='maxi-library-modal__action-section maxi-library-modal__action-section__export'>
					<Button
						className='maxi-style-cards__sc__more-sc--add-more'
						onClick={handleDownloadJSON}
					>
						{__('Download as JSON', 'maxi-blocks')}
					</Button>
				</div>
			</div>
		</Popover>
	);
});

export default MaxiExportPopUp;
