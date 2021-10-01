import { getAttributes } from '../getBlockAttributes';

describe('getBlockAttributes', () => {
	it('Return attributes of nested block', () => {
		const blocks = [
			{
				clientId: '5b977cb3-f51a-43e6-a874-21dedc59eec8',
				name: 'maxi-blocks/container-maxi',
				isValid: true,
				attributes: {
					blockStyle: 'maxi-light',
					blockStyleBackground: 1,
					defaultBlockStyle: 'maxi-def-light',
					extraClassName: '',
					customLabel: 'Container',
					fullWidth: 'full',
					updateStyleCard: 0,
					'container-size-advanced-options': false,
					'container-min-width-unit-general': 'px',
					'container-max-height-unit-general': 'px',
					'container-height-unit-general': 'px',
					'container-min-height-unit-general': 'px',
					'container-max-width-general': 1170,
					'container-max-width-xxl': 1790,
					'container-max-width-xl': 1170,
					'container-max-width-l': 90,
					'container-max-width-m': 90,
					'container-max-width-s': 90,
					'container-max-width-xs': 90,
					'container-max-width-unit-general': 'px',
					'container-max-width-unit-xxl': 'px',
					'container-max-width-unit-xl': 'px',
					'container-max-width-unit-l': '%',
					'container-max-width-unit-m': '%',
					'container-max-width-unit-s': '%',
					'container-max-width-unit-xs': '%',
					'container-width-l': 1170,
					'container-width-unit-l': 'px',
					'container-width-m': 1000,
					'container-width-unit-m': 'px',
					'container-width-s': 700,
					'container-width-unit-s': 'px',
					'container-width-xs': 460,
					'container-width-unit-xs': 'px',
					'background-active-media': 'color',
					'background-layers-status': false,
					'background-palette-color-status': true,
					'background-palette-color': 1,
					'background-image-size': 'auto',
					'background-image-width': 100,
					'background-image-width-unit': '%',
					'background-image-height': 100,
					'background-image-height-unit': '%',
					'background-image-repeat': 'no-repeat',
					'background-image-position': 'center center',
					'background-image-position-width-unit': '%',
					'background-image-position-width': 0,
					'background-image-position-height-unit': '%',
					'background-image-position-height': 0,
					'background-image-origin': 'padding-box',
					'background-image-clip': 'border-box',
					'background-image-attachment': 'scroll',
					'background-image-opacity': 1,
					'background-video-loop': false,
					'background-video-playOnMobile': false,
					'background-video-opacity': 100,
					'background-gradient-opacity': 1,
					'background-palette-svg-color-status': true,
					'background-palette-svg-color': 5,
					'background-svg-top--unit': '%',
					'background-svg-top': 0,
					'background-svg-left--unit': '%',
					'background-svg-left': 0,
					'background-svg-size': 100,
					'background-svg-size--unit': '%',
					'background-layers-status-hover': false,
					'background-status-hover': false,
					'background-palette-color-status-hover': true,
					'background-palette-color-hover': 6,
					'background-palette-svg-color-status-hover': true,
					'background-palette-svg-color-hover': 6,
					'size-advanced-options': false,
					'max-width-unit-general': 'px',
					'width-unit-general': 'px',
					'min-width-unit-general': 'px',
					'max-height-unit-general': 'px',
					'height-unit-general': 'px',
					'min-height-unit-general': 'px',
					'border-palette-color-status-general': true,
					'border-palette-color-general': 2,
					'border-sync-width-general': true,
					'border-unit-width-general': 'px',
					'border-sync-radius-general': true,
					'border-unit-radius-general': 'px',
					'border-status-hover': false,
					'border-palette-color-status-general-hover': true,
					'border-palette-color-general-hover': 6,
					'border-unit-radius-general-hover': 'px',
					'box-shadow-palette-color-status-general': true,
					'box-shadow-palette-color-general': 1,
					'box-shadow-status-hover': false,
					'box-shadow-palette-color-status-general-hover': true,
					'box-shadow-palette-color-general-hover': 6,
					'margin-sync-general': false,
					'margin-unit-general': 'px',
					'padding-top-general': 20,
					'padding-bottom-general': 20,
					'padding-sync-general': false,
					'padding-unit-general': 'px',
					'arrow-status': false,
					'arrow-side-general': 'bottom',
					'arrow-position-general': 50,
					'arrow-width-general': 80,
					'shape-divider-top-status': false,
					'shape-divider-top-height': 100,
					'shape-divider-top-height-unit': 'px',
					'shape-divider-top-opacity': 1,
					'shape-divider-palette-top-color-status': true,
					'shape-divider-palette-top-color': 5,
					'shape-divider-top-effects-status': false,
					'shape-divider-bottom-status': false,
					'shape-divider-bottom-height': 100,
					'shape-divider-bottom-height-unit': 'px',
					'shape-divider-bottom-opacity': 1,
					'shape-divider-palette-bottom-color-status': true,
					'shape-divider-palette-bottom-color': 5,
					'shape-divider-bottom-effects-status': false,
					'motion-status': false,
					'motion-active-time-line-time': 0,
					'motion-active-time-line-index': 0,
					'motion-transform-origin-x': 'center',
					'motion-transform-origin-y': 'center',
					'motion-preset-status': false,
					'motion-preview-status': false,
					'motion-tablet-status': true,
					'motion-mobile-status': true,
					'parallax-status': false,
					'parallax-speed': 4,
					'parallax-direction': 'up',
					'transform-translate-x-unit-general': '%',
					'transform-translate-y-unit-general': '%',
					'position-sync-general': false,
					'position-unit-general': 'px',
					uniqueID: 'container-maxi-12',
					isFirstOnHierarchy: true,
					parentBlockStyle: 'light',
				},
				innerBlocks: [
					{
						clientId: '29f774db-9897-470c-94ce-8e0b1f248e37',
						name: 'maxi-blocks/row-maxi',
						isValid: true,
						attributes: {
							blockStyleBackground: 1,
							defaultBlockStyle: 'maxi-def-light',
							extraClassName: '',
							customLabel: 'Row',
							fullWidth: 'normal',
							horizontalAlign: 'space-between',
							verticalAlign: 'stretch',
							removeColumnGap: false,
							'container-size-advanced-options': false,
							'container-min-width-unit-general': 'px',
							'container-max-height-unit-general': 'px',
							'container-height-unit-general': 'px',
							'container-min-height-unit-general': 'px',
							'container-max-width-general': 1170,
							'container-max-width-xxl': 1790,
							'container-max-width-xl': 1170,
							'container-max-width-l': 90,
							'container-max-width-m': 90,
							'container-max-width-s': 90,
							'container-max-width-xs': 90,
							'container-max-width-unit-general': 'px',
							'container-max-width-unit-xxl': 'px',
							'container-max-width-unit-xl': 'px',
							'container-max-width-unit-l': '%',
							'container-max-width-unit-m': '%',
							'container-max-width-unit-s': '%',
							'container-max-width-unit-xs': '%',
							'container-width-l': 1170,
							'container-width-unit-l': 'px',
							'container-width-m': 1000,
							'container-width-unit-m': 'px',
							'container-width-s': 700,
							'container-width-unit-s': 'px',
							'container-width-xs': 460,
							'container-width-unit-xs': 'px',
							'background-layers-status': false,
							'background-palette-color-status': true,
							'background-palette-color': 1,
							'background-image-size': 'auto',
							'background-image-width': 100,
							'background-image-width-unit': '%',
							'background-image-height': 100,
							'background-image-height-unit': '%',
							'background-image-repeat': 'no-repeat',
							'background-image-position': 'center center',
							'background-image-position-width-unit': '%',
							'background-image-position-width': 0,
							'background-image-position-height-unit': '%',
							'background-image-position-height': 0,
							'background-image-origin': 'padding-box',
							'background-image-clip': 'border-box',
							'background-image-attachment': 'scroll',
							'background-image-opacity': 1,
							'background-video-loop': false,
							'background-video-playOnMobile': false,
							'background-video-opacity': 100,
							'background-gradient-opacity': 1,
							'background-palette-svg-color-status': true,
							'background-palette-svg-color': 5,
							'background-svg-top--unit': '%',
							'background-svg-top': 0,
							'background-svg-left--unit': '%',
							'background-svg-left': 0,
							'background-svg-size': 100,
							'background-svg-size--unit': '%',
							'background-layers-status-hover': false,
							'background-status-hover': false,
							'background-palette-color-status-hover': true,
							'background-palette-color-hover': 6,
							'border-palette-color-status-general': true,
							'border-palette-color-general': 2,
							'border-sync-width-general': true,
							'border-unit-width-general': 'px',
							'border-sync-radius-general': true,
							'border-unit-radius-general': 'px',
							'border-status-hover': false,
							'border-palette-color-status-general-hover': true,
							'border-palette-color-general-hover': 6,
							'border-unit-radius-general-hover': 'px',
							'size-advanced-options': false,
							'max-width-unit-general': 'px',
							'width-unit-general': 'px',
							'min-width-unit-general': 'px',
							'max-height-unit-general': 'px',
							'height-unit-general': 'px',
							'min-height-unit-general': 'px',
							'box-shadow-palette-color-status-general': true,
							'box-shadow-palette-color-general': 1,
							'box-shadow-status-hover': false,
							'box-shadow-palette-color-status-general-hover': true,
							'box-shadow-palette-color-general-hover': 6,
							'margin-sync-general': false,
							'margin-unit-general': 'px',
							'padding-sync-general': false,
							'padding-unit-general': 'px',
							'position-sync-general': false,
							'position-unit-general': 'px',
							'transform-translate-x-unit-general': '%',
							'transform-translate-y-unit-general': '%',
							uniqueID: 'row-maxi-34',
							isFirstOnHierarchy: false,
							blockStyle: 'maxi-parent',
							parentBlockStyle: 'light',
							'row-pattern-general': '1-1',
						},
						innerBlocks: [
							{
								clientId:
									'014b195a-71c2-41f7-bec1-684bf159ce60',
								name: 'maxi-blocks/column-maxi',
								isValid: true,
								attributes: {
									blockStyleBackground: 1,
									defaultBlockStyle: 'maxi-def-light',
									extraClassName: '',
									uniqueID: 'maxi-column-maxi-90',
									customLabel: 'Column',
									fullWidth: 'normal',
									verticalAlign: 'stretch',
									extraStyles: '',
									'column-size-general': 48.75,
									'column-size-m': 100,
									'background-palette-color-status': true,
									'background-palette-color': 1,
									'background-image-size': 'auto',
									'background-image-width': 100,
									'background-image-width-unit': '%',
									'background-image-height': 100,
									'background-image-height-unit': '%',
									'background-image-repeat': 'no-repeat',
									'background-image-position':
										'center center',
									'background-image-position-width-unit': '%',
									'background-image-position-width': 0,
									'background-image-position-height-unit':
										'%',
									'background-image-position-height': 0,
									'background-image-origin': 'padding-box',
									'background-image-clip': 'border-box',
									'background-image-attachment': 'scroll',
									'background-image-opacity': 1,
									'background-video-loop': false,
									'background-video-playOnMobile': false,
									'background-video-opacity': 100,
									'background-gradient-opacity': 1,
									'background-palette-svg-color-status': true,
									'background-palette-svg-color': 5,
									'background-svg-top--unit': '%',
									'background-svg-top': 0,
									'background-svg-left--unit': '%',
									'background-svg-left': 0,
									'background-svg-size': 100,
									'background-svg-size--unit': '%',
									'background-layers-status-hover': false,
									'background-status-hover': false,
									'background-palette-color-status-hover': true,
									'background-palette-color-hover': 6,
									'background-palette-svg-color-status-hover': true,
									'background-palette-svg-color-hover': 6,
									'border-palette-color-status-general': true,
									'border-palette-color-general': 2,
									'border-sync-width-general': true,
									'border-unit-width-general': 'px',
									'border-sync-radius-general': true,
									'border-unit-radius-general': 'px',
									'border-status-hover': false,
									'border-palette-color-status-general-hover': true,
									'border-palette-color-general-hover': 6,
									'box-shadow-palette-color-status-general': true,
									'box-shadow-palette-color-general': 1,
									'box-shadow-status-hover': false,
									'box-shadow-palette-color-status-general-hover': true,
									'box-shadow-palette-color-general-hover': 6,
									'margin-sync-general': false,
									'margin-unit-general': 'px',
									'margin-top-m': '',
									'margin-unit-m': '',
									'padding-sync-general': false,
									'padding-unit-general': 'px',
									'transform-translate-x-unit-general': '%',
									'transform-translate-y-unit-general': '%',
									isFirstOnHierarchy: false,
									blockStyle: 'maxi-parent',
									parentBlockStyle: 'light',
								},
								innerBlocks: [],
							},
							{
								clientId:
									'9f0e80b7-5c4b-475b-82be-e8e673d18e09',
								name: 'maxi-blocks/column-maxi',
								isValid: true,
								attributes: {
									blockStyleBackground: 1,
									defaultBlockStyle: 'maxi-def-light',
									extraClassName: '',
									uniqueID: 'maxi-column-maxi-91',
									customLabel: 'Column',
									fullWidth: 'normal',
									verticalAlign: 'stretch',
									extraStyles: '',
									'column-size-general': 48.75,
									'column-size-m': 100,
									'background-palette-color-status': true,
									'background-palette-color': 1,
									'background-image-size': 'auto',
									'background-image-width': 100,
									'background-image-width-unit': '%',
									'background-image-height': 100,
									'background-image-height-unit': '%',
									'background-image-repeat': 'no-repeat',
									'background-image-position':
										'center center',
									'background-image-position-width-unit': '%',
									'background-image-position-width': 0,
									'background-image-position-height-unit':
										'%',
									'background-image-position-height': 0,
									'background-image-origin': 'padding-box',
									'background-image-clip': 'border-box',
									'background-image-attachment': 'scroll',
									'background-image-opacity': 1,
									'background-video-loop': false,
									'background-video-playOnMobile': false,
									'background-video-opacity': 100,
									'background-gradient-opacity': 1,
									'background-palette-svg-color-status': true,
									'background-palette-svg-color': 5,
									'background-svg-top--unit': '%',
									'background-svg-top': 0,
									'background-svg-left--unit': '%',
									'background-svg-left': 0,
									'background-svg-size': 100,
									'background-svg-size--unit': '%',
									'background-layers-status-hover': false,
									'background-status-hover': false,
									'background-palette-color-status-hover': true,
									'background-palette-color-hover': 6,
									'background-palette-svg-color-status-hover': true,
									'background-palette-svg-color-hover': 6,
									'border-palette-color-status-general': true,
									'border-palette-color-general': 2,
									'border-sync-width-general': true,
									'border-unit-width-general': 'px',
									'border-sync-radius-general': true,
									'border-unit-radius-general': 'px',
									'border-status-hover': false,
									'border-palette-color-status-general-hover': true,
									'border-palette-color-general-hover': 6,
									'box-shadow-palette-color-status-general': true,
									'box-shadow-palette-color-general': 1,
									'box-shadow-status-hover': false,
									'box-shadow-palette-color-status-general-hover': true,
									'box-shadow-palette-color-general-hover': 6,
									'margin-sync-general': false,
									'margin-unit-general': 'px',
									'margin-top-m': '1.5',
									'margin-unit-m': 'em',
									'padding-sync-general': false,
									'padding-unit-general': 'px',
									'transform-translate-x-unit-general': '%',
									'transform-translate-y-unit-general': '%',
									isFirstOnHierarchy: false,
									blockStyle: 'maxi-parent',
									parentBlockStyle: 'light',
								},
								innerBlocks: [],
							},
						],
					},
				],
			},
		];
		const clientId = '29f774db-9897-470c-94ce-8e0b1f248e37';

		const result = getAttributes(blocks, { clientId });

		expect(result).toMatchSnapshot();
	});
});
