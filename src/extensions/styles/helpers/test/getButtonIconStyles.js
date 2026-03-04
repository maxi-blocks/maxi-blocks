import getButtonIconStyles from '@extensions/styles/helpers/getButtonIconStyles';

describe('getButtonIconStyles', () => {
	it('Should return the correct styles for empty object', () => {
		const result = getButtonIconStyles({
			obj: {},
			blockStyle: 'light',
			hoverOnIcon: false,
			iconWidthHeightRatio: 0.92,
			isHover: false,
			isIB: false,
			prefix: '',
			target: '.maxi-button-block__icon',
			wrapperTarget: '.maxi-button-block__button',
		});

		expect(result).toMatchSnapshot();
	});

	it('Should return the correct styles for random object', () => {
		const result = getButtonIconStyles({
			obj: {
				'icon-inherit': true,
				'icon-content':
					'<?xml version="1.0" encoding="UTF-8"?><svg class="skull-2-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="rgba(var(--maxi-light-color-1,255,255,255),1)" stroke-linejoin="round" stroke-width="2"><path d="M12.639 1.781a9.32 9.32 0 0 0-7.047 2.512 9.42 9.42 0 0 0-2.979 6.854v3.413c0 2.066 1.475 3.793 3.429 4.184.175 1.957 1.823 3.496 3.825 3.496h4.267c2.002 0 3.65-1.539 3.825-3.496 1.953-.391 3.429-2.118 3.429-4.184v-3.112c0-5.093-3.843-9.34-8.747-9.667z"></path><circle cx="8.587" cy="11.147" r="1.707"></circle><circle cx="15.413" cy="11.147" r="1.707"></circle><path d="M13.707 17.559c0 .943-.764.853-1.707.853s-1.707.09-1.707-.853.764-2.56 1.707-2.56 1.707 1.617 1.707 2.56z"></path></svg>',
				'icon-only': false,
				'icon-position': 'right',
				'icon-spacing-general': 5,
				'icon-spacing-unit-general': '%',
				'icon-stroke-general': 2,
				'icon-width-unit-general': 'px',
				'icon-width-general': '124',
				'icon-width-fit-content-general': false,
				'icon-height-unit-general': 'px',
				'icon-height-general': '32',
				'icon-stroke-palette-status': true,
				'icon-stroke-palette-sc-status': false,
				'icon-stroke-palette-color': 1,
				'icon-fill-palette-status': true,
				'icon-fill-palette-sc-status': false,
				'icon-fill-palette-color': 4,
				'icon-background-active-media-general': 'none',
				'icon-stroke-palette-status-hover': true,
				'icon-stroke-palette-color-hover': 6,
				'icon-fill-palette-status-hover': true,
				'icon-fill-palette-color-hover': 2,
				'icon-status-hover': false,
				'icon-status-hover-target': true,
				'icon-padding-top-unit-general': 'px',
				'icon-padding-right-unit-general': 'px',
				'icon-padding-bottom-unit-general': 'px',
				'icon-padding-left-unit-general': 'px',
				'icon-padding-sync-general': 'all',
				'icon-background-palette-status-general': true,
				'icon-background-palette-sc-status-general': false,
				'icon-background-palette-color-general': 4,
				'icon-background-color-wrapper-position-sync-general': 'all',
				'icon-background-color-wrapper-position-top-unit-general': 'px',
				'icon-background-color-wrapper-position-right-unit-general':
					'px',
				'icon-background-color-wrapper-position-bottom-unit-general':
					'px',
				'icon-background-color-wrapper-position-left-unit-general':
					'px',
				'icon-background-color-wrapper-width-general': 100,
				'icon-background-color-wrapper-width-unit-general': '%',
				'icon-background-color-wrapper-height-general': 100,
				'icon-background-color-wrapper-height-unit-general': '%',
				'icon-background-palette-sc-status-general-hover': false,
				'icon-background-gradient-opacity-general': 1,
				'icon-background-gradient-wrapper-position-sync-general': 'all',
				'icon-background-gradient-wrapper-position-top-unit-general':
					'px',
				'icon-background-gradient-wrapper-position-right-unit-general':
					'px',
				'icon-background-gradient-wrapper-position-bottom-unit-general':
					'px',
				'icon-background-gradient-wrapper-position-left-unit-general':
					'px',
				'icon-background-gradient-wrapper-width-general': 100,
				'icon-background-gradient-wrapper-width-unit-general': '%',
				'icon-background-gradient-wrapper-height-general': 100,
				'icon-background-gradient-wrapper-height-unit-general': '%',
				'icon-border-palette-status-general': true,
				'icon-border-palette-sc-status-general': false,
				'icon-border-palette-color-general': 2,
				'icon-border-style-general': 'none',
				'icon-border-top-width-general': 2,
				'icon-border-right-width-general': 2,
				'icon-border-bottom-width-general': 2,
				'icon-border-left-width-general': 2,
				'icon-border-sync-width-general': 'all',
				'icon-border-unit-width-general': 'px',
				'icon-border-sync-radius-general': 'all',
				'icon-border-unit-radius-general': 'px',
				'icon-border-palette-sc-status-general-hover': false,
				svgType: 'Line',
			},
			blockStyle: 'light',
			iconWidthHeightRatio: 0.92,
			target: '.maxi-button-block__icon',
			wrapperTarget: '.maxi-button-block__button',
		});

		expect(result).toMatchSnapshot();
	});

	it('Should work on responsive', () => {
		const result = getButtonIconStyles({
			obj: {
				'icon-inherit': true,
				'icon-content':
					'<?xml version="1.0" encoding="UTF-8"?><svg class="skull-2-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="rgba(var(--maxi-light-color-1,255,255,255),1)" stroke-linejoin="round" stroke-width="2"><path d="M12.639 1.781a9.32 9.32 0 0 0-7.047 2.512 9.42 9.42 0 0 0-2.979 6.854v3.413c0 2.066 1.475 3.793 3.429 4.184.175 1.957 1.823 3.496 3.825 3.496h4.267c2.002 0 3.65-1.539 3.825-3.496 1.953-.391 3.429-2.118 3.429-4.184v-3.112c0-5.093-3.843-9.34-8.747-9.667z"></path><circle cx="8.587" cy="11.147" r="1.707"></circle><circle cx="15.413" cy="11.147" r="1.707"></circle><path d="M13.707 17.559c0 .943-.764.853-1.707.853s-1.707.09-1.707-.853.764-2.56 1.707-2.56 1.707 1.617 1.707 2.56z"></path></svg>',
				'icon-only': false,
				'icon-position': 'right',
				'icon-spacing-general': 5,
				'icon-spacing-xxl': 10,
				'icon-spacing-unit-general': '%',
				'icon-spacing-unit-xxl': 'px',
				'icon-stroke-general': 2,
				'icon-stroke-xxl': 4,
				'icon-width-unit-general': 'px',
				'icon-width-xxl': '124',
				'icon-width-fit-content-general': false,
				'icon-height-unit-general': 'px',
				'icon-height-general': '32',
				'icon-stroke-palette-status': true,
				'icon-stroke-palette-sc-status': false,
				'icon-stroke-palette-color': 1,
				'icon-fill-palette-status': true,
				'icon-fill-palette-sc-status': false,
				'icon-fill-palette-color': 4,
				'icon-background-active-media-general': 'none',
				'icon-stroke-palette-status-hover': true,
				'icon-stroke-palette-color-hover': 6,
				'icon-fill-palette-status-hover': true,
				'icon-fill-palette-color-hover': 2,
				'icon-status-hover': false,
				'icon-status-hover-target': true,
				'icon-padding-top-unit-general': 'px',
				'icon-padding-right-unit-general': 'px',
				'icon-padding-bottom-unit-general': 'px',
				'icon-padding-left-unit-general': 'px',
				'icon-padding-sync-general': 'all',
				'icon-background-palette-status-general': true,
				'icon-background-palette-sc-status-general': false,
				'icon-background-palette-color-general': 4,
				'icon-background-color-wrapper-position-sync-general': 'all',
				'icon-background-color-wrapper-position-top-unit-general': 'px',
				'icon-background-color-wrapper-position-right-unit-general':
					'px',
				'icon-background-color-wrapper-position-bottom-unit-general':
					'px',
				'icon-background-color-wrapper-position-left-unit-general':
					'px',
				'icon-background-color-wrapper-width-general': 100,
				'icon-background-color-wrapper-width-unit-general': '%',
				'icon-background-color-wrapper-height-general': 100,
				'icon-background-color-wrapper-height-unit-general': '%',
				'icon-background-palette-sc-status-general-hover': false,
				'icon-background-gradient-opacity-general': 1,
				'icon-background-gradient-wrapper-position-sync-general': 'all',
				'icon-background-gradient-wrapper-position-top-unit-general':
					'px',
				'icon-background-gradient-wrapper-position-right-unit-general':
					'px',
				'icon-background-gradient-wrapper-position-bottom-unit-general':
					'px',
				'icon-background-gradient-wrapper-position-left-unit-general':
					'px',
				'icon-background-gradient-wrapper-width-general': 100,
				'icon-background-gradient-wrapper-width-unit-general': '%',
				'icon-background-gradient-wrapper-height-general': 100,
				'icon-background-gradient-wrapper-height-unit-general': '%',
				'icon-border-palette-status-general': true,
				'icon-border-palette-sc-status-general': false,
				'icon-border-palette-color-general': 2,
				'icon-border-style-general': 'none',
				'icon-border-top-width-general': 2,
				'icon-border-right-width-general': 2,
				'icon-border-bottom-width-general': 2,
				'icon-border-left-width-general': 2,
				'icon-border-sync-width-general': 'all',
				'icon-border-unit-width-general': 'px',
				'icon-border-sync-radius-general': 'all',
				'icon-border-unit-radius-general': 'px',
				'icon-border-palette-sc-status-general-hover': false,
				svgType: 'Line',
			},
			blockStyle: 'light',
			iconWidthHeightRatio: 0.92,
			target: '.maxi-button-block__icon',
			wrapperTarget: '.maxi-button-block__button',
		});

		expect(result).toMatchSnapshot();
	});

	it('Should work on hover', () => {
		const result = getButtonIconStyles({
			obj: {
				'icon-inherit': false,
				'icon-content':
					'<?xml version="1.0" encoding="UTF-8"?><svg class="skull-2-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke data-hover-stroke stroke="var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-1,255,255,255),1))" stroke-linejoin="round" stroke-width="2"><path d="M12.639 1.781a9.32 9.32 0 0 0-7.047 2.512 9.42 9.42 0 0 0-2.979 6.854v3.413c0 2.066 1.475 3.793 3.429 4.184.175 1.957 1.823 3.496 3.825 3.496h4.267c2.002 0 3.65-1.539 3.825-3.496 1.953-.391 3.429-2.118 3.429-4.184v-3.112c0-5.093-3.843-9.34-8.747-9.667z"></path><circle cx="8.587" cy="11.147" r="1.707"></circle><circle cx="15.413" cy="11.147" r="1.707"></circle><path d="M13.707 17.559c0 .943-.764.853-1.707.853s-1.707.09-1.707-.853.764-2.56 1.707-2.56 1.707 1.617 1.707 2.56z"></path></svg>',
				'icon-only': false,
				'icon-position': 'right',
				'icon-spacing-general': 5,
				'icon-spacing-unit-general': '%',
				'icon-stroke-general': 2,
				'icon-width-unit-general': 'px',
				'icon-width-general': '124',
				'icon-width-fit-content-general': false,
				'icon-height-unit-general': 'px',
				'icon-height-general': '32',
				'icon-stroke-palette-status': true,
				'icon-stroke-palette-sc-status': false,
				'icon-stroke-palette-color': 1,
				'icon-fill-palette-status': true,
				'icon-fill-palette-sc-status': false,
				'icon-fill-palette-color': 4,
				'icon-background-active-media-general': 'none',
				'icon-stroke-palette-status-hover': true,
				'icon-stroke-palette-color-hover': 8,
				'icon-fill-palette-status-hover': true,
				'icon-fill-palette-color-hover': 2,
				'icon-status-hover': true,
				'icon-status-hover-target': true,
				'icon-padding-top-unit-general': 'px',
				'icon-padding-right-unit-general': 'px',
				'icon-padding-bottom-unit-general': 'px',
				'icon-padding-left-unit-general': 'px',
				'icon-padding-sync-general': 'all',
				'icon-background-palette-status-general': true,
				'icon-background-palette-sc-status-general': false,
				'icon-background-palette-color-general': 4,
				'icon-background-color-wrapper-position-sync-general': 'all',
				'icon-background-color-wrapper-position-top-unit-general': 'px',
				'icon-background-color-wrapper-position-right-unit-general':
					'px',
				'icon-background-color-wrapper-position-bottom-unit-general':
					'px',
				'icon-background-color-wrapper-position-left-unit-general':
					'px',
				'icon-background-color-wrapper-width-general': 100,
				'icon-background-color-wrapper-width-unit-general': '%',
				'icon-background-color-wrapper-height-general': 100,
				'icon-background-color-wrapper-height-unit-general': '%',
				'icon-background-palette-sc-status-general-hover': false,
				'icon-background-gradient-opacity-general': 1,
				'icon-background-gradient-wrapper-position-sync-general': 'all',
				'icon-background-gradient-wrapper-position-top-unit-general':
					'px',
				'icon-background-gradient-wrapper-position-right-unit-general':
					'px',
				'icon-background-gradient-wrapper-position-bottom-unit-general':
					'px',
				'icon-background-gradient-wrapper-position-left-unit-general':
					'px',
				'icon-background-gradient-wrapper-width-general': 100,
				'icon-background-gradient-wrapper-width-unit-general': '%',
				'icon-background-gradient-wrapper-height-general': 100,
				'icon-background-gradient-wrapper-height-unit-general': '%',
				'icon-border-palette-status-general': true,
				'icon-border-palette-sc-status-general': false,
				'icon-border-palette-color-general': 2,
				'icon-border-style-general': 'none',
				'icon-border-top-width-general': 2,
				'icon-border-right-width-general': 2,
				'icon-border-bottom-width-general': 2,
				'icon-border-left-width-general': 2,
				'icon-border-sync-width-general': 'all',
				'icon-border-unit-width-general': 'px',
				'icon-border-sync-radius-general': 'all',
				'icon-border-unit-radius-general': 'px',
				'icon-border-palette-sc-status-general-hover': false,
				svgType: 'Line',
				'icon-width-general-hover': '101',
			},
			blockStyle: 'light',
			isHover: true,
			iconWidthHeightRatio: 0.92,
			target: '.maxi-button-block__icon',
			wrapperTarget: '.maxi-button-block__button',
		});

		expect(result).toMatchSnapshot();
	});
});
