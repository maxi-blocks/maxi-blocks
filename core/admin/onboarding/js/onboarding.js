jQuery(document).ready(function($) {
	const MaxiOnboarding = {
		errors: {
			required: maxiOnboarding.strings.required,
			invalidUrl: maxiOnboarding.strings.invalidUrl,
			invalidEmail: maxiOnboarding.strings.invalidEmail,
		},

		init() {
			this.bindEvents();
			this.initMediaUploader();
			this.initValidation();
		},

		bindEvents() {
			// Navigation
			$('.maxi-onboarding-steps-nav .step').on('click', this.handleStepClick);
			$('.maxi-onboarding-actions [data-action="continue"]').on('click', () => this.nextStep());
			$('.maxi-onboarding-actions [data-action="back"]').on('click', () => this.previousStep());

			// Save actions
			$('[data-action="save-welcome"]').on('click', () => this.saveWelcomeSettings());
			$('[data-action="complete"]').on('click', () => this.completeOnboarding());
			$('[data-action="save-design"]').on('click', () => this.saveDesignSettings());

			// Starter site selection
			$('#choose-starter-site, .change-starter-site').on('click', () => {
				$('#maxi-starter-sites-root').addClass('modal-open');
			});

			// Theme activation
			$('.activate-theme').on('click', function() {
				const $button = $(this);
				const theme = $button.data('theme');
				$button.prop('disabled', true);
				MaxiOnboarding.showLoader();

				$.ajax({
					url: maxiOnboarding.ajaxUrl,
					type: 'POST',
					data: {
						action: 'maxi_activate_theme',
						nonce: maxiOnboarding.nonce,
						theme: theme
					},
					success: function(response) {
						if (response.success) {
							const $newButton = $('<button>', {
								type: 'button',
								class: 'button button-primary',
								disabled: true,
								html: `<span class="dashicons dashicons-yes"></span> ${maxiOnboarding.strings.activeTheme}`
							});
							$button.replaceWith($newButton);

							setTimeout(() => {
								window.location.reload();
							}, 500);
						} else {
							alert(response.data || 'Error activating theme');
						}
					},
					error: function() {
						alert('Error activating theme');
						$button.prop('disabled', false);
					},
					complete: function() {
						MaxiOnboarding.hideLoader();
					}
				});
			});
		},

		initMediaUploader() {
			// For site logo
			$('#upload-site-logo').on('click', function(e) {
				e.preventDefault();

				const frame = wp.media({
					title: maxiOnboarding.strings.selectLogo,
					multiple: false,
					library: {
						type: 'image'
					},
					button: {
						text: maxiOnboarding.strings.useAsLogo
					}
				});

				frame.on('select', function() {
					const attachment = frame.state().get('selection').first().toJSON();

					// Update or create the preview
					let $logoWrapper = $('.current-site-logo');
					if (!$logoWrapper.length) {
						$logoWrapper = $('<div>', {
							class: 'current-site-logo'
						}).insertBefore('#upload-site-logo');
					}

					$logoWrapper.html(`
						<p>${maxiOnboarding.strings.currentLogo}</p>
						<img src="${attachment.url}" alt="Current site logo" />
					`);

					// Update the hidden input
					$('input[name="site_logo_id"]').val(attachment.id);

					// Update button text and show remove button
					$('#upload-site-logo').text(maxiOnboarding.strings.changeLogo);

					// Add remove button if it doesn't exist
					if (!$('.remove-site-logo').length) {
						$('<button>', {
							type: 'button',
							class: 'button remove-site-logo',
							text: maxiOnboarding.strings.remove
						}).insertAfter('#upload-site-logo');

						// Bind remove event to the new button
						$('.remove-site-logo').on('click', function() {
							$('input[name="site_logo_id"]').val('');
							$('.current-site-logo').remove();
							$('#upload-site-logo').text(maxiOnboarding.strings.uploadLogo);
							$(this).remove();
						});
					}
				});

				frame.open();
			});

			// For site icon
			$('#upload-site-icon').on('click', function(e) {
				e.preventDefault();

				const frame = wp.media({
					title: maxiOnboarding.strings.selectIcon,
					multiple: false,
					library: {
						type: 'image'
					},
					button: {
						text: maxiOnboarding.strings.useAsIcon
					}
				});

				frame.on('select', function() {
					const attachment = frame.state().get('selection').first().toJSON();

					// Update or create the preview
					let $iconWrapper = $('.current-site-icon');
					if (!$iconWrapper.length) {
						$iconWrapper = $('<div>', {
							class: 'current-site-icon'
						}).insertBefore('#upload-site-icon');
					}

					$iconWrapper.html(`
						<p>${maxiOnboarding.strings.currentIcon}</p>
						<img src="${attachment.url}" alt="Current site icon" />
					`);

					// Update the hidden input
					$('input[name="site_icon_id"]').val(attachment.id);

					// Update button text and show remove button
					$('#upload-site-icon').text(maxiOnboarding.strings.changeIcon);

					// Add remove button if it doesn't exist
					if (!$('.remove-site-icon').length) {
						$('<button>', {
							type: 'button',
							class: 'button remove-site-icon',
							text: maxiOnboarding.strings.remove
						}).insertAfter('#upload-site-icon');

						// Bind remove event to the new button
						$('.remove-site-icon').on('click', function() {
							$('input[name="site_icon_id"]').val('');
							$('.current-site-icon').remove();
							$('#upload-site-icon').text(maxiOnboarding.strings.uploadIcon);
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
				window.location.href = `?page=maxi-blocks-onboarding&step=${stepKey}`;
			}
		},

		nextStep() {
			const currentStep = new URLSearchParams(window.location.search).get('step') || 'identity';
			const steps = ['identity', 'theme', 'design', 'starter_site', 'finish'];
			let currentIndex = steps.indexOf(currentStep);

			if (currentStep === 'identity' && maxiOnboarding.initialThemeWasMaxiBlocksGo) {
				currentIndex = steps.indexOf('theme');
			}

			if (currentIndex < steps.length - 1) {
				window.location.href = `?page=maxi-blocks-onboarding&step=${steps[currentIndex + 1]}`;
			}
		},

		previousStep() {
			const currentStep = new URLSearchParams(window.location.search).get('step') || 'identity';
			const steps = ['identity', 'theme', 'design', 'starter_site', 'finish'];
			let currentIndex = steps.indexOf(currentStep);

			if (currentStep === 'design' && maxiOnboarding.initialThemeWasMaxiBlocksGo) {
				currentIndex = steps.indexOf('theme') + 1;
			}

			if (currentIndex > 0) {
				window.location.href = `?page=maxi-blocks-onboarding&step=${steps[currentIndex - 1]}`;
			}
		},

		saveWelcomeSettings() {
			if (!this.validateStep()) return;

			const $permalinkSelect = $('select[name="permalink_structure"]');
			const selectedPermalink = $permalinkSelect.val();

			this.showLoader();

			$.ajax({
				url: maxiOnboarding.ajaxUrl,
				type: 'POST',
				data: {
					action: 'maxi_save_welcome_settings',
					nonce: maxiOnboarding.nonce,
					site_title: $('input[name="site_title"]').val(),
					site_tagline: $('input[name="site_tagline"]').val(),
					site_language: $('select[name="site_language"]').val(),
					timezone_string: $('select[name="timezone_string"]').val(),
					permalink_structure: selectedPermalink,
					site_icon_id: $('input[name="site_icon_id"]').val()
				},
				success: (response) => {
					if (response.success) {
						if ($permalinkSelect.length) {
							$permalinkSelect.find('option').prop('selected', false);
							$permalinkSelect.find(`option[value="${selectedPermalink}"]`).prop('selected', true);
						}
						this.saveProgress('identity');
						this.nextStep();
					} else {
						this.showError($('.maxi-onboarding-content'), response.data);
					}
				},
				error: () => {
					this.showError($('.maxi-onboarding-content'), 'An error occurred while saving. Please try again.');
				},
				complete: () => {
					this.hideLoader();
				}
			});
		},

		saveDesignSettings() {
			this.showLoader();

			$.ajax({
				url: maxiOnboarding.ajaxUrl,
				type: 'POST',
				data: {
					action: 'maxi_save_design_settings',
					nonce: maxiOnboarding.nonce,
					site_icon_id: $('input[name="site_icon_id"]').val(),
					site_logo_id: $('input[name="site_logo_id"]').val()
				},
				success: (response) => {
					if (response.success) {
						this.saveProgress('design');
						this.nextStep();
					} else {
						this.showError($('.maxi-onboarding-content'), response.data || 'Error saving design settings');
					}
				},
				error: () => {
					this.showError($('.maxi-onboarding-content'), 'An error occurred while saving. Please try again.');
				},
				complete: () => {
					this.hideLoader();
				}
			});
		},

		completeOnboarding() {
			$.ajax({
				url: maxiOnboarding.ajaxUrl,
				type: 'POST',
				data: {
					action: 'maxi_complete_onboarding',
					nonce: maxiOnboarding.nonce
				},
				success: () => {
					window.location.href = `${maxiOnboarding.adminUrl}site-editor.php`;
				}
			});
		},

		initValidation() {
			$('input[required], select[required]').addClass('maxi-validate');

			$(document).on('blur', '.maxi-validate', (e) => {
				this.validateField($(e.target));
			});
		},

		validateField($field) {
			const value = $field.val();
			const $error = $field.next('.maxi-error');

			if ($field.prop('required') && !value) {
				this.showError($field, this.errors.required);
				return false;
			}

			if ($field.attr('type') === 'url' && value && !this.isValidUrl(value)) {
				this.showError($field, this.errors.invalidUrl);
				return false;
			}

			if ($field.attr('type') === 'email' && value && !this.isValidEmail(value)) {
				this.showError($field, this.errors.invalidEmail);
				return false;
			}

			$error.remove();
			return true;
		},

		validateStep() {
			const $fields = $('.maxi-onboarding-content .maxi-validate');
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
					text: message
				}).insertAfter($element);
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
			const progress = JSON.parse(localStorage.getItem('maxiOnboardingProgress') || '{}');
			progress[step] = true;
			localStorage.setItem('maxiOnboardingProgress', JSON.stringify(progress));
			this.updateStepStatus();
		},

		getProgress() {
			return JSON.parse(localStorage.getItem('maxiOnboardingProgress') || '{}');
		},

		updateStepStatus() {
			const progress = this.getProgress();
			$('.maxi-onboarding-steps-nav .step').each(function() {
				if (progress[$(this).data('step')]) {
					$(this).addClass('completed');
				}
			});
		}
	};

	MaxiOnboarding.init();
});
