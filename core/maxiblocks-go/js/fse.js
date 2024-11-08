document.addEventListener('DOMContentLoaded', () => {
	function getTemplateName(currentTemplateSlug) {
		// Determine the template name based on currentTemplateSlug
		let templateName;

		if (
			currentTemplateSlug.includes('category') ||
			currentTemplateSlug.includes('tag') ||
			currentTemplateSlug.includes('author') ||
			currentTemplateSlug.includes('taxonomy') ||
			currentTemplateSlug.includes('date')
		) {
			templateName = 'Archive';
		} else if (currentTemplateSlug.includes('404')) {
			templateName = '404 Not Found';
		} else if (currentTemplateSlug.includes('home')) {
			templateName = 'Blog Home';
		} else if (currentTemplateSlug.includes('front-page')) {
			templateName = 'Front Page';
		} else if (currentTemplateSlug.includes('search')) {
			templateName = 'Search';
		} else if (currentTemplateSlug.includes('single')) {
			templateName = 'Single Post';
		} else {
			templateName = 'Index';
		}

		return templateName;
	}
	function checkAndReplaceIframe() {
		const editorPrefix = 'edit-site-patterns-maxiblocks-go/';

		// eslint-disable-next-line no-undef
		const { url, directories } = maxiblocks;

		if (!directories) {
			return;
		}

		const version = '1.1.9'; // increment this version if you want to reset preview images cache

		// Loop through the directories to extract the IDs and get the buttons
		directories.forEach(directory => {
			// Extract the ID part from the URL
			const idPart = directory.split('/').pop(); // Gets the last part of the URL

			let useIdPart = idPart;
			if (idPart === 'page-404') {
				useIdPart = 'page:-404';
			}
			// Construct the full ID by prefixing the editorPrefix
			const fullId = `${editorPrefix}${useIdPart}`;

			// Get the button by ID
			const button =
				document.getElementById(fullId) ||
				document.getElementById(useIdPart);

			// If the button exists, add it to the buttons array
			if (
				button &&
				!button.classList.contains('maxiblocks-go-custom-pattern') &&
				!button.classList.contains('query-results')
			) {
				const iframe = button.querySelector('iframe');
				const image = button.querySelector(
					'.maxi-blocks-pattern-preview img'
				);

				const imgSrc = `${url}${idPart}/preview-${idPart}.webp`;
				const imgAlt = `${idPart} preview image`;

				if (iframe || image) {
					button.classList.add('maxiblocks-go-custom-pattern');
					const img = new Image();
					img.src = `${imgSrc}?ver=${version}`;
					img.alt = imgAlt;
					img.classList.add('maxiblocks-go-pattern-preview-image');

					// Get the direct parent of the iframe
					if (iframe) {
						const iframeParent = iframe?.parentNode;
						if (!iframeParent) {
							return;
						}

						try {
							iframeParent.insertBefore(img, iframe);
							iframe.style.display = 'none';
							const previewImageToHide =
								iframeParent.querySelector(
									'img.maxi-blocks-pattern-preview-image'
								);
							if (previewImageToHide) {
								previewImageToHide.style.display = 'none';
							}
						} catch (error) {
							console.error(
								'Error replacing iframe with image:',
								error
							);
						}
					} else if (image) {
						image.src = imgSrc;
						image.alt = imgAlt;
						image.classList.add(
							'maxiblocks-go-pattern-preview-image'
						);
					}
				}
			} else {
				// WordPress 6.5 fix
				const previewGridsDiv = document.querySelectorAll(
					'div.dataviews-view-grid, div.block-editor-block-patterns-list'
				);

				if (!previewGridsDiv || previewGridsDiv.length === 0) {
					return;
				}

				previewGridsDiv.forEach(previewGridDiv => {
					const gridCards = previewGridDiv.querySelectorAll(
						':scope > .dataviews-view-grid__card, .block-editor-block-patterns-list__list-item'
					);

					if (!gridCards || gridCards.length === 0) {
						return;
					}

					let isFirstCard = true;
					gridCards.forEach(card => {
						if (
							card.classList.contains(
								'maxiblocks-go-custom-pattern'
							)
						) {
							isFirstCard = false;
							return;
						}

						const titleDiv =
							card.querySelector(
								'div.edit-site-patterns__pattern-title'
							) ||
							card.querySelector(
								'div.dataviews-view-grid__title-actions'
							);
						let titleId = card.querySelector(
							'div.block-editor-block-patterns-list__item'
						)?.id;
						if (titleId && !titleId.includes('maxiblocks-go/')) {
							titleId = card
								.querySelector(
									'div.block-editor-block-patterns-list__item'
								)
								?.getAttribute('aria-label')
								?.toLowerCase()
								?.replace(/\s+/g, '-');
						}

						if (titleDiv || titleId) {
							// Get the text, convert to lowercase, and replace spaces with dashes
							const modifiedText = titleDiv
								? titleDiv?.textContent
										?.toLowerCase()
										?.replace(/\s+/g, '-')
								: titleId?.replace('maxiblocks-go/', '');
							if (modifiedText === useIdPart) {
								isFirstCard = false;
								const src = `${url}${idPart}/preview-${idPart}.webp`;
								const alt = `${modifiedText} preview image`;
								const imageToReplace = card.querySelector(
									'.maxi-blocks-pattern-preview img'
								);

								if (imageToReplace) {
									imageToReplace.src = src;
									imageToReplace.alt = alt;
									imageToReplace.classList.add(
										'maxiblocks-go-pattern-preview-image'
									);
									card.classList.add(
										'maxiblocks-go-custom-pattern'
									);
								} else {
									const iframeToReplace = card.querySelector(
										'.block-editor-block-preview__container iframe'
									);
									if (iframeToReplace) {
										if (!iframeToReplace?.parentNode) {
											return;
										}
										const img = new Image();
										img.src = `${src}?ver=${version}`;
										img.alt = alt;
										img.classList.add(
											'maxiblocks-go-pattern-preview-image'
										);
										iframeToReplace.parentNode?.insertBefore(
											img,
											iframeToReplace
										);
										iframeToReplace.style.display = 'none';
										const previewImageToHide =
											iframeToReplace.parentNode?.querySelector(
												'img.maxi-blocks-pattern-preview-image'
											);
										if (previewImageToHide) {
											previewImageToHide.style.display =
												'none';
										}
										card.classList.add(
											'maxiblocks-go-custom-pattern'
										);
									}
								}
							} else if (isFirstCard) {
								isFirstCard = false;
								const popUpSelectTemplate =
									document.querySelector(
										'.edit-site-start-template-options__modal'
									);
								if (!popUpSelectTemplate) return;
								const currentTemplateSlug =
									wp.data
										.select('core/edit-site')
										?.getEditedPostContext()
										?.templateSlug ||
									wp?.data
										?.select('core/edit-site')
										?.getEditedPostId();
								if (
									!currentTemplateSlug.includes(
										'maxiblocks-go//'
									)
								)
									return;

								const finalTemplateName = `MaxiBlocks Go template type: ${getTemplateName(
									currentTemplateSlug.replace(
										'maxiblocks-go//',
										''
									)
								)}`;

								const titleToReplace = card.querySelector(
									'.block-editor-block-patterns-list__item-title'
								);
								if (!titleToReplace) return;

								titleToReplace.textContent = finalTemplateName;
								card.classList.add(
									'maxiblocks-go-custom-pattern'
								);
							}
						}
					});
				});
			}
		});
	}

	// Set an interval to periodically check for the button and the iframe
	const checkInterval = setInterval(checkAndReplaceIframe, 500); // Check every 500 milliseconds
});
