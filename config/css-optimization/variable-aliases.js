const aliasMap = {
	'--maxi-primary-color': '--mpc',
	'--maxi-secondary-color': '--msc',
	'--maxi-tertiary-color': '--mtc',
	'--maxi-white': '--mw',
	'--maxi-off-white': '--mow',
	'--maxi-grey': '--mg',
	'--maxi-grey-light': '--mgl',
	'--maxi-grey-dark': '--mgd',
	'--maxi-black': '--mb',
	'--maxi-light-blue': '--mlb',
	'--maxi-light-blue-alt': '--mlba',
	'--maxi-highlight-color': '--mhc',
	'--maxi-light-yellow': '--mly',
	'--maxi-pastel-green': '--mpg',
	'--maxi-mid-green': '--mmg',
	'--maxi-whisper-green': '--mwg',
	'--maxi-cloud-primary': '--mcp',
	'--maxi-cloud-primary-light': '--mcpl',
	'--maxi-cloud-primary-bright': '--mcpb',
	'--maxi-cloud-primary-whisper': '--mcpw',
	'--maxi-cloud-primary-contrast': '--mcpc',
	'--maxi-cloud-hover': '--mch',
	'--maxi-cloud-hover-deep': '--mchd',
	'--maxi-accessibility-grey': '--mag',
	'--maxi-trans-std': '--mt',
	'--maxi-font-sans': '--mf',
	'--maxi-font-system': '--mfs',
	'--maxi-radius-sm': '--mrs',
	// Admin aliases reverted due to build disconnect

	// Safe Class Name Shortening (Component classes only, NOT block names)
	'maxi-tabs-control': 'mtc',
	'maxi-base-control': 'mbc',
	// 'maxi-color-control': 'mcc',
	'maxi-settingstab-control': 'mstc',
	// 'maxi-advanced-number-control': 'manc',

	// Batch 2 Safe Class Name Shortening
	'maxi-toolbar': 'mtb',
	'maxi-placeholder': 'mph',
//	'maxi-components-button': 'mcb', // Reverted: Causes validation error
	'maxi-responsive-tabs-control': 'mrtc',

	// Batch 3 Safe Class Name Shortening
	'maxi-dimensions-control': 'mdc',
	'maxi-typography-control': 'mtyc',
	'maxi-border-control': 'mbdc',
	'maxi-scroll-effects-control': 'msec',

	// Batch 4 Safe Class Name Shortening
	'maxi-cloud-container': 'mclc',
	'maxi-library-modal': 'mlm',
	'maxi-style-cards': 'mscd',
	'maxi-transform-control': 'mtfc',
	'maxi-accordion-control': 'macc',
	'maxi-cloud-masonry-card': 'mcmc',
	'maxi-responsive-selector': 'mrsel',
	'maxi-link-control': 'mlc',
	'maxi-select-control': 'mslc',

	// Batch 6 Safe Class Name Shortening
	'maxi-sidebar': 'msb',
	'maxi-popover-button': 'mpob',
	'maxi-resizable': 'mrsz',

	// Batch 7 Safe Class Name Shortening
	'maxi-cloud-toolbar': 'mctb',
	'maxi-popover': 'mpop', // Distinct from maxi-popover-button
	'maxi-block-indicators': 'mbi',
	'maxi-axis-control': 'maxc',
	'maxi-background-control': 'mbgc',

	// Batch 8 Safe Class Name Shortening
	'maxi-dropdown': 'mdd',
	'maxi-block-library': 'mbl',
//	'maxi-list-block': 'mlb', // Reverted: Causes validation error
	'maxi-toggle-switch': 'mts',

	// Batch 9 Safe Class Name Shortening
	'maxi-font-family-selector': 'mffs',
	'maxi-hover-details': 'mhd',
	'maxi-clip-path-control': 'mcpc',
	'maxi-list-item-control': 'mlic',
	'maxi-default-styles-control': 'mdsc',
	'maxi-alignment-control': 'malc',

	// Batch 10 Safe Class Name Shortening (Editor Only / Non-Persisted)
	'maxi-video-sidebar-url': 'mvsu',
	'maxi-container-arrow': 'mca',
	'maxi-block-inserter': 'mbin',
	'maxi-inter-blocks-inserter': 'mibi',
	'maxi-pagination': 'mpgn',
	'maxi-tabs-content': 'mtbc',

	// Batch 11 (User Requested High-Impact Shortening)
	'maxi-prompt-control': 'mprc',
	'maxi-components-popover': 'mcpop',
	'maxi-scroll-unique-control': 'msuc',
	'maxi-wrapper-block-inserter': 'mwbi',
	'maxi-scroll-combinations-select': 'mscs',

	// Batch 12 (Sub-component Optimization)
	'maxi-prompt-control-results-card': 'mprc-rc',
	'maxi-prompt-control-generate-tab': 'mprc-gt',
	'maxi-prompt-control-history-tab': 'mprc-ht',
	'maxi-prompt-control-modify-tab': 'mprc-mt',
	'maxi-prompt-control-results': 'mprc-res',
	'maxi-wrapper-block-inserter__button-wrapper': 'mwbi-bw',
	'maxi-scroll-unique-control-slider': 'msuc-sl',

	// Batch 13 (Cloud Container - User Requested)
	'maxi-cloud-container__patterns__top-menu__button-connect-pro': 'mclc-tm-cp',
	'maxi-cloud-container__patterns__top-menu__button-go-pro': 'mclc-tm-gp',
	'maxi-cloud-container__details-popup_column-right': 'mclc-dp-cr',
	'maxi-cloud-container__content-svg-shape__search-bar': 'mclc-svg-sb',
	'maxi-cloud-container__details-popup_description': 'mclc-dp-desc',
	'maxi-cloud-container__import-popup_warning-message': 'mcipwm',
	'maxi-cloud-container__patterns__top-menu__wrap': 'mclc-tm-w',
	'maxi-cloud-container__content-svg-shape__categories': 'mclc-svg-cat',
	'maxi-cloud-container__import-popup_main-wrap': 'mclc-ip-mw',
	'maxi-cloud-container__details-popup_actions': 'mclc-dp-act',

	// Batch 14 (User Reported Long Classes)
	'maxi-text-control': 'mtxc',
	'maxi-cloud-toolbar__sign-in': 'mctb-si',

	// Batch 15 (Aggressive Shortening - User Rank 1-30)
	'maxi-prompt-control-result-modify-bar__modification-options': 'mprc-rmb-mo',
	'maxi-cloud-container__patterns__top-menu__show_button': 'mclc-tm-sb',
	'maxi-prompt-control-results-card__top-bar__select-row__id': 'mprc-rc-tb-sr-id',
	'maxi-prompt-control-results-card__clean-history-button': 'mprc-rc-chb',
	'maxi-prompt-control-results-card__top-bar__select-row': 'mprc-rc-tb-sr',
	'maxi-prompt-control-results-card__top-bar__select-row__id_output': 'mprc-rc-tb-sr-ido',
	'maxi-cloud-container__details-popup_column-left': 'mclc-dp-cl',
	'maxi-cloud-container__import-popup_sections-container': 'mclc-ip-sc',
	'maxi-prompt-control-results-card__variant': 'mprc-rc-var',
	'maxi-prompt-control-results-card__show-more': 'mprc-rc-sm',
	'maxi-prompt-control-results-card__scroll-to': 'mprc-rc-st',
	'maxi-prompt-control-results-card__options': 'mprc-rc-opt',
	'maxi-cloud-container__content-svg-shape__button': 'mclc-svg-btn',
	'maxi-prompt-control-results-card__modificator': 'mprc-rc-mod',
	'maxi-prompt-control-results-card__scroll-to__inner': 'mprc-rc-st-in',
	'maxi-prompt-control-results-card__content-length': 'mprc-rc-cl',
	'maxi-prompt-control-results-card__end-of-content': 'mprc-rc-eoc',
	'maxi-prompt-control-generate-tab__textarea': 'mprc-gt-ta',
	'maxi-prompt-control-results-card__content__error': 'mprc-rc-ce',
	'maxi-prompt-control-result-modify-bar__button': 'mprc-rmb-btn',
	'maxi-prompt-control-generate-tab__ai-model': 'mprc-gt-aim',
	'maxi-cloud-container__details-popup_button': 'mclc-dp-btn',
	'maxi-cloud-container__details-popup_section': 'mclc-dp-sec',
	'maxi-cloud-toolbar__buttons-group_close': 'mctb-bg-cls',
	'maxi-cloud-container__patterns__top-menu': 'mclc-tm',
	'maxi-prompt-control-history-tab__abort': 'mprc-ht-abt',
	'maxi-prompt-control-results-card--selected': 'mprc-rc-sel',
	'maxi-cloud-container__import-popup_warning': 'mcipw',
	'maxi-cloud-container__import-popup_section': 'mclc-ip-sec',
	'maxi-cloud-container__import-popup_item': 'mclc-ip-itm',
	'maxi-cloud-container__import-popup_footer': 'mclc-ip-ftr',

	// Batch 16 (Aggressive Shortening - User Rank 31-60)
	'maxi-cloud-container__import-popup_wrap': 'mclc-ip-wrp',
	'maxi-prompt-control-results-card--error': 'mprc-rc-err',
	'maxi-cloud-container__preview-tablet__label': 'mclc-pt-lbl',
	'maxi-cloud-container__preview-mobile__label': 'mclc-pm-lbl',
	'maxi-cloud-container__content-svg-shape': 'mclc-svg',
	'maxi-cloud-container__patterns__sidebar': 'mclc-pat-sb',
	'maxi-cloud-container__import-popup_toggle-all': 'mclc-ip-tgl',
	'maxi-prompt-control-history-buttons': 'mprc-hb',
	'maxi-cloud-container__details-popup': 'mclc-dp',
	'maxi-cloud-container__accordion__title': 'mclc-acc-ttl',
	'maxi-prompt-control__buttons': 'mprc-btns',
	'maxi-cloud-toolbar__responsive-buttons': 'mctb-rb',
	'maxi-cloud-container__patterns__content': 'mclc-pat-cnt',
//	'maxi-background-displayer__iframe-wrapper': 'mbgd-ifw', // Reverted: Causes validation error
	'maxi-components-popover__header-title': 'mcpop-ht',
	'maxi-scroll-unique-control-slider__thumb': 'msuc-sl-thm',
	'maxi-cloud-toolbar__buttons-group': 'mctb-bg',
	'maxi-cloud-container__accordion__open': 'mclc-acc-opn',
	'maxi-cloud-container__svg-icon__sidebar': 'mclc-ico-sb',
	'maxi-scroll-unique-control__slider-wrapper': 'msuc-sl-wrp',
	'maxi-scroll-unique-control-slider__divider': 'msuc-sl-div',
	'maxi-cloud-toolbar__help-button': 'mctb-hb',
	'maxi-cloud-container__accordion__content': 'mclc-acc-cnt',
	'maxi-hover-effect__text__flip-horiz': 'mhe-txt-fh',
	'maxi-scroll-unique-control-slider__add-button': 'msuc-sl-add',
	'maxi-cloud-toolbar__button-preview': 'mctb-bp',

	// Batch 17 (Aggressive Shortening - User Rank 61-100)
	'maxi-hover-effect__text__slide-right': 'mhe-txt-sr',
	'maxi-components-popover__content': 'mcpop-cnt',
	'maxi-cloud-toolbar__button-import': 'mctb-bi',
	'maxi-hover-effect__text__slide-down': 'mhe-txt-sd',
	'maxi-components-popover__header': 'mcpop-hdr',
	'maxi-components-popover__triangle': 'mcpop-tri',
	'maxi-cloud-container__accordion': 'mclc-acc',
	'maxi-hover-effect__text__push-right': 'mhe-txt-pr',
	'maxi-components-popover__arrow': 'mcpop-arr',
	'maxi-hover-effect__text__slide-left': 'mhe-txt-sl',
	'maxi-hover-effect__text__push-down': 'mhe-txt-pd',
	'maxi-image-block-shape-wrapper': 'mib-sw',
	'maxi-prompt-control-results__no-results': 'mprc-res-none',
	'maxi-hover-effect__text__slide-up': 'mhe-txt-su',
	'maxi-hover-effect__text__push-left': 'mhe-txt-pl',
//	'maxi-list-item-block__content': 'mlib-cnt', // Reverted: Causes validation error
// 	'maxi-background-displayer__layer': 'mbgd-l', // Reverted: Causes validation error
	'maxi-components-popover__close': 'mcpop-cls',
	'maxi-cloud-toolbar__button': 'mctb-btn',
	'maxi-cloud-toolbar__line': 'mctb-ln',
	'maxi-slider-block__tracker': 'mslb-trk',
	'maxi-slider-block__wrapper': 'mslb-wrp',
	'maxi-video-block__placeholder': 'mvb-ph',
//	'maxi-background-displayer': 'mbgd', // Reverted: Causes validation error
//	'maxi-background-layer__preview': 'mbgl-prv', // Reverted: Causes validation error
//	'maxi-background-layer__row': 'mbgl-rw', // Reverted: Causes validation error
//	'maxi-background-layer__content': 'mbgl-cnt', // Reverted: Causes validation error
//	'maxi-background-layer__title__text': 'mbgl-ttl-txt', // Reverted: Causes validation error

	// Batch 18 (New Safe Candidates)
	'maxi-transition-control': 'mtransc',
	'maxi-text-shadow-control': 'mtxsc',
	'maxi-shadow-control': 'mshc',
	// 'maxi-advanced-css-control': 'madcc',
	'maxi-flex-settings-control': 'mfsc',
	'maxi-responsive-control': 'mrc',

	// Batch 19 (More Safe Candidates)
	'maxi-media-uploader-control': 'mmuc',
	'maxi-textarea-control': 'mtac',
	'maxi-text-input': 'mti',
	'maxi-icon-control': 'mic',
	'maxi-image-crop-control': 'micc',
	'maxi-gradient-control': 'mgc',
	'maxi-font-weight-control': 'mfwc',

	// Batch 20 (CSS Variables)
	'--maxi-icon-chevron': '--mic',
	'--maxi-icon-chevron-hover': '--mich',
	'--maxi-icon-reset': '--mir',
	'--maxi-icon-reset-hover': '--mirh',
	'--maxi-icon-arrow-right': '--miar',
	'--maxi-icon-check': '--michk',
	'--maxi-icon-cross': '--micr',
};

module.exports = { aliasMap };
