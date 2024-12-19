(function ($) {
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
			$('.maxi-onboarding-steps-nav .step').on(
				'click',
				this.handleStepClick
			);
			$('.maxi-onboarding-actions [data-action="continue"]').on(
				'click',
				this.nextStep
			);
			$('.maxi-onboarding-actions [data-action="back"]').on('click', () =>
				this.previousStep()
			);

			// Save actions
			$('[data-action="save-welcome"]').on(
				'click',
				this.saveWelcomeSettings
			);
			$('[data-action="complete"]').on('click', this.completeOnboarding);

			// Starter site selection
			$('#choose-starter-site, .change-starter-site').on('click', () => {
				$('#maxi-starter-sites-root').addClass('modal-open');
			});
		},

		initMediaUploader() {
			// Site logo uploader
			$('#upload-logo').on('click', function (e) {
				e.preventDefault();

				const uploader = wp.media({
					title: 'Select Site Logo',
					button: {
						text: 'Use this image',
					},
					multiple: false,
				});

				uploader.on('select', function () {
					const attachment = uploader
						.state()
						.get('selection')
						.first()
						.toJSON();
					$('#logo-preview').html(
						`<img src="${attachment.url}" style="max-width: 200px;" />`
					);
				});

				uploader.open();
			});
		},

		handleStepClick(e) {
			const $step = $(e.currentTarget);
			const stepKey = $step.data('step');

			if (stepKey) {
				window.location.href = `?page=maxi-blocks-onboarding&step=${stepKey}`;
			}
		},

		nextStep() {
			const currentStep =
				new URLSearchParams(window.location.search).get('step') ||
				'identity';
			const steps = ['identity', 'design', 'starter_site', 'finish'];
			const currentIndex = steps.indexOf(currentStep);

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
			const steps = ['identity', 'design', 'pages', 'theme', 'finish'];
			const currentIndex = steps.indexOf(currentStep);

			if (currentIndex > 0) {
				window.location.href = `?page=maxi-blocks-onboarding&step=${
					steps[currentIndex - 1]
				}`;
			}
		},

		saveWelcomeSettings() {
			if (!MaxiOnboarding.validateStep()) {
				return;
			}

			$.ajax({
				url: maxiOnboarding.ajaxUrl,
				method: 'POST',
				data: {
					action: 'maxi_save_welcome_settings',
					nonce: maxiOnboarding.nonce,
					site_title: $('input[name="site_title"]').val(),
					site_tagline: $('input[name="site_tagline"]').val(),
					site_language: $('select[name="site_language"]').val(),
					timezone_string: $('select[name="timezone_string"]').val(),
					permalink_structure: $(
						'select[name="permalink_structure"]'
					).val(),
				},
				beforeSend() {
					MaxiOnboarding.showLoader();
				},
				success(response) {
					if (response.success) {
						MaxiOnboarding.saveProgress('identity');
						MaxiOnboarding.nextStep();
					} else {
						MaxiOnboarding.showError(
							$('.maxi-onboarding-content'),
							response.data
						);
					}
				},
				error(xhr, status, error) {
					MaxiOnboarding.showError(
						$('.maxi-onboarding-content'),
						'An error occurred while saving. Please try again.'
					);
				},
				complete() {
					MaxiOnboarding.hideLoader();
				},
			});
		},

		completeOnboarding() {
			$.ajax({
				url: maxiOnboarding.ajaxUrl,
				method: 'POST',
				data: {
					action: 'maxi_complete_onboarding',
					nonce: maxiOnboarding.nonce,
				},
				success(response) {
					if (response.success) {
						window.location.href = response.data.redirect;
					}
				},
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
			const logoId = $('#logo-preview').data('attachment-id');
			const iconId = $('#site-icon-preview').data('attachment-id');
			const styleCard = $('.current-style-card').data('style-card');

			$.ajax({
				url: maxiOnboarding.ajaxUrl,
				method: 'POST',
				data: {
					action: 'maxi_save_design_settings',
					nonce: maxiOnboarding.nonce,
					site_logo_id: logoId,
					site_icon_id: iconId,
					style_card: styleCard,
				},
				success(response) {
					if (response.success) {
						MaxiOnboarding.nextStep();
					}
				},
			});
		},

		savePagesSettings() {
			const homepageId = $('#homepage-preview').data('page-id');
			const additionalPages = [];

			$('.page-card').each(function () {
				const pageData = $(this).data('page-data');
				if (pageData) {
					additionalPages.push(pageData);
				}
			});

			$.ajax({
				url: maxiOnboarding.ajaxUrl,
				method: 'POST',
				data: {
					action: 'maxi_save_pages_settings',
					nonce: maxiOnboarding.nonce,
					homepage_id: homepageId,
					pages: additionalPages,
				},
				success(response) {
					if (response.success) {
						MaxiOnboarding.nextStep();
					}
				},
			});
		},

		saveThemeSettings() {
			const menuDesign = $('#menu-preview').data('menu-design');
			const templates = {
				single_post: $('#single-post-template').val(),
				archive: $('#archive-template').val(),
				author_archive: $('#author-archive-template').val(),
				search_results: $('#search-results-template').val(),
				error_404: $('#404-template').val(),
			};

			$.ajax({
				url: maxiOnboarding.ajaxUrl,
				method: 'POST',
				data: {
					action: 'maxi_save_theme_settings',
					nonce: maxiOnboarding.nonce,
					menu_design: menuDesign,
					...templates,
				},
				success(response) {
					if (response.success) {
						MaxiOnboarding.nextStep();
					}
				},
			});
		},

		initValidation() {
			// Add validation classes to required fields
			$('input[required], select[required]').addClass('maxi-validate');

			// Validate on blur
			$(document).on('blur', '.maxi-validate', function () {
				MaxiOnboarding.validateField($(this));
			});
		},

		validateField($field) {
			const value = $field.val();
			const $error = $field.next('.maxi-error');

			if ($field.prop('required') && !value) {
				this.showError($field, this.errors.required);
				return false;
			}

			if (
				$field.attr('type') === 'url' &&
				value &&
				!this.isValidUrl(value)
			) {
				this.showError($field, this.errors.invalidUrl);
				return false;
			}

			if (
				$field.attr('type') === 'email' &&
				value &&
				!this.isValidEmail(value)
			) {
				this.showError($field, this.errors.invalidEmail);
				return false;
			}

			if ($error.length) {
				$error.remove();
			}
			return true;
		},

		validateStep() {
			const $currentStep = $('.maxi-onboarding-content');
			const $fields = $currentStep.find('.maxi-validate');
			let isValid = true;

			$fields.each(function () {
				if (!MaxiOnboarding.validateField($(this))) {
					isValid = false;
				}
			});

			return isValid;
		},

		showError($field, message) {
			const $error = $field.next('.maxi-error');
			if ($error.length) {
				$error.text(message);
			} else {
				$field.after(`<span class="maxi-error">${message}</span>`);
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
			$('.maxi-onboarding-content').addClass('loading');
			$('.maxi-loader').show();
		},

		hideLoader() {
			$('.maxi-onboarding-content').removeClass('loading');
			$('.maxi-loader').hide();
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
			$('.maxi-onboarding-steps-nav .step').each(function () {
				const step = $(this).data('step');
				if (progress[step]) {
					$(this).addClass('completed');
				}
			});
		},
	};

	$(document).ready(function () {
		MaxiOnboarding.init();
	});
})(jQuery);
