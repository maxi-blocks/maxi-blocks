/**
 * Disables default WordPress 6.8 dragging behavior for Maxi blocks
 */
wp.domReady(() => {
	// Apply event listeners to prevent default dragging behavior
	const disableDefaultDragging = () => {
		const observer = new MutationObserver(mutations => {
			const maxiBlocks = document.querySelectorAll('.maxi-block');

			maxiBlocks.forEach(block => {
				if (!block.classList.contains('maxi-drag-disabled')) {
					// Add flag to avoid setting listeners multiple times
					block.classList.add('maxi-drag-disabled');

					// Prevent default dragging behavior except when explicitly enabled by our Mover
					block.addEventListener(
						'dragstart',
						event => {
							const isDraggableByMover =
								event.target.closest('.toolbar-item__move') !==
								null;
							if (
								!isDraggableByMover &&
								event.target.getAttribute('draggable') !==
									'true'
							) {
								event.preventDefault();
								event.stopPropagation();
							}
						},
						true
					);

					// Prevent touch-based dragging
					block.addEventListener(
						'touchstart',
						event => {
							const isDraggableByMover =
								event.target.closest('.toolbar-item__move') !==
								null;
							if (!isDraggableByMover) {
								// We don't prevent default here to allow normal touch interactions
								// but we prevent the touch from triggering a drag
								block.style.touchAction = 'auto';
							}
						},
						{ passive: true }
					);
				}
			});
		});

		// Observe DOM changes to catch newly added blocks
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: false,
		});

		// Handle iframe editors if present
		const handleIframeEditor = () => {
			const iframe = document.querySelector(
				'iframe[name="editor-canvas"]'
			);
			if (iframe && iframe.contentDocument) {
				observer.observe(iframe.contentDocument.body, {
					childList: true,
					subtree: true,
					attributes: false,
				});
			}
		};

		// Check for iframe initially and watch for changes
		handleIframeEditor();
		setInterval(handleIframeEditor, 2000);
	};

	// Run on load and when editor changes
	disableDefaultDragging();

	// Also run when editor switches between visual/code modes
	const editorModeObserver = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (
				mutation.type === 'attributes' &&
				mutation.attributeName === 'class' &&
				document.body.classList.contains('is-mode-visual')
			) {
				setTimeout(disableDefaultDragging, 500);
			}
		});
	});

	editorModeObserver.observe(document.body, {
		attributes: true,
		attributeFilter: ['class'],
	});
});

export default {};
