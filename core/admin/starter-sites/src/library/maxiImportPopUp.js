/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '../components/toggle-switch';

/**
 * External dependencies
 */
import { useState } from 'react';

const MaxiImportPopUp = ({
	url,
	title,
	cost,
	templates,
	pages,
	patterns,
	sc,
	contentXML,
}) => {
	const [selectedItems, setSelectedItems] = useState(() => {
		const initialState = {
			templates: {},
			pages: {},
			patterns: {},
			sc: sc !== '',
			contentXML: contentXML !== '',
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

	const handleToggleChange = (type, name, value) => {
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

	return (
		<>
			<div className='maxi-cloud-container__import-popup_main-wrap'>
				<div className='maxi-cloud-container__import-popup_wrap'>
					<div className='maxi-cloud-container__import-popup_content'>
						{templates?.length > 0 && sc !== '' && (
							<div className='maxi-cloud-container__import-popup_warning'>
								<h2 className='maxi-cloud-container__import-popup_warning-title'>
									{__(
										'Important! Templates, template parts and Style Card will overwrite your current correspondent items',
										'maxi-blocks'
									)}
								</h2>
							</div>
						)}
						{(sc !== '' || contentXML !== '') && (
							<div className='maxi-cloud-container__import-popup_section'>
								<h2 className='maxi-cloud-container__import-popup_section-title'>
									{__('General', 'maxi-blocks')}
								</h2>
								<div className='maxi-cloud-container__import-popup_section-content'>
									{sc !== '' && (
										<div
											key='sc'
											className='maxi-cloud-container__import-popup_item'
										>
											<ToggleSwitch
												label={__(
													'Style Card',
													'maxi-blocks'
												)}
												selected={
													selectedItems.sc || false
												}
												onChange={val =>
													handleToggleChange(
														'sc',
														'sc',
														val
													)
												}
											/>
										</div>
									)}
									{contentXML !== '' && (
										<div
											key='contentXML'
											className='maxi-cloud-container__import-popup_item'
										>
											<ToggleSwitch
												label={__(
													'Content XML',
													'maxi-blocks'
												)}
												selected={
													selectedItems.contentXML || false
												}
												onChange={val =>
													handleToggleChange(
														'contentXML',
														'contentXML',
														val
													)
												}
											/>
										</div>
									)}
								</div>
							</div>
						)}
						{templates?.length > 0 && (
							<div className='maxi-cloud-container__import-popup_section'>
								<h2 className='maxi-cloud-container__import-popup_section-title'>
									{__('Templates', 'maxi-blocks')}
								</h2>
								<div className='maxi-cloud-container__import-popup_section-content'>
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
													] || false
												}
												onChange={val =>
													handleToggleChange(
														'templates',
														template.name,
														val
													)
												}
											/>
										</div>
									))}
								</div>
							</div>
						)}

						{pages?.length > 0 && (
							<div className='maxi-cloud-container__import-popup_section'>
								<h2 className='maxi-cloud-container__import-popup_section-title'>
									{__('Pages', 'maxi-blocks')}
								</h2>
								<div className='maxi-cloud-container__import-popup_section-content'>
									{pages.map(page => (
										<div
											key={page.name}
											className='maxi-cloud-container__import-popup_item'
										>
											<ToggleSwitch
												label={page.name}
												selected={
													selectedItems.pages[
														page.name
													] || false
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
							</div>
						)}

						{patterns?.length > 0 && (
							<div className='maxi-cloud-container__import-popup_section'>
								<h2 className='maxi-cloud-container__import-popup_section-title'>
									{__('Patterns', 'maxi-blocks')}
								</h2>
								<div className='maxi-cloud-container__import-popup_section-content'>
									{patterns.map(pattern => (
										<div
											key={pattern.name}
											className='maxi-cloud-container__import-popup_item'
										>
											<ToggleSwitch
												label={pattern.name}
												selected={
													selectedItems.patterns[
														pattern.name
													] || false
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
							</div>
						)}
					</div>
					<button
						type='button'
						key='Import'
						className='maxi-cloud-masonry-card__button'
						value={__('Import', 'maxi-blocks')}
						onClick={() => {}}
					>
						{__('Import', 'maxi-blocks')}
					</button>
				</div>
				<div className='maxi-cloud-container__import-popup_space'></div>
			</div>
		</>
	);
};

export default MaxiImportPopUp;
