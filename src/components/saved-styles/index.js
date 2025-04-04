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

const MAX_SAVED_STYLES = 100;

const SavedStyles = props => {
	const { maxiSetAttributes } = props;
	const [selectedStyle, setSelectedStyle] = useState('');
	const [isRenaming, setIsRenaming] = useState(false);
	const [newName, setNewName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [localSavedStyles, setLocalSavedStyles] = useState({});
	const [copySuccess, setCopySuccess] = useState(false);

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

				setLocalSavedStyles(parsedResponse || {});

				// Check if there's a style to auto-select from the global variable
				if (
					window.maxiLastSavedStyleName &&
					parsedResponse[window.maxiLastSavedStyleName]
				) {
					setSelectedStyle(window.maxiLastSavedStyleName);
					// Clear the global variable after using it
					window.maxiLastSavedStyleName = null;
				}
			} catch (err) {
				console.error('Error loading saved styles:', err);
				setLocalSavedStyles({});
			}
			setIsLoading(false);
		};
		loadStyles();
	}, []);

	// Set first style as selected when styles are loaded
	useEffect(() => {
		if (
			localSavedStyles &&
			Object.keys(localSavedStyles).length > 0 &&
			!selectedStyle
		) {
			setSelectedStyle(Object.keys(localSavedStyles)[0]);
		}
	}, [localSavedStyles, selectedStyle]);

	// Function to copy selected style to clipboard
	const copyStyleToClipboard = async () => {
		if (!selectedStyle || !localSavedStyles) return;

		try {
			const styleData = localSavedStyles[selectedStyle];
			await navigator.clipboard.writeText(JSON.stringify(styleData));

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

		// Check if maxiSetAttributes is available and is a function
		if (typeof maxiSetAttributes === 'function') {
			maxiSetAttributes(styleData);
		} else {
			// Fallback: Try to use the WordPress core function
			const { updateBlockAttributes } = dispatch('core/block-editor');
			const selectedBlockClientId =
				select('core/block-editor').getSelectedBlockClientId();

			if (selectedBlockClientId) {
				updateBlockAttributes(selectedBlockClientId, styleData);
			} else {
				// Show a warning if we can't apply the style
				console.error(
					'Cannot apply style: No block selected or maxiSetAttributes unavailable'
				);
			}
		}
	};

	const savedStylesList = Object.keys(localSavedStyles).map(name => ({
		id: name,
		name,
	}));

	const stylesCount = savedStylesList.length;

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
					<div className='maxi-saved-styles-control__count'>
						{stylesCount}
						{__(' out of', 'maxi-blocks')} {MAX_SAVED_STYLES}
					</div>
					{selectedStyle && localSavedStyles[selectedStyle] && (
						<div className='maxi-saved-styles-control__buttons'>
							<Button onClick={applyStyle} disabled={isLoading}>
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
							<Button onClick={handleDelete} disabled={isLoading}>
								{isLoading
									? __('Deleting…', 'maxi-blocks')
									: __('Delete', 'maxi-blocks')}
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default SavedStyles;
