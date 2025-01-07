/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import ToggleSwitch from '../components/toggle-switch';

/**
 * External dependencies
 */
import { useState, useEffect } from 'react';

const isValidValue = value =>
	value !== '' && value != null && value !== undefined;

const getTemplateDescription = name => {
	if (name.toLowerCase().includes('404')) {
		return __(
			"Imports a custom design for your website's 404 error page.",
			'maxi-blocks'
		);
	}
	if (name.toLowerCase().includes('header')) {
		return __(
			'Imports the global header design for your site.',
			'maxi-blocks'
		);
	}
	if (name.toLowerCase().includes('footer')) {
		return __(
			'Imports the global footer design for your site.',
			'maxi-blocks'
		);
	}
	if (name.toLowerCase().includes('blog')) {
		return __(
			'Imports the default blog landing page design for your site.',
			'maxi-blocks'
		);
	}
	return '';
};

// Add CSS for the loading animation
const loadingButtonStyles = `
	@keyframes rotate {
		100% { transform: rotate(360deg); }
	}
	.maxi-cloud-container__import-popup_button-loading::after {
		content: '';
		display: inline-block;
		width: 12px;
		height: 12px;
		margin-left: 10px;
		border: 2px solid #fff;
		border-radius: 50%;
		border-right-color: transparent;
		animation: rotate 1s linear infinite;
	}
	.maxi-cloud-container__import-popup_close-link {
		background: none;
		border: none;
		color: #2271b1;
		padding: 0;
		margin: 0;
		cursor: pointer;
		text-decoration: underline;
		font-size: inherit;
	}
	.maxi-cloud-container__import-popup_close-link:hover {
		color: #135e96;
	}
	.maxi-cloud-container__import-popup_status-text a {
		color: #2271b1;
		text-decoration: underline;
	}
	.maxi-cloud-container__import-popup_status-text a:hover {
		color: #135e96;
	}
	.maxi-cloud-container__import-popup_warning-message {
		background-color: #fef8ee;
		border-left: 4px solid #f0b849;
		margin: 10px 0;
		padding: 10px 15px;
	}
	.maxi-cloud-container__import-popup_warning-message p {
		margin: 0;
		color: #674e27;
	}
	.maxi-cloud-container__import-popup_install-link {
		background: none;
		border: none;
		color: #2271b1;
		padding: 0;
		margin: 0;
		cursor: pointer;
		text-decoration: underline;
		font-size: inherit;
	}
	.maxi-cloud-container__import-popup_install-link:hover {
		color: #135e96;
	}
	.maxi-cloud-container__import-popup_templates-list.maxi-disabled {
		opacity: 0.5;
		pointer-events: none;
	}
`;

