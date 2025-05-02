/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import SelectControl from '@components/select-control';
import './editor.scss';

/**
 * SavedStyles Component
 *
 * This component allows users to save and manage block-specific styles.
 * Each style is associated with a specific block type, and the component
 * will filter styles to only show those compatible with the current block.
 *
 * Style data format:
 * {
 *   "Style Name": {
 *     blockType: "maxi-blocks/block-name",
 *     styles: { ...style attributes }
 *   }
 * }
 *
 * The component also handles legacy format (styles without blockType)
 * by showing them for all block types.
 */
const MAX_SAVED_STYLES = 100;

const SavedStyles = props => {
	const { maxiSetAttributes, blockName } = props;
	const [selectedStyle, setSelectedStyle] = useState('');
	const [isRenaming, setIsRenaming] = useState(false);
	const [newName, setNewName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [localSavedStyles, setLocalSavedStyles] = useState({});
	const [copySuccess, setCopySuccess] = useState(false);
	const [filteredStyles, setFilteredStyles] = useState({});

	// Helper function to normalize block names for comparison
	const normalizeBlockName = name => {
		if (!name) return '';
		// Strip 'maxi-blocks/' prefix if present
		return name.replace('maxi-blocks/', '');
	};

	// Filter styles by block type
	const filterStylesByBlockType = styles => {
		if (!styles || Object.keys(styles).length === 0) {
			setFilteredStyles({});
			return;
		}

		// If no blockName is provided, show all styles
		if (!blockName) {
			setFilteredStyles(styles);
			return;
		}

		const filtered = {};

		// Process each style
		Object.entries(styles).forEach(([styleName, styleData]) => {
			// Handle legacy format (no blockType field)
			if (!styleData.blockType) {
				// If no blockType, include in all block types
				filtered[styleName] = styleData;
				return;
			}

			const normalizedStyleBlockType = normalizeBlockName(
				styleData.blockType
			);
			const normalizedCurrentBlockType = normalizeBlockName(blockName);

			// Check for direct match or normalized match
			if (
				styleData.blockType === blockName ||
				normalizedStyleBlockType === normalizedCurrentBlockType
			) {
				filtered[styleName] = styleData;
			}
		});

		setFilteredStyles(filtered);

		// Check if there's a style to auto-select from the global variable
		if (
			window.maxiLastSavedStyleName &&
			styles[window.maxiLastSavedStyleName] &&
			(!styles[window.maxiLastSavedStyleName].blockType ||
				styles[window.maxiLastSavedStyleName].blockType === blockName ||
				normalizeBlockName(
					styles[window.maxiLastSavedStyleName].blockType
				) === normalizeBlockName(blockName) ||
				window.maxiLastSavedStyleBlockType === blockName ||
				normalizeBlockName(window.maxiLastSavedStyleBlockType) ===
					normalizeBlockName(blockName))
		) {
			setSelectedStyle(window.maxiLastSavedStyleName);
			// Clear the global variables after using them
			window.maxiLastSavedStyleName = null;
			window.maxiLastSavedStyleBlockType = null;
		}
	};

	// Load saved styles on component mount
	useEffect(() => {
		const loadStyles = async () => {
			setIsLoading(true);
			try {
				const response = await apiFetch({
					path: '/maxi-blocks/v1.0/saved-styles',
				});

				// Parse the response if needed
				const parsedResponse =
					typeof response === 'string'
						? JSON.parse(response)
						: response;

				// Store all styles
				const allStyles = parsedResponse || {};
				setLocalSavedStyles(allStyles);

				// Filter styles for current block type
				filterStylesByBlockType(allStyles);
			} catch (err) {
				console.error('Error loading saved styles:', err);
				setLocalSavedStyles({});
				setFilteredStyles({});
			}
			setIsLoading(false);
		};
		loadStyles();
	}, []);

	// Filter styles when blockName changes
	useEffect(() => {
		filterStylesByBlockType(localSavedStyles);
	}, [blockName, localSavedStyles]);

	// Set first style as selected when styles are loaded
	useEffect(() => {
		if (
			filteredStyles &&
			Object.keys(filteredStyles).length > 0 &&
			!selectedStyle
		) {
			setSelectedStyle(Object.keys(filteredStyles)[0]);
		} else if (Object.keys(filteredStyles).length === 0) {
			setSelectedStyle('');
		}
	}, [filteredStyles, selectedStyle]);

	// Function to copy selected style to clipboard
	const copyStyleToClipboard = async () => {
		if (!selectedStyle || !localSavedStyles) return;

		try {
			const styleData = localSavedStyles[selectedStyle];
			const dataToCopy = styleData.styles || styleData; // Handle both formats
			await navigator.clipboard.writeText(JSON.stringify(dataToCopy));

			// Set copy success state
			setCopySuccess(true);

			// Reset after 3 seconds
			setTimeout(() => {
				setCopySuccess(false);
			}, 3000);
		} catch (err) {
			console.error('Failed to copy style:', err);
		}
	};

	// Function to handle rename
	const handleRename = async () => {
		if (!selectedStyle || !newName || !localSavedStyles) return;

		setIsLoading(true);
		try {
			const currentStyles = { ...localSavedStyles };
			const styleData = currentStyles[selectedStyle];
			delete currentStyles[selectedStyle];
			currentStyles[newName] = styleData;

			// Call the API directly
			await apiFetch({
				path: '/maxi-blocks/v1.0/saved-styles',
				method: 'POST',
				data: {
					styles: JSON.stringify(currentStyles),
				},
			});

			setLocalSavedStyles(currentStyles);
			filterStylesByBlockType(currentStyles);
			setIsRenaming(false);
			setNewName('');
			setSelectedStyle(newName);
		} catch (err) {
			console.error('Error renaming style:', err);
		}
		setIsLoading(false);
	};

	// Function to handle delete
	const handleDelete = async () => {
		if (!selectedStyle || !localSavedStyles) return;

		setIsLoading(true);
		try {
			const currentStyles = { ...localSavedStyles };
			delete currentStyles[selectedStyle];

			// Call the API directly
			await apiFetch({
				path: '/maxi-blocks/v1.0/saved-styles',
				method: 'POST',
				data: {
					styles: JSON.stringify(currentStyles),
				},
			});

			setLocalSavedStyles(currentStyles);
			filterStylesByBlockType(currentStyles);
			setSelectedStyle('');
		} catch (err) {
			console.error('Error deleting style:', err);
		}
		setIsLoading(false);
	};

	// Function to apply selected style
	const applyStyle = () => {
		if (!selectedStyle || !localSavedStyles) return;

		const styleData = localSavedStyles[selectedStyle];
		// Get actual style data (handle both old and new format)
		const actualStyleData = styleData.styles || styleData;

		// Check if maxiSetAttributes is available and is a function
		if (typeof maxiSetAttributes === 'function') {
			maxiSetAttributes(actualStyleData);
		} else {
			// Fallback: Try to use the WordPress core function
			const { updateBlockAttributes } = dispatch('core/block-editor');
			const selectedBlockClientId =
				select('core/block-editor').getSelectedBlockClientId();

			if (selectedBlockClientId) {
				updateBlockAttributes(selectedBlockClientId, actualStyleData);
			} else {
				// Show a warning if we can't apply the style
				console.error(
					'Cannot apply style: No block selected or maxiSetAttributes unavailable'
				);
			}
		}
	};

	const savedStylesList = Object.keys(filteredStyles).map(name => ({
		id: name,
		name,
	}));

	const stylesCount = Object.keys(localSavedStyles).length;

	return (
		<div className='maxi-saved-styles-control'>
			{isRenaming ? (
				<div className='maxi-saved-styles-control__rename'>
					<input
						type='text'
						value={newName}
						onChange={e => setNewName(e.target.value)}
						placeholder={__('Enter new name', 'maxi-blocks')}
						disabled={isLoading}
					/>
					<div className='maxi-saved-styles-control__rename-buttons'>
						<Button
							onClick={handleRename}
							disabled={!newName || isLoading}
						>
							{isLoading
								? __('Saving…', 'maxi-blocks')
								: __('Save', 'maxi-blocks')}
						</Button>
						<Button
							onClick={() => {
								setIsRenaming(false);
								setNewName('');
							}}
							disabled={isLoading}
						>
							{__('Cancel', 'maxi-blocks')}
						</Button>
					</div>
				</div>
			) : (
				<>
					<div className='maxi-saved-styles-control__count'>
						{stylesCount}
						{__(' out of', 'maxi-blocks')} {MAX_SAVED_STYLES}
					</div>

					{Object.keys(filteredStyles).length > 0 ? (
						<>
							<SelectControl
								label={__('Select style', 'maxi-blocks')}
								value={selectedStyle}
								onChange={value => setSelectedStyle(value)}
								options={savedStylesList.map(style => ({
									label: style.name,
									value: style.name,
								}))}
								disabled={isLoading}
								newStyle
							/>

							{selectedStyle && filteredStyles[selectedStyle] && (
								<div className='maxi-saved-styles-control__buttons'>
									<Button
										onClick={applyStyle}
										disabled={isLoading}
									>
										{__('Apply', 'maxi-blocks')}
									</Button>
									<Button
										onClick={copyStyleToClipboard}
										disabled={isLoading || copySuccess}
									>
										{copySuccess
											? __('Done', 'maxi-blocks')
											: __('Copy', 'maxi-blocks')}
									</Button>
									<Button
										onClick={() => {
											setNewName(selectedStyle);
											setIsRenaming(true);
										}}
										disabled={isLoading}
									>
										{__('Rename', 'maxi-blocks')}
									</Button>
									<Button
										onClick={handleDelete}
										disabled={isLoading}
									>
										{isLoading
											? __('Deleting…', 'maxi-blocks')
											: __('Delete', 'maxi-blocks')}
									</Button>
								</div>
							)}
						</>
					) : (
						<div className='maxi-saved-styles-control__no-styles'>
							{__(
								'No styles available for this block type.',
								'maxi-blocks'
							)}
							<p className='maxi-saved-styles-control__help-text'>
								{__(
									'Use "Save styles" in the toolbar to create styles for this block.',
									'maxi-blocks'
								)}
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default SavedStyles;
