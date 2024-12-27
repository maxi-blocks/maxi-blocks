const MaxiOnboarding = {
	errors: {
		required: 'This field is required',
		invalidUrl: 'Please enter a valid URL',
		invalidEmail: 'Please enter a valid email address',
	},

	init() {
		this.bindEvents();
		this.initMediaUploader();
		this.initValidation();
	},

	bindEvents() {
		// Navigation
		document.querySelectorAll('.maxi-onboarding-steps-nav .step')
			.forEach(step => step.addEventListener('click', this.handleStepClick));

		document.querySelectorAll('.maxi-onboarding-actions [data-action="continue"]')
			.forEach(btn => btn.addEventListener('click', () => this.nextStep()));

		document.querySelectorAll('.maxi-onboarding-actions [data-action="back"]')
			.forEach(btn => btn.addEventListener('click', () => this.previousStep()));

		// Save actions
		document.querySelector('[data-action="save-welcome"]')?.addEventListener('click', () => this.saveWelcomeSettings());
		document.querySelector('[data-action="complete"]')?.addEventListener('click', () => this.completeOnboarding());

		// Starter site selection
		const starterSiteElements = [
			document.getElementById('choose-starter-site'),
			...document.querySelectorAll('.change-starter-site'),
		];

		starterSiteElements.forEach(element => {
			element?.addEventListener('click', () => {
				document.getElementById('maxi-starter-sites-root')?.classList.add('modal-open');
			});
		});

		// Theme activation
		document.querySelectorAll('.activate-theme').forEach(button => {
			button.addEventListener('click', async () => {
				const theme = button.dataset.theme;
				button.disabled = true;
				this.showLoader();

				try {
					const response = await fetch(maxiOnboarding.ajaxUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: new URLSearchParams({
							action: 'maxi_activate_theme',
							nonce: maxiOnboarding.nonce,
							theme,
						}),
					});

					const data = await response.json();

					if (data.success) {
						const newButton = document.createElement('button');
						newButton.type = 'button';
						newButton.className = 'button button-primary';
						newButton.disabled = true;
						newButton.innerHTML = `
							<span class="dashicons dashicons-yes"></span>
							${maxiOnboarding.strings.activeTheme}
						`;
						button.replaceWith(newButton);
					} else {
						alert(data.data || 'Error activating theme');
					}
				} catch (error) {
					alert('Error activating theme');
					button.disabled = false;
				} finally {
					this.hideLoader();
				}
			});
		});
	},

	initMediaUploader() {
		let logoFrame;
		let iconFrame;

		document.getElementById('upload-logo')?.addEventListener('click', (e) => {
			e.preventDefault();

			if (logoFrame) {
				logoFrame.open();
				return;
			}

			logoFrame = wp.media.frames.logoFrame = wp.media({
				title: 'Select Site Logo',
				button: { text: 'Use this image' },
				states: [
					new wp.media.controller.Library({
						title: 'Select Site Logo',
						library: wp.media.query({ type: 'image' }),
						multiple: false,
						date: false,
					}),
				],
			});

			logoFrame.on('select', () => {
				const attachment = logoFrame.state().get('selection').first().toJSON();
				const preview = document.getElementById('logo-preview');
				if (preview) {
					preview.innerHTML = `<img src="${attachment.url}" style="max-width: 200px;" />`;
					preview.dataset.attachmentId = attachment.id;
				}
			});

			logoFrame.open();
		});

		// Similar update for site icon uploader
		document.getElementById('upload-icon')?.addEventListener('click', (e) => {
			e.preventDefault();

			if (iconFrame) {
				iconFrame.open();
				return;
			}

			iconFrame = wp.media.frames.iconFrame = wp.media({
				title: 'Select Site Icon',
				button: { text: 'Use this image' },
				states: [
					new wp.media.controller.Library({
						title: 'Select Site Icon',
						library: wp.media.query({ type: 'image' }),
						multiple: false,
						date: false,
					}),
				],
			});

			iconFrame.on('select', () => {
				const attachment = iconFrame.state().get('selection').first().toJSON();
				const preview = document.getElementById('site-icon-preview');
				if (preview) {
					preview.innerHTML = `<img src="${attachment.url}" style="max-width: 64px;" />`;
					preview.dataset.attachmentId = attachment.id;
				}
			});

			iconFrame.open();
		});
	},

	handleStepClick(e) {
		const stepKey = e.currentTarget.dataset.step;
		if (stepKey) {
			window.location.href = `?page=maxi-blocks-onboarding&step=${stepKey}`;
		}
	},

	nextStep() {
		const currentStep =
			new URLSearchParams(window.location.search).get('step') ||
			'identity';
		const steps = [
			'identity',
			'theme',
			'design',
			'starter_site',
			'finish',
		];
		let currentIndex = steps.indexOf(currentStep);

		// Skip theme step only if it was active initially
		if (
			currentStep === 'identity' &&
			maxiOnboarding.initialThemeWasMaxiBlocksGo
		) {
			currentIndex = steps.indexOf('theme');
		}

		if (currentIndex < steps.length - 1) {
			window.location.href = `?page=maxi-blocks-onboarding&step=${
				steps[currentIndex + 1]
			}`;
		}
	},

	previousStep() {
		const currentStep =
			new URLSearchParams(window.location.search).get('step') ||
			'identity';
		const steps = [
			'identity',
			'theme',
			'design',
			'starter_site',
			'finish',
		];
		let currentIndex = steps.indexOf(currentStep);

		// Skip theme step only if it was active initially
		if (
			currentStep === 'design' &&
			maxiOnboarding.initialThemeWasMaxiBlocksGo
		) {
			currentIndex = steps.indexOf('theme') + 1;
		}

		if (currentIndex > 0) {
			window.location.href = `?page=maxi-blocks-onboarding&step=${
				steps[currentIndex - 1]
			}`;
		}
	},

	async saveWelcomeSettings() {
		if (!this.validateStep()) return;

		const permalinkSelect = document.querySelector('select[name="permalink_structure"]');
		const selectedPermalink = permalinkSelect?.value;

		this.showLoader();

		try {
			const response = await fetch(maxiOnboarding.ajaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					action: 'maxi_save_welcome_settings',
					nonce: maxiOnboarding.nonce,
					site_title: document.querySelector('input[name="site_title"]')?.value,
					site_tagline: document.querySelector('input[name="site_tagline"]')?.value,
					site_language: document.querySelector('select[name="site_language"]')?.value,
					timezone_string: document.querySelector('select[name="timezone_string"]')?.value,
					permalink_structure: selectedPermalink,
				}),
			});

			const data = await response.json();

			if (data.success) {
				if (permalinkSelect) {
					permalinkSelect.querySelectorAll('option').forEach(option => {
						option.selected = option.value === selectedPermalink;
					});
				}

				this.saveProgress('identity');
				this.nextStep();
			} else {
				this.showError(
					document.querySelector('.maxi-onboarding-content'),
					data.data
				);
			}
		} catch (error) {
			this.showError(
				document.querySelector('.maxi-onboarding-content'),
				'An error occurred while saving. Please try again.'
			);
		} finally {
			this.hideLoader();
		}
	},

	completeOnboarding() {
		fetch(maxiOnboarding.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'maxi_complete_onboarding',
				nonce: maxiOnboarding.nonce,
			}),
		})
			.then(response => response.json())
			.then(() => {
				// Redirect to full site editor
				window.location.href = `${maxiOnboarding.adminUrl}site-editor.php`;
			});
	},

	openTemplateLibrary() {
		// Implementation will depend on your template library system
		// This is a placeholder for the actual implementation
		console.log('Opening template library...');
	},

	addNewPage() {
		// Implementation will depend on your page creation system
		// This is a placeholder for the actual implementation
		console.log('Adding new page...');
	},

	saveDesignSettings() {
		const logoId = document.getElementById('logo-preview')?.dataset.attachmentId;
		const iconId = document.getElementById('site-icon-preview')?.dataset.attachmentId;
		const styleCard = document.querySelector('.current-style-card')?.dataset.styleCard;

		fetch(maxiOnboarding.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'maxi_save_design_settings',
				nonce: maxiOnboarding.nonce,
				site_logo_id: logoId,
				site_icon_id: iconId,
				style_card: styleCard,
			}),
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					this.nextStep();
				}
			});
	},

	savePagesSettings() {
		const homepageId = document.getElementById('homepage-preview')?.dataset.pageId;
		const additionalPages = [];

		document.querySelectorAll('.page-card').forEach(card => {
			const pageData = card.dataset.pageData;
			if (pageData) {
				additionalPages.push(pageData);
			}
		});

		fetch(maxiOnboarding.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'maxi_save_pages_settings',
				nonce: maxiOnboarding.nonce,
				homepage_id: homepageId,
				pages: additionalPages,
			}),
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					this.nextStep();
				}
			});
	},

	saveThemeSettings() {
		const menuDesign = document.getElementById('menu-preview')?.dataset.menuDesign;
		const templates = {
			single_post: document.getElementById('single-post-template')?.value,
			archive: document.getElementById('archive-template')?.value,
			author_archive: document.getElementById('author-archive-template')?.value,
			search_results: document.getElementById('search-results-template')?.value,
			error_404: document.getElementById('404-template')?.value,
		};

		fetch(maxiOnboarding.ajaxUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'maxi_save_theme_settings',
				nonce: maxiOnboarding.nonce,
				menu_design: menuDesign,
				...templates,
			}),
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					this.nextStep();
				}
			});
	},

	initValidation() {
		// Add validation classes to required fields
		document.querySelectorAll('input[required], select[required]').forEach(field => field.classList.add('maxi-validate'));

		// Validate on blur
		document.addEventListener('blur', (e) => {
			const field = e.target;
			if (field.classList.contains('maxi-validate')) {
				this.validateField(field);
			}
		});
	},

	validateField(field) {
		const value = field.value;
		const error = field.nextElementSibling;

		if (field.required && !value) {
			this.showError(field, this.errors.required);
			return false;
		}

		if (
			field.type === 'url' &&
			value &&
			!this.isValidUrl(value)
		) {
			this.showError(field, this.errors.invalidUrl);
			return false;
		}

		if (
			field.type === 'email' &&
			value &&
			!this.isValidEmail(value)
		) {
			this.showError(field, this.errors.invalidEmail);
			return false;
		}

		if (error) {
			error.remove();
		}
		return true;
	},

	validateStep() {
		const currentStep = document.querySelector('.maxi-onboarding-content');
		const fields = currentStep.querySelectorAll('.maxi-validate');
		let isValid = true;

		fields.forEach(field => {
			if (!this.validateField(field)) {
				isValid = false;
			}
		});

		return isValid;
	},

	showError(field, message) {
		const error = field.nextElementSibling;
		if (error) {
			error.textContent = message;
		} else {
			const newError = document.createElement('span');
			newError.className = 'maxi-error';
			newError.textContent = message;
			field.parentNode.appendChild(newError);
		}
	},

	isValidUrl(url) {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	},

	isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	},

	showLoader() {
		document.querySelector('.maxi-onboarding-content').classList.add('loading');
		document.querySelector('.maxi-loader').style.display = 'block';
	},

	hideLoader() {
		document.querySelector('.maxi-onboarding-content').classList.remove('loading');
		document.querySelector('.maxi-loader').style.display = 'none';
	},

	saveProgress(step) {
		const progress = JSON.parse(
			localStorage.getItem('maxiOnboardingProgress') || '{}'
		);
		progress[step] = true;
		localStorage.setItem(
			'maxiOnboardingProgress',
			JSON.stringify(progress)
		);
		this.updateStepStatus();
	},

	getProgress() {
		return JSON.parse(
			localStorage.getItem('maxiOnboardingProgress') || '{}'
		);
	},

	updateStepStatus() {
		const progress = this.getProgress();
		document.querySelectorAll('.maxi-onboarding-steps-nav .step').forEach(step => {
			if (progress[step.dataset.step]) {
				step.classList.add('completed');
			}
		});
	}
};

document.addEventListener('DOMContentLoaded', () => {
	MaxiOnboarding.init();
});
