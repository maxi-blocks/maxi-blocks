/* eslint-disable no-undef */
jQuery(document).ready(function ($) {
	const MaxiQuickStart = {
		errors: {
			required: maxiQuickStart.strings.required,
			invalidUrl: maxiQuickStart.strings.invalidUrl,
			invalidEmail: maxiQuickStart.strings.invalidEmail,
		},

		init() {
			this.bindEvents();
			this.initMediaUploader();
			this.initValidation();

			// If Status step exists, it should always show warning
			if (
				$('.maxi-quick-start-steps-nav li[data-step="status"]').length
			) {
				$('.maxi-quick-start-steps-nav li[data-step="status"]')
					.removeClass('completed')
					.addClass('warning');
			}

			// Check if modal was open before page reload
			if (localStorage.getItem('maxiStarterSitesModalOpen') === 'true') {
				$('#maxi-starter-sites-root').addClass('modal-open');
				localStorage.removeItem('maxiStarterSitesModalOpen');
			}
		},

		bindEvents() {
			// Navigation
			$('.maxi-quick-start-steps-nav .step').on(
				'click',
				this.handleStepClick
			);

			// Continue button
			$('.maxi-quick-start-actions [data-action="continue"]').on(
				'click',
				() => {
					const currentStep = $(
						'.maxi-quick-start-steps-nav li.active'
					).data('step');

					// If we're on the status step, mark it as warning and go to quick-start
					if (currentStep === 'status') {
						$('.maxi-quick-start-steps-nav li[data-step="status"]')
							.removeClass('completed')
							.addClass('warning');

						// Store warning state in localStorage
						const progress = JSON.parse(
							localStorage.getItem('maxiQuickStartProgress') ||
								'{}'
						);
						progress.statusWarning = true;
						localStorage.setItem(
							'maxiQuickStartProgress',
							JSON.stringify(progress)
						);

						window.location.href = this.updateQueryParam(
							'step',
							'quick_start'
						);
						return;
					}

					const steps = $('.maxi-quick-start-steps-nav li')
						.map(function () {
							return $(this).data('step');
						})
						.get();

					const currentIndex = steps.indexOf(currentStep);

					// For other steps, go to the next step
					if (currentIndex < steps.length - 1) {
						const nextStep = steps[currentIndex + 1];
						window.location.href = this.updateQueryParam(
							'step',
							nextStep
						);
					}
				}
			);

			// Back button
			$('.maxi-quick-start-actions [data-action="back"]').on(
				'click',
				() => this.previousStep()
			);

			// Save actions
			$('[data-action="save-welcome"]').on('click', () =>
				this.saveWelcomeSettings()
			);
			$('[data-action="complete"]').on('click', () =>
				this.completeQuickStart()
			);
			$('[data-action="save-design"]').on('click', () =>
				this.saveDesignSettings()
			);

			// Starter site selection
			$('#choose-starter-site, .change-starter-site').on('click', () => {
				$('#maxi-starter-sites-root').addClass('modal-open');
			});

			// Theme activation
			$('.activate-theme').on('click', function () {
				const $button = $(this);
				const theme = $button.data('theme');
				$button.prop('disabled', true);
				MaxiQuickStart.showLoader();

				$.ajax({
					url: maxiQuickStart.ajaxUrl,
					type: 'POST',
					data: {
						action: 'maxi_activate_theme',
						nonce: maxiQuickStart.nonce,
						theme,
					},
					success(response) {
						if (response.success) {
							const $newButton = $('<button>', {
								type: 'button',
								class: 'button button-primary',
								disabled: true,
								html: `<span class="dashicons dashicons-yes"></span> ${maxiQuickStart.strings.activeTheme}`,
							});
							$button.replaceWith($newButton);

							setTimeout(() => {
								window.location.reload();
							}, 500);
						} else {
							console.error(
								response.data || 'Error activating theme'
							);
						}
					},
					error() {
						console.error('Error activating theme');
						$button.prop('disabled', false);
					},
					complete() {
						MaxiQuickStart.hideLoader();
					},
				});
			});
		},

		initMediaUploader() {
			// Add remove button handlers for existing buttons on page load
			$('.remove-site-logo').on('click', function () {
				$('input[name="site_logo_id"]').val('');
				$('.current-site-logo').remove();
				$('#upload-site-logo').text(maxiQuickStart.strings.uploadLogo);
				$(this).remove();
			});

			$('.remove-site-icon').on('click', function () {
				$('input[name="site_icon_id"]').val('');
				$('.current-site-icon').remove();
				$('#upload-site-icon').text(maxiQuickStart.strings.uploadIcon);
				$(this).remove();
			});

			// For site logo
			$('#upload-site-logo').on('click', function (e) {
				e.preventDefault();

				const frame = wp.media({
					title: maxiQuickStart.strings.selectLogo,
					multiple: false,
					library: {
						type: 'image',
					},
					button: {
						text: maxiQuickStart.strings.useAsLogo,
					},
				});

				frame.on('select', function () {
					const attachment = frame
						.state()
						.get('selection')
						.first()
						.toJSON();

					// Update or create the preview
					let $logoWrapper = $('.current-site-logo');
					if (!$logoWrapper.length) {
						$logoWrapper = $('<div>', {
							class: 'current-site-logo',
						}).insertBefore('#upload-site-logo');
					}

					$logoWrapper.html(`
						<p>${maxiQuickStart.strings.currentLogo}</p>
						<img src="${attachment.url}" alt="Current site logo" />
					`);

					// Update the hidden input
					$('input[name="site_logo_id"]').val(attachment.id);

					// Update button text and show remove button
					$('#upload-site-logo').text(
						maxiQuickStart.strings.changeLogo
					);

					// Add remove button if it doesn't exist
					if (!$('.remove-site-logo').length) {
						$('<button>', {
							type: 'button',
							class: 'button remove-site-logo',
							text: maxiQuickStart.strings.remove,
						}).insertAfter('#upload-site-logo');

						// Bind remove event to the new button
						$('.remove-site-logo').on('click', function () {
							$('input[name="site_logo_id"]').val('');
							$('.current-site-logo').remove();
							$('#upload-site-logo').text(
								maxiQuickStart.strings.uploadLogo
							);
							$(this).remove();
						});
					}
				});

				frame.open();
			});

			// For site icon
			$('#upload-site-icon').on('click', function (e) {
				e.preventDefault();

				const frame = wp.media({
					title: maxiQuickStart.strings.selectIcon,
					multiple: false,
					library: {
						type: 'image',
					},
					button: {
						text: maxiQuickStart.strings.useAsIcon,
					},
				});

				frame.on('select', function () {
					const attachment = frame
						.state()
						.get('selection')
						.first()
						.toJSON();

					// Update or create the preview
					let $iconWrapper = $('.current-site-icon');
					if (!$iconWrapper.length) {
						$iconWrapper = $('<div>', {
							class: 'current-site-icon',
						}).insertBefore('#upload-site-icon');
					}

					$iconWrapper.html(`
						<p>${maxiQuickStart.strings.currentIcon}</p>
						<img src="${attachment.url}" alt="Current site icon" />
					`);

					// Update the hidden input
					$('input[name="site_icon_id"]').val(attachment.id);

					// Update button text and show remove button
					$('#upload-site-icon').text(
						maxiQuickStart.strings.changeIcon
					);

					// Add remove button if it doesn't exist
					if (!$('.remove-site-icon').length) {
						$('<button>', {
							type: 'button',
							class: 'button remove-site-icon',
							text: maxiQuickStart.strings.remove,
						}).insertAfter('#upload-site-icon');

						// Bind remove event to the new button
						$('.remove-site-icon').on('click', function () {
							$('input[name="site_icon_id"]').val('');
							$('.current-site-icon').remove();
							$('#upload-site-icon').text(
								maxiQuickStart.strings.uploadIcon
							);
							$(this).remove();
						});
					}
				});

				frame.open();
			});
		},

		handleStepClick(e) {
			const stepKey = $(this).data('step');
			if (stepKey) {
				window.location.href = `?page=maxi-blocks-quick-start&step=${stepKey}`;
			}
		},

		nextStep() {
			const currentStep =
				new URLSearchParams(window.location.search).get('step') ||
				'quick_start';
			const steps = [
				'quick_start',
				'theme',
				'brand_identity',
				'starter_site',
				'finish',
			];
			let currentIndex = steps.indexOf(currentStep);

			if (
				currentStep === 'brand_identity' &&
				maxiQuickStart.initialThemeWasMaxiBlocksGo
			) {
				currentIndex = steps.indexOf('theme');
			}

			if (currentIndex < steps.length - 1) {
				window.location.href = `?page=maxi-blocks-quick-start&step=${
					steps[currentIndex + 1]
				}`;
			}
		},

		previousStep() {
			const currentStep =
				new URLSearchParams(window.location.search).get('step') ||
				'quick_start';
			const steps = [
				'quick_start',
				'theme',
				'brand_identity',
				'starter_site',
				'finish',
			];
			let currentIndex = steps.indexOf(currentStep);

			if (
				currentStep === 'brand_identity' &&
				maxiQuickStart.initialThemeWasMaxiBlocksGo
			) {
				currentIndex = steps.indexOf('theme') + 1;
			}

			if (currentIndex > 0) {
				window.location.href = `?page=maxi-blocks-quick-start&step=${
					steps[currentIndex - 1]
				}`;
			}
		},

		saveWelcomeSettings() {
			if (!this.validateStep()) return;

			const $permalinkSelect = $('select[name="permalink_structure"]');
			const selectedPermalink = $permalinkSelect.val();

			this.showLoader();

			$.ajax({
				url: maxiQuickStart.ajaxUrl,
				type: 'POST',
				data: {
					action: 'maxi_save_welcome_settings',
					nonce: maxiQuickStart.nonce,
					site_title: $('input[name="site_title"]').val(),
					site_tagline: $('input[name="site_tagline"]').val(),
					site_language: $('select[name="site_language"]').val(),
					timezone_string: $('select[name="timezone_string"]').val(),
					permalink_structure: selectedPermalink,
					site_icon_id: $('input[name="site_icon_id"]').val(),
				},
				success: response => {
					if (response.success) {
						if ($permalinkSelect.length) {
							$permalinkSelect
								.find('option')
								.prop('selected', false);
							$permalinkSelect
								.find(`option[value="${selectedPermalink}"]`)
								.prop('selected', true);
						}
						this.saveProgress('quick_start');
						this.nextStep();
					} else {
						this.showError(
							$('.maxi-quick-start-content'),
							response.data
						);
					}
				},
				error: () => {
					this.showError(
						$('.maxi-quick-start-content'),
						'An error occurred while saving. Please try again.'
					);
				},
				complete: () => {
					this.hideLoader();
				},
			});
		},

		saveDesignSettings() {
			this.showLoader();

			$.ajax({
				url: maxiQuickStart.ajaxUrl,
				type: 'POST',
				data: {
					action: 'maxi_save_design_settings',
					nonce: maxiQuickStart.nonce,
					site_icon_id: $('input[name="site_icon_id"]').val(),
					site_logo_id: $('input[name="site_logo_id"]').val(),
				},
				success: response => {
					if (response.success) {
						this.saveProgress('brand_identity');
						this.nextStep();
					} else {
						this.showError(
							$('.maxi-quick-start-content'),
							response.data || 'Error saving design settings'
						);
					}
				},
				error: () => {
					this.showError(
						$('.maxi-quick-start-content'),
						'An error occurred while saving. Please try again.'
					);
				},
				complete: () => {
					this.hideLoader();
				},
			});
		},

		completeQuickStart() {
			this.showLoader();
			$.ajax({
				url: maxiQuickStart.ajaxUrl,
				type: 'POST',
				data: {
					action: 'maxi_complete_quick_start',
					nonce: maxiQuickStart.nonce,
				},
				success: () => {
					this.hideLoader();
					window.location.href = `${maxiQuickStart.adminUrl}site-editor.php`;
				},
				error: () => {
					this.showError(
						$('.maxi-quick-start-content'),
						'An error occurred while completing the quick start. Please try again.'
					);
					this.hideLoader();
				},
			});
		},

		initValidation() {
			$('input[required], select[required]').addClass('maxi-validate');

			$(document).on('blur', '.maxi-validate', e => {
				this.validateField($(e.target));
			});
		},

		validateField($field) {
			if ($field.prop('required') && !$field.val()) {
				this.showError($field, this.errors.required);
				return false;
			}

			const value = $field.val();
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

			// Remove error if it exists
			const $error = $field.next('.maxi-error');
			if ($error.length) {
				$error.remove();
			}

			return true;
		},

		validateStep() {
			const $fields = $('.maxi-quick-start-content .maxi-validate');
			let isValid = true;

			$fields.each((_, field) => {
				if (!this.validateField($(field))) {
					isValid = false;
				}
			});

			return isValid;
		},

		showError($element, message) {
			const $error = $element.next('.maxi-error');
			if ($error.length) {
				$error.text(message);
			} else {
				$('<span>', {
					class: 'maxi-error',
					text: message,
				}).insertAfter($element);
			}
		},

		isValidUrl(url) {
			try {
				// Use URL constructor to validate without assigning
				return Boolean(new URL(url));
			} catch {
				return false;
			}
		},

		isValidEmail(email) {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		},

		showLoader() {
			$('.maxi-quick-start-content').addClass('loading');
			$('.maxi-loader').show();
		},

		hideLoader() {
			$('.maxi-quick-start-content').removeClass('loading');
			$('.maxi-loader').hide();
		},

		saveProgress(step) {
			const progress = JSON.parse(
				localStorage.getItem('maxiQuickStartProgress') || '{}'
			);
			progress[step] = true;
			localStorage.setItem(
				'maxiQuickStartProgress',
				JSON.stringify(progress)
			);
			this.updateStepStatus();
		},

		getProgress() {
			return JSON.parse(
				localStorage.getItem('maxiQuickStartProgress') || '{}'
			);
		},

		updateStepStatus() {
			const progress = this.getProgress();
			$('.maxi-quick-start-steps-nav .step').each(function () {
				const stepName = $(this).data('step');
				// Skip the Status step entirely - it should never change from warning
				if (stepName === 'status') {
					return;
				}
				if (progress[stepName]) {
					$(this).addClass('completed');
				}
			});
		},

		// Helper function to update URL query parameter
		updateQueryParam(key, value) {
			const baseUrl = window.location.href.split('?')[0];
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.set(key, value);
			return `${baseUrl}?${urlParams.toString()}`;
		},
	};

	MaxiQuickStart.init();
});
