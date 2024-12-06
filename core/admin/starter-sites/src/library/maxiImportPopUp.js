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
import { useState } from 'react';

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
`;

const MaxiImportPopUp = ({
	url,
	title,
	cost,
	templates,
	pages,
	patterns,
	sc,
	contentXML,
	onRequestClose,
}) => {
	// Add check for WordPress Importer status from localized data
	const wpImporterStatus =
		window.maxiStarterSites?.wpImporterStatus || 'missing';

	const [selectedItems, setSelectedItems] = useState(() => {
		const initialState = {
			templates: {},
			pages: {},
			patterns: {},
			sc: isValidValue(sc),
			// Only set contentXML to true if plugin is active and value is valid
			contentXML:
				wpImporterStatus === 'active' && isValidValue(contentXML),
			title,
		};

		templates?.forEach(template => {
			initialState.templates[template.name] = true;
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

	const handleToggleChange = (type, name, value) => {
		// Prevent changing contentXML if plugin is not active
		if (type === 'contentXML' && wpImporterStatus !== 'active') {
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

			// Toggle templates
			if (templates) {
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
				console.log('Import response:', response);
				window.maxiStarterSites.currentStarterSite = title;
				setImportStatus('done');
			})
			.catch(error => {
				console.error('Import error full details:', error);
				console.error('Error status:', error.status);
				console.error('Error message:', error.message);
				console.error('Error data:', error.data);
				setImportStatus('idle');
			});
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
								selected={Object.values(selectedItems).every(
									item =>
										typeof item === 'boolean'
											? item
											: Object.values(item).every(
													val => val
											  )
								)}
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
										wpImporterStatus !== 'active'
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
										disabled={wpImporterStatus !== 'active'}
									/>
									{wpImporterStatus !== 'active' && (
										<div className='maxi-cloud-container__import-popup_warning-message'>
											{wpImporterStatus ===
											'installed' ? (
												<p>
													{__(
														'Please ',
														'maxi-blocks'
													)}
													<a
														href='/wp-admin/plugins.php'
														target='_blank'
														rel='noopener noreferrer'
													>
														{__(
															'activate',
															'maxi-blocks'
														)}
													</a>
													{__(
														' WordPress Importer plugin to import content XML files.',
														'maxi-blocks'
													)}
												</p>
											) : (
												<p>
													{__(
														'Please ',
														'maxi-blocks'
													)}
													<a
														href='https://wordpress.org/plugins/wordpress-importer/'
														target='_blank'
														rel='noopener noreferrer'
													>
														{__(
															'install and activate',
															'maxi-blocks'
														)}
													</a>
													{__(
														' WordPress Importer plugin to import content XML files.',
														'maxi-blocks'
													)}
												</p>
											)}
										</div>
									)}
								</div>
								{wpImporterStatus === 'active' && (
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
							{templates.map(template => (
								<div
									key={template.name}
									className='maxi-cloud-container__import-popup_item'
								>
									<ToggleSwitch
										label={template.name}
										selected={
											selectedItems.templates[
												template.name
											]
										}
										onChange={val =>
											handleToggleChange(
												'templates',
												template.name,
												val
											)
										}
									/>
									<p>
										{getTemplateDescription(template.name)}
									</p>
								</div>
							))}
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
					<button
						type='button'
						className={`maxi-cloud-container__import-popup_button maxi-cloud-container__import-popup_button-import ${
							importStatus === 'loading'
								? 'maxi-cloud-container__import-popup_button-loading'
								: ''
						}`}
						onClick={() => onClickImport(selectedItems)}
						disabled={
							importStatus === 'loading' ||
							importStatus === 'done'
						}
					>
						{importStatus === 'loading'
							? __('Importing...', 'maxi-blocks')
							: importStatus === 'done'
							? __('Done', 'maxi-blocks')
							: __('Import', 'maxi-blocks')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default MaxiImportPopUp;
