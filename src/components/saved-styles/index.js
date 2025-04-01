/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Select from '@components/select-control';
import './editor.scss';

const SavedStyles = props => {
	const { attributes, maxiSetAttributes } = props;
	const [selectedStyle, setSelectedStyle] = useState('');
	const [isRenaming, setIsRenaming] = useState(false);
	const [newName, setNewName] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const { savedStyles } = useSelect(select => ({
		savedStyles:
			select('maxiBlocks').receiveMaxiBlocksSavedStyles()?.styles || {},
	}));

	const { getMaxiBlocksSavedStyles, setMaxiBlocksSavedStyles } =
		useDispatch('maxiBlocks');

	// Load saved styles on component mount
	useEffect(() => {
		const loadStyles = async () => {
			setIsLoading(true);
			try {
				await getMaxiBlocksSavedStyles();
			} catch (err) {
				console.error('Error loading saved styles:', err);
			}
			setIsLoading(false);
		};
		loadStyles();
	}, []);

	// Function to copy selected style to clipboard
	const copyStyleToClipboard = async () => {
		if (!selectedStyle || !savedStyles) return;

		try {
			const styleData = savedStyles[selectedStyle];
			await navigator.clipboard.writeText(JSON.stringify(styleData));
		} catch (err) {
			console.error('Failed to copy style:', err);
		}
	};

	// Function to handle rename
	const handleRename = async () => {
		if (!selectedStyle || !newName || !savedStyles) return;

		setIsLoading(true);
		try {
			const currentStyles = { ...savedStyles };
			const styleData = currentStyles[selectedStyle];
			delete currentStyles[selectedStyle];
			currentStyles[newName] = styleData;

			await setMaxiBlocksSavedStyles({
				styles: currentStyles,
			});
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
		if (!selectedStyle || !savedStyles) return;

		setIsLoading(true);
		try {
			const currentStyles = { ...savedStyles };
			delete currentStyles[selectedStyle];

			await setMaxiBlocksSavedStyles({
				styles: currentStyles,
			});
			setSelectedStyle('');
		} catch (err) {
			console.error('Error deleting style:', err);
		}
		setIsLoading(false);
	};

	// Function to apply selected style
	const applyStyle = () => {
		if (!selectedStyle || !savedStyles) return;

		const styleData = savedStyles[selectedStyle];
		maxiSetAttributes(styleData);
	};

	const savedStylesList = Object.keys(savedStyles).map(name => ({
		id: name,
		name,
	}));

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
			) : (
				<>
					<Select
						label={__('Select style', 'maxi-blocks')}
						value={selectedStyle}
						onChange={value => setSelectedStyle(value)}
						options={savedStylesList.map(style => ({
							label: style.name,
							value: style.name,
						}))}
						disabled={isLoading}
					/>
					{selectedStyle && (
						<div className='maxi-saved-styles-control__buttons'>
							<Button onClick={applyStyle} disabled={isLoading}>
								{__('Apply', 'maxi-blocks')}
							</Button>
							<Button
								onClick={copyStyleToClipboard}
								disabled={isLoading}
							>
								{__('Copy', 'maxi-blocks')}
							</Button>
							<Button
								onClick={() => setIsRenaming(true)}
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