const MaxiImportPopUp = props => {
	const {
		isOnboarding,
		url,
		title,
		cost,
		templates,
		pages,

		patterns,
		sc,
		contentXML,
		onRequestClose,
	} = props;

	// Add check for WordPress Importer status from localized data
	const wpImporterStatus =
		window.maxiStarterSites?.wpImporterStatus || 'missing';

	// Move themeType state declaration before selectedItems
	const [themeType, setThemeType] = useState({
		isBlockTheme: true,
		themeName: '',
	});

	const [selectedItems, setSelectedItems] = useState(() => {
		const initialState = {
			templates: {},
			pages: {},
			patterns: {},
			sc: isValidValue(sc),
			contentXML:
				wpImporterStatus === 'active' && isValidValue(contentXML),
			title,
		};

		// Initialize all templates to false initially
		templates?.forEach(template => {
			initialState.templates[template.name] = false;
		});

		pages?.forEach(page => {
			initialState.pages[page.name] = true;
		});

		patterns?.forEach(pattern => {
			initialState.patterns[pattern.name] = true;
		});

		return initialState;
	});

	const [importStatus, setImportStatus] = useState('idle'); // 'idle' | 'loading' | 'done'
	const [installingImporter, setInstallingImporter] = useState(false);
	const [wpImporterStatusState, setWpImporterStatusState] = useState(
		window.maxiStarterSites?.wpImporterStatus || 'missing'
	);

	// Add polling effect
	useEffect(() => {
		let pollTimer;

		const checkPluginStatus = async () => {
			try {
				const response = await apiFetch({
					path: '/maxi-blocks/v1.0/check-importer-status',
					method: 'GET',
				});

				if (response.status !== wpImporterStatusState) {
					setWpImporterStatusState(response.status);
					window.maxiStarterSites = {
						...window.maxiStarterSites,
						wpImporterStatus: response.status,
					};

					if (response.status === 'active') {
						handleToggleChange('contentXML', 'contentXML', true);
						clearInterval(pollTimer);
					}
				}
			} catch (error) {
				console.error('Error checking plugin status:', error);
			}
		};

		// Start polling when status is not 'active'
		if (wpImporterStatusState !== 'active') {
			pollTimer = setInterval(checkPluginStatus, 2000); // Check every 2 seconds
		}

		return () => {
			if (pollTimer) {
				clearInterval(pollTimer);
			}
		};
	}, [wpImporterStatusState]);

	const updateImporterStatus = (newStatus) => {
		setWpImporterStatusState(newStatus);
		// Update the window variable to keep it in sync
		window.maxiStarterSites = {
			...window.maxiStarterSites,
			wpImporterStatus: newStatus,
		};
	};

	const handleToggleChange = (type, name, value) => {
		// Prevent changing contentXML if plugin is not active
		if (type === 'contentXML' && wpImporterStatus !== 'active') {
			return;
		}

		// Prevent changing templates if not using a block theme
		if (type === 'templates' && !themeType.isBlockTheme) {
			return;
		}

		if (type === 'sc' || type === 'contentXML') {
			setSelectedItems(prevState => ({
				...prevState,
				[type]: value,
			}));
		} else {
			setSelectedItems(prevState => ({
				...prevState,
				[type]: {
					...prevState[type],
					[name]: value,
				},
			}));
		}
	};

	const handleToggleAll = value => {
		setSelectedItems(prevState => {
			const newState = { ...prevState };

			// Toggle templates only if using a block theme
			if (templates && themeType.isBlockTheme) {
				templates.forEach(template => {
					newState.templates[template.name] = value;
				});
			}

			// Toggle pages
			if (pages) {
				pages.forEach(page => {
					newState.pages[page.name] = value;
				});
			}

			// Toggle patterns
			if (patterns) {
				patterns.forEach(pattern => {
					newState.patterns[pattern.name] = value;
				});
			}

			// Toggle SC
			if (isValidValue(sc)) {
				newState.sc = value;
			}

			// Only toggle contentXML if it's enabled
			if (wpImporterStatus === 'active' && isValidValue(contentXML)) {
				newState.contentXML = value;
			}

			return newState;
		});
	};

	const areAllItemsSelected = selectedItems => {
		// Check templates
		const templatesSelected = templates
			? Object.values(selectedItems.templates).every(val => val)
			: true;

		// Check pages
		const pagesSelected = pages
			? Object.values(selectedItems.pages).every(val => val)
			: true;

		// Check patterns
		const patternsSelected = patterns
			? Object.values(selectedItems.patterns).every(val => val)
			: true;

		// Check SC and contentXML only if they are valid
		const scSelected = isValidValue(sc) ? selectedItems.sc : true;
		const xmlSelected =
			wpImporterStatus === 'active' && isValidValue(contentXML)
				? selectedItems.contentXML
				: true;

		return (
			templatesSelected &&
			pagesSelected &&
			patternsSelected &&
			scSelected &&
			xmlSelected
		);
	};

	const hasAnySelection = selectedItems => {
		// Check templates
		const hasTemplates = templates
			? Object.values(selectedItems.templates).some(val => val)
			: false;

		// Check pages
		const hasPages = pages
			? Object.values(selectedItems.pages).some(val => val)
			: false;

		// Check patterns
		const hasPatterns = patterns
			? Object.values(selectedItems.patterns).some(val => val)
			: false;

		// Check SC and contentXML
		const hasSC = selectedItems.sc;
		const hasXML = selectedItems.contentXML;

		return hasTemplates || hasPages || hasPatterns || hasSC || hasXML;
	};

	const onClickImport = selectedItems => {
		setImportStatus('loading');

		// Create object to store selected items with their content
		const importData = {};

		// Add title if it exists
		if (title) {
			importData.title = title;
		}

		// Add selected templates with their content
		if (templates) {
			const selectedTemplates = templates
				.filter(template => selectedItems.templates[template.name])
				.map(template => ({
					name: template.name,
					content: template.content,
				}));

			if (selectedTemplates.length > 0) {
				importData.templates = selectedTemplates;
			}
		}

		// Add selected pages with their content
		if (pages) {
			const selectedPages = pages
				.filter(page => selectedItems.pages[page.name])
				.map(page => ({
					name: page.name,
					content: page.content,
				}));

			if (selectedPages.length > 0) {
				importData.pages = selectedPages;
			}
		}

		// Add selected patterns with their content
		if (patterns) {
			const selectedPatterns = patterns
				.filter(pattern => selectedItems.patterns[pattern.name])
				.map(pattern => ({
					name: pattern.name,
					content: pattern.content,
				}));

			if (selectedPatterns.length > 0) {
				importData.patterns = selectedPatterns;
			}
		}

		// Add SC and contentXML only if selected
		if (selectedItems.sc && sc) {
			importData.sc = sc;
		}

		if (selectedItems.contentXML && contentXML) {
			importData.contentXML = contentXML;
		}

		// Send to API endpoint
		apiFetch({
			url: `${maxiStarterSites.apiRoot}maxi-blocks/v1.0/import-starter-site`,
			method: 'POST',
			headers: {
				'X-WP-Nonce': maxiStarterSites.apiNonce,
			},
			data: importData,
		})
			.then(response => {
				// Update window variable with the response data
				window.maxiStarterSites = window.maxiStarterSites || {};
				window.maxiStarterSites.currentStarterSite = response.currentStarterSite;

				// Dispatch the event
				window.dispatchEvent(new CustomEvent('maxiStarterSiteChanged'));

				setImportStatus('done');

				// Close the popup after successful import
				// if (onRequestClose) {
				// 	setTimeout(onRequestClose, 2000);
				// }
			})
			.catch(error => {
				console.error('Import error full details:', error);
				console.error('Error status:', error.status);
				console.error('Error message:', error.message);
				console.error('Error data:', error.data);
				setImportStatus('idle');
			});
	};

	const installAndActivateImporter = () => {
		// Redirect to WordPress plugin installation
		window.location.href = `${maxiStarterSites.adminUrl}update.php?action=install-plugin&plugin=wordpress-importer&_wpnonce=${maxiStarterSites.installNonce}`;
	};

	// Update the warning message JSX
	const renderWarningMessage = () => (
		<div className='maxi-cloud-container__import-popup_warning-message'>
			<p>
				{__('Please ', 'maxi-blocks')}
				<button
					type='button'
					className='maxi-cloud-container__import-popup_install-link'
					onClick={installAndActivateImporter}
					disabled={installingImporter}
				>
					{installingImporter
						? __('Installing...', 'maxi-blocks')
						: wpImporterStatusState === 'installed'
							? __('activate', 'maxi-blocks')
							: __('install and activate', 'maxi-blocks')
					}
				</button>
				{__(' WordPress Importer plugin to import content XML files.', 'maxi-blocks')}
			</p>
		</div>
	);

	// Update templates when theme type is confirmed
	useEffect(() => {
		const checkThemeType = async () => {
			try {
				const response = await apiFetch({
					path: '/maxi-blocks/v1.0/check-theme-type',
					method: 'GET',
				});
				setThemeType(response);

				// Update template toggles based on theme type
				if (response.isBlockTheme) {
					setSelectedItems(prev => ({
						...prev,
						templates: Object.keys(prev.templates).reduce((acc, key) => {
							acc[key] = true;
							return acc;
						}, {})
					}));
				}
			} catch (error) {
				console.error('Error checking theme type:', error);
			}
		};

		checkThemeType();
	}, []);

	// Add this helper function to check if templates section should be disabled
	const isTemplatesSectionDisabled = () => {
		return !themeType.isBlockTheme;
	};

	// Add this new function to handle theme installation/activation
	const handleThemeAction = async () => {
		try {
			const response = await apiFetch({
				path: '/maxi-blocks/v1.0/install-theme',
				method: 'POST'
			});

			if (response.success) {
				// Update theme type state with the new values
				setThemeType({
					isBlockTheme: true,
					themeName: 'MaxiBlocks Go',
					isMaxiBlocksGoInstalled: true
				});
			}
		} catch (error) {
			console.error('Error installing theme:', error);
		}
	};

	return (
		<div className='maxi-cloud-container__import-popup_main-wrap'>
			<style>{loadingButtonStyles}</style>
			<div className='maxi-cloud-container__import-popup_wrap'>
				<div className='maxi-cloud-container__import-popup_warning'>
					<h2>
						{__(
							'Note: When you import templates, template parts, or a Style Card, they will replace your existing items. Ensure you back up or review your current settings before proceeding.',
							'maxi-blocks'
						)}
					</h2>
					<p>
						{__(
							'Before importing, review which elements you want to overwrite. Anything toggled on will replace the corresponding item on your website.',
							'maxi-blocks'
						)}
					</p>
				</div>
				<div className='maxi-cloud-container__import-popup_sections-container'>
					{/* General section */}
					<div className='maxi-cloud-container__import-popup_section'>
						<div className='maxi-cloud-container__import-popup_toggle-all'>
							<ToggleSwitch
								label={__('Toggle all on/off', 'maxi-blocks')}
								selected={areAllItemsSelected(selectedItems)}
								onChange={handleToggleAll}
							/>
						</div>
						<h3 className='maxi-cloud-container__import-popup_section-title'>
							{__('General', 'maxi-blocks')}
						</h3>
						<div className='maxi-cloud-container__import-popup_item'>
							<ToggleSwitch
								label={__('Style Card', 'maxi-blocks')}
								selected={selectedItems.sc}
								onChange={val =>
									handleToggleChange('sc', 'sc', val)
								}
							/>
							<p>
								{__(
									'This option applies the design style (colours, typography, spacing, etc.) from the imported Style Card.',
									'maxi-blocks'
								)}
							</p>
						</div>
						{isValidValue(contentXML) && (
							<div className='maxi-cloud-container__import-popup_item'>
								<div
									className={`maxi-cloud-container__import-popup_toggle-wrapper${
										wpImporterStatusState !== 'active'
											? ' maxi-disabled'
											: ''
									}`}
								>
									<ToggleSwitch
										label={__('Content XML', 'maxi-blocks')}
										selected={selectedItems.contentXML}
										onChange={val =>
											handleToggleChange(
												'contentXML',
												'contentXML',
												val
											)
										}
										disabled={wpImporterStatusState !== 'active'}
									/>
									{wpImporterStatusState !== 'active' && renderWarningMessage()}
								</div>
								{wpImporterStatusState === 'active' && (
									<p>
										{__(
											'This option imports predefined content (posts, pages, or custom content) from the XML file.',
											'maxi-blocks'
										)}
									</p>
								)}
							</div>
						)}
					</div>

					{templates?.length > 0 && (
						<div className='maxi-cloud-container__import-popup_section'>
							<h3 className='maxi-cloud-container__import-popup_section-title'>
								{__('Templates', 'maxi-blocks')}
							</h3>

							{isTemplatesSectionDisabled() && (
								<div className='maxi-cloud-container__import-popup_warning-message'>
									<p>
										{sprintf(
											__('Templates cannot be imported because you are using a classic theme (%s). To import templates, you need a block theme. We recommend ', 'maxi-blocks'),
											themeType.themeName
										)}
										<button
											type='button'
											className='maxi-cloud-container__import-popup_install-link'
											onClick={handleThemeAction}
										>
											{themeType.isMaxiBlocksGoInstalled
												? __('activating', 'maxi-blocks')
												: __('installing', 'maxi-blocks')}
											{' MaxiBlocks Go'}
										</button>
										{__(' theme, which is optimized for MaxiBlocks.', 'maxi-blocks')}
									</p>
								</div>
							)}

							<div className={`maxi-cloud-container__import-popup_templates-list ${
								isTemplatesSectionDisabled() ? 'maxi-disabled' : ''
							}`}>
								{templates.map(template => (
									<div
										key={template.name}
										className='maxi-cloud-container__import-popup_item'
									>
										<ToggleSwitch
											label={template.name}
											selected={selectedItems.templates[template.name]}
											onChange={val => handleToggleChange('templates', template.name, val)}
											disabled={!themeType.isBlockTheme}
										/>
										<p>{getTemplateDescription(template.name)}</p>
									</div>
								))}
							</div>
						</div>
					)}

					{pages?.length > 0 && (
						<div className='maxi-cloud-container__import-popup_section'>
							<h3 className='maxi-cloud-container__import-popup_section-title'>
								{__('Pages', 'maxi-blocks')}
							</h3>
							<p className='maxi-cloud-container__import-popup_section-description'>
								{__(
									'The Pages section allows you to import predefined pages included in the starter site. Toggle the options on or off depending on whether you want to include them in your site.',
									'maxi-blocks'
								)}
							</p>
							{pages.map(page => (
								<div
									key={page.name}
									className='maxi-cloud-container__import-popup_item'
								>
									<ToggleSwitch
										label={page.name}
										selected={
											selectedItems.pages[page.name]
										}
										onChange={val =>
											handleToggleChange(
												'pages',
												page.name,
												val
											)
										}
									/>
								</div>
							))}
						</div>
					)}

					{patterns?.length > 0 && (
						<div className='maxi-cloud-container__import-popup_section'>
							<h3>{__('Patterns', 'maxi-blocks')}</h3>
							<p className='maxi-cloud-container__import-popup_section-description'>
								{__(
									'The Patterns section provides pre-designed block layouts or reusable elements that can be added to your website. Toggle the options on or off depending on whether you want to include them in your site.',
									'maxi-blocks'
								)}
							</p>
							{patterns.map(pattern => (
								<div
									key={pattern.name}
									className='maxi-cloud-container__import-popup_item'
								>
									<ToggleSwitch
										label={pattern.name}
										selected={
											selectedItems.patterns[pattern.name]
										}
										onChange={val =>
											handleToggleChange(
												'patterns',
												pattern.name,
												val
											)
										}
									/>
								</div>
							))}
						</div>
					)}
				</div>

				<div className='maxi-cloud-container__import-popup_footer'>
					{importStatus === 'done' ? (
						<div className='maxi-cloud-container__import-popup_status-text'>
							{isOnboarding ? (
								<>
									{__('Import completed. You can ', 'maxi-blocks')}
									<a
										href='#'
										className='maxi-cloud-container__import-popup_close-link'
										onClick={(e) => {
											e.preventDefault();
											const detailsPopup = document.querySelector('.maxi-cloud-container__details');
											if (detailsPopup) {
												const event = new Event('close-details-popup', { bubbles: true });
												detailsPopup.dispatchEvent(event);
											}
											if (onRequestClose) onRequestClose();

											// Remove 'modal-open' class from #maxi-starter-sites-root if it exists
											const rootElement = document.getElementById('maxi-starter-sites-root');
											if (rootElement) {
												rootElement.classList.remove('modal-open');
											}
										}}
									>
										{__('continue to wizard', 'maxi-blocks')}
									</a>
									{__(', or ', 'maxi-blocks')}
									<a
										href='#'
										className='maxi-cloud-container__import-popup_close-link'
										onClick={(e) => {
											e.preventDefault();
											if (onRequestClose) onRequestClose();
										}}
									>
										{__('choose another starter site', 'maxi-blocks')}
									</a>
								</>
							) : (
								<>
									{__('Import completed. ', 'maxi-blocks')}
									<a
										href='/wp-admin/edit.php?post_type=page'
										target='_blank'
										rel='noopener noreferrer'
									>
										{__('Browse your pages', 'maxi-blocks')}
									</a>
									{__(', ', 'maxi-blocks')}
									<a
										href='/wp-admin/site-editor.php'
										target='_blank'
										rel='noopener noreferrer'
									>
										{__('change templates', 'maxi-blocks')}
									</a>
									{__(', or ', 'maxi-blocks')}
									<button
										type='button'
										className='maxi-cloud-container__import-popup_close-link'
										onClick={onRequestClose}
									>
										{__('close this window', 'maxi-blocks')}
									</button>
								</>
							)}
						</div>
					) : (
						<button
							type='button'
							className={`maxi-cloud-container__import-popup_button maxi-cloud-container__import-popup_button-import ${
								importStatus === 'loading'
									? 'maxi-cloud-container__import-popup_button-loading'
									: ''
							}`}
							onClick={() => onClickImport(selectedItems)}
							disabled={importStatus === 'loading' || !hasAnySelection(selectedItems)}
						>
							{importStatus === 'loading'
								? __('Importing...', 'maxi-blocks')
								: __('Import', 'maxi-blocks')}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default MaxiImportPopUp;
