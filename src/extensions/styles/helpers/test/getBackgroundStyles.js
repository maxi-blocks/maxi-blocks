/**
 * Internal dependencies
 */
import parseLongAttrKey from '../../../attributes/dictionary/parseLongAttrKey';
import parseLongAttrObj from '../../../attributes/dictionary/parseLongAttrObj';

import {
	getBlockBackgroundStyles,
	getBackgroundStyles,
} from '../getBackgroundStyles';

/**
 * External dependencies
 */
import { isNaN, merge } from 'lodash';

jest.mock('src/extensions/style-cards/getActiveStyleCard.js', () => {
	return jest.fn(() => {
		return {
			value: {
				name: 'Maxi (Default)',
				status: 'active',
				light: {
					styleCard: {},
					defaultStyleCard: {
						color: {
							1: '255,255,255',
							2: '242,249,253',
							3: '155,155,155',
							4: '255,74,23',
							5: '0,0,0',
							6: '201,52,10',
							7: '8,18,25',
							8: '150,176,203',
						},
					},
				},
			},
		};
	});
});

const getGeneralSizeAndPositionAttributes = ({
	type,
	isHover = false,
	isResponsive = false,
}) => {
	const typeString = `${type}${type === 'svg' ? '' : '-wrapper'}`;

	const generalAttributes = {
		[`background-${typeString}-position-bottom-general`]: '10',
		[`background-${typeString}-position-bottom-unit-general`]: 'px',
		[`background-${typeString}-position-general`]: 'inherit',
		[`background-${typeString}-position-left-general`]: '10',
		[`background-${typeString}-position-left-unit-general`]: 'px',
		[`background-${typeString}-position-right-general`]: '10',
		[`background-${typeString}-position-right-unit-general`]: 'px',
		[`background-${typeString}-position-sync-general`]: 'all',
		[`background-${typeString}-position-top-general`]: '10',
		[`background-${typeString}-position-top-unit-general`]: 'px',
		[`background-${typeString}-width-general`]: 100,
		[`background-${typeString}-width-unit-general`]: '%',
		[`background-${typeString}-height-general`]: 100,
		[`background-${typeString}-height-unit-general`]: '%',
	};

	if (!isResponsive) return generalAttributes;

	const response = {};
	const units = ['px', '%', 'em', 'vw', 'vh'];
	Object.entries(generalAttributes).forEach(([rawKey, rawValue]) => {
		['', ...(isHover ? ['-hover'] : [])].forEach((suffix, suffixIndex) => {
			['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(
				(breakpoint, index) => {
					let value;
					if (!isNaN(+rawValue))
						value = +rawValue + index + suffixIndex;
					else if (units.includes(rawValue))
						switch (rawValue) {
							case 'px':
								value = '%';
								break;
							case '%':
								value = 'px';
								break;
							case 'em':
								value = 'px';
								break;
							case 'vw':
								value = 'vh';
								break;
							case 'vh':
								value = 'vw';
								break;
							default:
								value = 'px';
								break;
						}
					else value = rawValue;

					const key = `${rawKey.replace(
						'general',
						breakpoint
					)}${suffix}`;
					response[key] = value;
				}
			);
		});
	});

	return response;
};

describe('getBackgroundStyles', () => {
	const target = 'maxi-test';

	const getBlockBackgroundNormalAndHoverStyles = attributes =>
		merge(
			getBlockBackgroundStyles({
				target,
				isHover: false,
				...attributes,
			}),
			getBlockBackgroundStyles({
				target,
				isHover: true,
				...attributes,
			})
		);

	it('Get correct block background styles for color layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 1,
						'bc_po-general': 0.07,
						'background-color-custom-color-general': '',
						'background-color-clip-path-general':
							'polygon(50% 0%, 0% 100%, 100% 100%)',
						'bc_ps-xl': true,
						'bc_pc-xl': 1,
						'bc_po-xl': 0.07,
						'background-color-custom-color-xl': '',
						'background-color-clip-path-xl':
							'polygon(50% 0%, 0% 100%, 100% 100%)',
						'background-color-clip-path-xxl':
							'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
						'bc_ps-xxl': true,
						'bc_pc-xxl': 2,
						'bc_po-xxl': 0.2,
						'background-color-custom-color-xxl': '',
						'bc_ps-l': true,
						'bc_pc-l': 4,
						'bc_po-l': 0.3,
						'background-color-custom-color-l': '',
						'background-color-clip-path-l':
							'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
						'bc_ps-m': true,
						'bc_pc-m': 5,
						'bc_po-m': 0.59,
						'background-color-custom-color-m': '',
						'background-color-clip-path-m':
							'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
						'bc_ps-s': false,
						'bc_pc-s': 5,
						'bc_po-s': 0.59,
						'background-color-custom-color-s':
							'rgba(204,68,68,0.59)',
						'background-color-clip-path-s':
							'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
						'background-color-clip-path-xs':
							'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
						...getGeneralSizeAndPositionAttributes({
							type: 'color',
							isResponsive: true,
						}),
					}),
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for image layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'image',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						bi_mi: 302,
						bi_mu: 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
						'bi_si-general': 'cover',
						'bi_w-general': 470,
						'bi_w-unit-general': '%',
						'bi_h-general': 300,
						'bi_h-unit-general': '%',
						'bi_co-general': null,
						'bi_re-general': 'repeat-x',
						'bi_pos-general': 'left top',
						'bi_pos-width-unit-general': '%',
						'bi_pos-width-general': 0,
						'bi_pos_h-unit-general': '%',
						'bi_pos_h-general': 0,
						'bi_ori-general': 'border-box',
						'bi_clp-general': 'padding-box',
						'bi_at-general': 'local',
						'bi_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
						'bi_o-general': 0.52,
						'bi_w-xl': 470,
						'bi_h-xl': 300,
						'bi_o-xl': 0.52,
						'bi_si-xl': 'cover',
						'bi_re-xl': 'repeat-x',
						'bi_pos-xl': 'left top',
						'bi_at-xl': 'local',
						'bi_ori-xl': 'border-box',
						'bi_clp-xl': 'padding-box',
						'bi_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
						'bi_w-l': 2560,
						'bi_h-l': 1920,
						'bi_si-l': 'contain',
						'bi_re-l': 'space',
						'bi_pos-l': 'right top',
						'bi_at-l': 'fixed',
						'bi_ori-l': 'content-box',
						'bi_clp-l': 'padding-box',
						'bi_cp-l':
							'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
						'bi_o-m': 0.91,
						'bi_o-xxl': 0.11,
						'bi_cp-xxl':
							'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
						'bi_re-s': 'repeat-x',
						'bi_at-s': 'scroll',
						'bi_pos-s': 'center top',
						'bi_cp-s':
							'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
						'bi_w-xs': 600,
						'bi_h-xs': 600,
						'bi_si-xs': 'auto',
					}),
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for image layer with parallax and different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'image',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bi_pa.s': true,
						bi_mi: 302,
						bi_mu: 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
						'bi_si-general': 'cover',
						'bi_w-general': 470,
						'bi_w-unit-general': '%',
						'bi_h-general': 300,
						'bi_h-unit-general': '%',
						'bi_co-general': null,
						'bi_re-general': 'repeat-x',
						'bi_pos-general': 'left top',
						'bi_pos-width-unit-general': '%',
						'bi_pos-width-general': 0,
						'bi_pos_h-unit-general': '%',
						'bi_pos_h-general': 0,
						'bi_ori-general': 'border-box',
						'bi_clp-general': 'padding-box',
						'bi_at-general': 'local',
						'bi_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
						'bi_o-general': 0.52,
						'bi_w-xl': 470,
						'bi_h-xl': 300,
						'bi_o-xl': 0.52,
						'bi_si-xl': 'cover',
						'bi_re-xl': 'repeat-x',
						'bi_pos-xl': 'left top',
						'bi_at-xl': 'local',
						'bi_ori-xl': 'border-box',
						'bi_clp-xl': 'padding-box',
						'bi_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
						'bi_w-l': 2560,
						'bi_h-l': 1920,
						'bi_si-l': 'contain',
						'bi_re-l': 'space',
						'bi_pos-l': 'right top',
						'bi_at-l': 'fixed',
						'bi_ori-l': 'content-box',
						'bi_clp-l': 'padding-box',
						'bi_cp-l':
							'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
						'bi_o-m': 0.91,
						'bi_o-xxl': 0.11,
						'bi_cp-xxl':
							'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
						'bi_re-s': 'repeat-x',
						'bi_at-s': 'scroll',
						'bi_pos-s': 'center top',
						'bi_cp-s':
							'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
						'bi_w-xs': 600,
						'bi_h-xs': 600,
						'bi_si-xs': 'auto',
					}),
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for video layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'video',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-video-mediaID': null,
						'background-video-mediaURL':
							'https://www.youtube.com/watch?v=y1dbbrfekAM',
						'background-video-startTime': 285,
						'background-video-endTime': 625,
						'background-video-loop': false,
						'background-video-clipPath-general': '',
						'background-video-fallbackID-general': 302,
						'background-video-fallbackURL-general':
							'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
						'background-video-opacity-general': 0.11,
						'background-video-opacity-xl': 0.11,
						'background-video-fallbackID-xl': 302,
						'background-video-fallbackURL-xl':
							'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
						'background-video-opacity-xxl': 0.37,
						'background-video-fallbackID-xxl': 227,
						'background-video-fallbackURL-xxl':
							'http://localhost:8888/wp-content/uploads/2021/09/maxi-IMG_9344-scaled-1.jpg',
						'background-video-opacity-l': 0.65,
						'background-video-fallbackID-l': 226,
						'background-video-fallbackURL-l':
							'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
						'background-video-opacity-s': 0.25,
						'background-video-opacity-xs': 0.9,
						...getGeneralSizeAndPositionAttributes({
							type: 'video',
							isResponsive: true,
						}),
					}),
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for gradient layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'gradient',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-gradient-content-general':
							'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
						'background-gradient-opacity-general': 0.15,
						'background-gradient-clip-path-general':
							'polygon(50% 0%, 0% 100%, 100% 100%)',
						'background-gradient-opacity-xl': 0.15,
						'background-gradient-content-xl':
							'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
						'background-gradient-clip-path-xl':
							'polygon(50% 0%, 0% 100%, 100% 100%)',
						'background-gradient-opacity-xxl': 0.48,
						'background-gradient-clip-path-xxl':
							'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
						'background-gradient-clip-path-l':
							'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
						'background-gradient-opacity-l': 0.8,
						'background-gradient-content-l':
							'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
						'background-gradient-content-s':
							'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(118,170,192) 76%,rgb(155,81,224) 100%)',
						'background-gradient-opacity-s': 0.17,
						'background-gradient-clip-path-s':
							'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
					}),
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for shape layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'shape',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-svg-palette-status-general': true,
						'background-svg-palette-color-general': 5,
						'background-svg-top-unit-general': '%',
						'background-svg-top-general': 0,
						'background-svg-left-unit-general': '%',
						'background-svg-left-general': 50,
						'background-svg-top-xl': 0,
						'background-svg-palette-status-xxl': true,
						'background-svg-palette-color-xxl': 2,
						'background-svg-palette-opacity-xxl': 0.37,
						'background-svg-top-xxl': 72,
						'background-svg-left-xxl': 14,
						SVGElement:
							'<svg viewBox="2.500000238418579, 11.457558631896973, 31.10000228881836, 12.842442512512207" class="shape-22-maxi-svg" data-item="group-maxi-12__svg"><pattern xmlns="http://www.w3.org/1999/xhtml" id="group-maxi-12__30__img" class="maxi-svg-block__pattern" width="100%" height="100%" x="0" y="0" patternunits="userSpaceOnUse"><image class="maxi-svg-block__pattern__image" width="100%" height="100%" x="0" y="0" href="http://localhost:8888/wp-content/uploads/2021/08/IMG_9344-2.jpeg" preserveaspectratio="xMidYMid"></image></pattern><path fill="url(#group-maxi-12__30__img)" data-fill="" d="M33.6 12.9c-.4-.8-1.5-1-2.3-.8s-1.6.8-2.3 1.3-1.5 1-2.4 1.1c-1 .1-2-.5-3-.5-1.3 0-2.5.8-3.8.6-1.9-.2-3-2.4-4.8-3-1.7-.5-3.4.4-4.9 1.4S7 15.1 5.3 14.8c-1.3-.2-2.5-1.3-2.8-2.6v12.1h31.1V12.9z" style="fill: url(#group-maxi-12__30__img)"/></svg>',
						SVGData: {
							'group-maxi-12__30': {
								color: '',
								imageID: 7,
								imageURL:
									'http://localhost:8888/wp-content/uploads/2021/08/IMG_9344-2.jpeg',
							},
						},
						'background-svg-palette-status-l': true,
						'background-svg-palette-color-l': 3,
						'background-svg-palette-opacity-l': 0.37,
						'background-svg-top-l': 82,
						'background-svg-left-l': 62,
						'background-svg-palette-status-s': true,
						'background-svg-palette-color-s': 7,
						'background-svg-palette-opacity-s': 0.37,
						'background-svg-top-s': 23,
						'background-svg-left-s': 31,
						'background-svg-image-shape-flip-x-general': false,
						'background-svg-image-shape-flip-y-general': false,
						'background-svg-image-shape-rotate-general': 104,
						'background-svg-image-shape-scale-general': 72,
						...getGeneralSizeAndPositionAttributes({
							type: 'svg',
							isResponsive: true,
						}),
					}),
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for general responsive stage', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 1,
						'background-color-custom-color-general': '',
						'background-color-clip-path-general': '',
					}),
				},
				{
					type: 'image',
					order: 1,
					...parseLongAttrObj({
						'_d-general': 'block',
						bi_mi: '',
						bi_mu: '',
						'bi_si-general': '',
						'bi_w-general': 100,
						'bi_w-unit-general': '%',
						'bi_h-general': 100,
						'bi_h-unit-general': '%',
						'bi_co-general': null,
						'bi_re-general': 'no-repeat',
						'bi_pos-general': 'center center',
						'bi_pos-width-unit-general': '%',
						'bi_pos-width-general': 0,
						'bi_pos_h-unit-general': '%',
						'bi_pos_h-general': 0,
						'bi_ori-general': 'padding-box',
						'bi_clp-general': 'border-box',
						'bi_at-general': 'scroll',
						'bi_cp-general': '',
						'bi_o-general': 1,
						...getGeneralSizeAndPositionAttributes({
							type: 'image',
							isResponsive: false,
						}),
					}),
				},
				{
					type: 'video',
					order: 2,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-video-mediaID': null,
						'background-video-mediaURL': '',
						'background-video-startTime-general': '',
						'background-video-endTime-general': '',
						'background-video-loop-general': false,
						'background-video-clipPath-general': '',
						'background-video-fallbackID-general': null,
						'background-video-fallbackURL-general': '',
						'background-video-playOnMobile-general': false,
						'background-video-opacity-general': 1,
					}),
				},
				{
					type: 'gradient',
					order: 3,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-gradient-general': '',
						'background-gradient-opacity-general': 1,
						'background-gradient-clip-path-general': '',
					}),
				},
				{
					type: 'shape',
					order: 4,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-svg-palette-status-general': true,
						'background-svg-palette-color-general': 5,
						'background-svg-SVGElement-general': '',
						'background-svg-SVGMediaURL': '',
						'background-svg-top-unit-general': '%',
						'background-svg-top-general': null,
						'background-svg-left-unit-general': '%',
						'background-svg-left-general': null,
						'background-svg-width-general': 100,
						'background-svg-width-unit-general': '%',
					}),
				},
			],
			...parseLongAttrObj({
				'border-palette-status-general': true,
				'border-palette-color-general': 2,
				'border-width-sync-general': true,
				'border-width-unit-general': 'px',
				'border-radius-sync-general': true,
				'border-radius-unit-general': 'px',
			}),
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct simple background styles', () => {
		const result = getBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			...parseLongAttrObj({
				'background-active-media-general': 'color',
				'background-active-media-l': 'gradient',
				'background-active-media-m': 'color',
				'background-active-media-xs': 'gradient',
				'background-color-custom-color-general':
					'rgba(255,255,255,0.39)',
				'background-color-custom-color-m': 'rgba(255,255,255,0.39)',
				'background-color-custom-color-s': 'rgba(43,43,179,0.39)',
				'background-color-custom-color-xl': 'rgba(255,255,255,0.39)',
				'background-color-custom-color-xxl': 'rgba(255,255,255,0.39)',
				'background-gradient-content-l':
					'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(73,131,156) 39%,rgb(155,81,224) 100%)',
				'background-gradient-opacity-general': 1,
				'background-gradient-opacity-l': 0.29,
				'background-gradient-content-xs':
					'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(73,131,156) 39%,rgb(102,186,223) 67%,rgb(155,81,224) 100%)',
				'b_ly.s-general': false,
				'b_ly.s-general-hover': false,
				'bc_pc-general': 1,
				'bc_pc-general-hover': 6,
				'bc_pc-m': 4,
				'bc_pc-s': 4,
				'bc_ps-general': true,
				'bc_ps-general-hover': true,
				'bc_ps-m': true,
				'bc_ps-s': false,
				'bc_ps-xl': true,
				'bc_ps-xxl': true,
				'bc_pc-xl': 1,
				'bc_pc-xxl': 2,
				'bc_po-general': 0.39,
				'bc_po-m': 0.39,
				'bc_po-s': 0.39,
				'bc_po-xl': 0.39,
			}),
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer with different values on different responsive stages and hover', () => {
		const attributes = {
			blockStyle: 'light',
			'bb.sh': true,
			b_ly: [
				{
					type: 'color',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 1,
						'bc_po-general': 0.07,
						'background-color-custom-color-general': '',
						'background-color-clip-path-general': true,
						'bc_ps-xl': true,
						'bc_pc-xl': 1,
						'bc_po-xl': 0.07,
						'background-color-custom-color-xl': '',
						'background-color-clip-path-xl': true,
						'background-color-clip-path-xxl':
							'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
						'bc_ps-xxl': true,
						'bc_pc-xxl': 2,
						'bc_po-xxl': 0.2,
						'background-color-custom-color-xxl': '',
						'bc_ps-l': true,
						'bc_pc-l': 4,
						'bc_po-l': 0.3,
						'background-color-custom-color-l': '',
						'background-color-clip-path-l':
							'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
						'bc_ps-m': true,
						'bc_pc-m': 5,
						'bc_po-m': 0.59,
						'background-color-custom-color-m': '',
						'background-color-clip-path-m':
							'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
						'bc_ps-s': false,
						'bc_pc-s': 5,
						'bc_po-s': 0.59,
						'background-color-custom-color-s':
							'rgba(204,68,68,0.59)',
						'background-color-clip-path-s':
							'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
						'background-color-clip-path-xs':
							'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
						'bc_ps-xl-hover': true,
						'bc_pc-xl-hover': 4,
						'bc_po-xl-hover': 0.59,
						'background-color-custom-color-xl-hover': '',
						'bc_ps-general-hover': true,
						'bc_pc-general-hover': 4,
						'bc_po-general-hover': 0.59,
						'background-color-general-hover': '',
						'bc_ps-xxl-hover': true,
						'bc_pc-xxl-hover': 7,
						'bc_po-xxl-hover': 0.22,
						'background-color-custom-color-xxl-hover': '',
						'bc_ps-l-hover': true,
						'bc_pc-l-hover': 1,
						'bc_po-l-hover': 0.59,
						'background-color-custom-color-l-hover': '',
						'bc_ps-s-hover': true,
						'bc_pc-s-hover': 8,
						'bc_po-s-hover': 0.59,
						'background-color-custom-color-s-hover':
							'rgba(204,68,68,0.59)',
						'background-color-clip-path-l-hover':
							'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
						'background-color-clip-path-s-hover':
							'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
						...getGeneralSizeAndPositionAttributes({
							type: 'color',
							isResponsive: true,
							isHover: true,
						}),
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for image layer with different values on different responsive stages and hovers', () => {
		const attributes = {
			blockStyle: 'light',
			[parseLongAttrKey('bb.sh')]: true,
			b_ly: [
				{
					type: 'image',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						bi_mi: 302,
						bi_mu: 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
						'bi_si-general': 'cover',
						'bi_w-general': 470,
						'bi_w-unit-general': '%',
						'bi_h-general': 300,
						'bi_h-unit-general': '%',
						'bi_co-general': null,
						'bi_re-general': 'repeat-x',
						'bi_pos-general': 'left top',
						'bi_pos-width-unit-general': '%',
						'bi_pos-width-general': 0,
						'bi_pos_h-unit-general': '%',
						'bi_pos_h-general': 0,
						'bi_ori-general': 'border-box',
						'bi_clp-general': 'padding-box',
						'bi_at-general': 'local',
						'bi_cp-status-general': true,
						'bi_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
						'bi_o-general': 0.52,
						'bi_w-xl': 470,
						'bi_h-xl': 300,
						'bi_o-xl': 0.52,
						'bi_si-xl': 'cover',
						'bi_re-xl': 'repeat-x',
						'bi_pos-xl': 'left top',
						'bi_at-xl': 'local',
						'bi_ori-xl': 'border-box',
						'bi_clp-xl': 'padding-box',
						'bi_cp-status-xl': true,
						'bi_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
						'bi_w-l': 2560,
						'bi_h-l': 1920,
						'bi_si-l': 'contain',
						'bi_re-l': 'space',
						'bi_pos-l': 'right top',
						'bi_at-l': 'fixed',
						'bi_ori-l': 'content-box',
						'bi_clp-l': 'padding-box',
						'bi_cp-status-l': true,
						'bi_cp-l':
							'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
						'bi_o-m': 0.91,
						'bi_o-xxl': 0.11,
						'bi_cp-status-xxl': true,
						'bi_cp-xxl':
							'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
						'bi_re-s': 'repeat-x',
						'bi_at-s': 'scroll',
						'bi_pos-s': 'center top',
						'bi_cp-status-s': true,
						'bi_cp-s':
							'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
						'bi_w-xs': 600,
						'bi_h-xs': 600,
						'bi_si-xs': 'auto',
						'bi_w-xl-hover': 600,
						'bi_h-xl-hover': 600,
						'bi_w-general-hover': 600,
						'bi_h-general-hover': 600,
						'bi_o-xl-hover': 0.17,
						'bi_o-general-hover': 0.17,
						'bi_cp-status-xl-hover': true,
						'bi_cp-xl-hover':
							'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
						'bi_cp-status-general-hover': true,
						'bi_cp-general-hover':
							'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
						'bi_w-xxl-hover': 788,
						'bi_h-xxl-hover': 732,
						'bi_o-xxl-hover': 0.79,
						'bi_w-l-hover': 470,
						'bi_h-l-hover': 300,
						'bi_o-l-hover': 0.81,
						'bi_cp-status-s-hover': true,
						'bi_cp-s-hover': 'ellipse(25% 40% at 50% 50%)',
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for video layer with different values on different responsive stages and hovers', () => {
		const attributes = {
			blockStyle: 'light',
			[parseLongAttrKey('bb.sh')]: true,
			b_ly: [
				{
					type: 'video',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-video-mediaID': null,
						'background-video-mediaURL':
							'https://www.youtube.com/watch?v=y1dbbrfekAM',
						'background-video-startTime': 285,
						'background-video-endTime': 625,
						'background-video-loop': false,
						'background-video-clipPath-general': '',
						'background-video-fallbackID-general': 302,
						'background-video-fallbackURL-general':
							'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
						'background-video-opacity-general': 0.11,
						'background-video-opacity-xl': 0.11,
						'background-video-fallbackID-xl': 302,
						'background-video-fallbackURL-xl':
							'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
						'background-video-opacity-xxl': 0.37,
						'background-video-fallbackID-xxl': 227,
						'background-video-fallbackURL-xxl':
							'http://localhost:8888/wp-content/uploads/2021/09/maxi-IMG_9344-scaled-1.jpg',
						'background-video-opacity-l': 0.65,
						'background-video-fallbackID-l': 226,
						'background-video-fallbackURL-l':
							'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
						'background-video-opacity-s': 0.25,
						'background-video-opacity-xs': 0.9,
						'background-video-opacity-xl-hover': 0.82,
						'background-video-opacity-general-hover': 0.82,
						'background-video-opacity-xxl-hover': 0.21,
						'background-video-opacity-m-hover': 0.06,
						'background-video-opacity-s-hover': 1,
						...getGeneralSizeAndPositionAttributes({
							type: 'video',
							isResponsive: true,
							isHover: true,
						}),
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for gradient layer with different values on different responsive stages and hovers', () => {
		const attributes = {
			blockStyle: 'light',
			[parseLongAttrKey('bb.sh')]: true,
			b_ly: [
				{
					type: 'gradient',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-gradient-content-general':
							'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
						'background-gradient-opacity-general': 0.15,
						'background-gradient-clip-path-status-general': true,
						'background-gradient-clip-path-general':
							'polygon(50% 0%, 0% 100%, 100% 100%)',
						'background-gradient-opacity-xl': 0.15,
						'background-gradient-content-xl':
							'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
						'background-gradient-clip-path-status-xl': true,
						'background-gradient-clip-path-xl':
							'polygon(50% 0%, 0% 100%, 100% 100%)',
						'background-gradient-opacity-xxl': 0.48,
						'background-gradient-clip-path-status-xxl': true,
						'background-gradient-clip-path-xxl':
							'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
						'background-gradient-clip-path-status-l': true,
						'background-gradient-clip-path-l':
							'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
						'background-gradient-opacity-l': 0.8,
						'background-gradient-content-l':
							'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
						'background-gradient-content-s':
							'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(118,170,192) 76%,rgb(155,81,224) 100%)',
						'background-gradient-opacity-s': 0.17,
						'background-gradient-clip-path-status-s': true,
						'background-gradient-clip-path-s':
							'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
						'background-gradient-content-xl-hover':
							'radial-gradient(rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
						'background-gradient-content-general-hover':
							'radial-gradient(rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
						'background-gradient-opacity-xl-hover': 0.71,
						'background-gradient-opacity-general-hover': 0.71,
						'background-gradient-content-xxl-hover':
							'linear-gradient(205deg,rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
						'background-gradient-clip-path-status-xxl-hover': true,
						'background-gradient-clip-path-xxl-hover':
							'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
						'background-gradient-clip-path-status-xl-hover': true,
						'background-gradient-clip-path-xl-hover':
							'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
						'background-gradient-clip-path-status-general-hover': true,
						'background-gradient-clip-path-general-hover':
							'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
						'background-gradient-clip-path-status-l-hover': true,
						'background-gradient-clip-path-l-hover':
							'circle(50% at 50% 50%)',
						'background-gradient-content-l-hover':
							'radial-gradient(rgb(26,229,6) 0%,rgb(89,136,156) 25%,rgb(186,69,107) 52%,rgba(0,114,163,0.08) 74%,rgb(224,218,82) 100%)',
						'background-gradient-opacity-l-hover': 0.37,
						'background-gradient-content-s-hover':
							'radial-gradient(rgb(186,69,107) 52%,rgba(0,114,163,0.08) 74%,rgb(224,218,82) 100%)',
						'background-gradient-clip-path-status-s-hover': true,
						'background-gradient-clip-path-s-hover':
							'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
						'background-gradient-opacity-s-hover': 0.91,
						...getGeneralSizeAndPositionAttributes({
							type: 'gradient',
							isResponsive: true,
							isHover: true,
						}),
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for shape layer with different values on different responsive stages and hovers', () => {
		const attributes = {
			blockStyle: 'light',
			[parseLongAttrKey('bb.sh')]: true,
			b_ly: [
				{
					type: 'shape',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-svg-palette-status-general': true,
						'background-svg-palette-color-general': 5,
						'background-svg-SVGElement':
							'<svg viewBox="2.500000238418579, 11.457558631896973, 31.10000228881836, 12.842442512512207" class="shape-22-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M33.6 12.9c-.4-.8-1.5-1-2.3-.8s-1.6.8-2.3 1.3-1.5 1-2.4 1.1c-1 .1-2-.5-3-.5-1.3 0-2.5.8-3.8.6-1.9-.2-3-2.4-4.8-3-1.7-.5-3.4.4-4.9 1.4S7 15.1 5.3 14.8c-1.3-.2-2.5-1.3-2.8-2.6v12.1h31.1V12.9z"></path></svg>',
						'background-svg-SVGData': {
							'group-maxi-12__30': {
								color: '',
								imageID: '',
								imageURL: '',
							},
						},
						'background-svg-top-unit-general': '%',
						'background-svg-top-general': 0,
						'background-svg-left-unit-general': '%',
						'background-svg-left-general': 50,
						'background-svg-top-xl': 0,
						'SVGElement-xxl':
							'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
						'SVGData-xxl': {
							'group-maxi-12__30': {
								color: '',
								imageID: '',
								imageURL: '',
							},
						},
						'background-svg-palette-status-xxl': true,
						'background-svg-palette-color-xxl': 2,
						'background-svg-palette-opacity-xxl': 0.37,
						'background-svg-top-xxl': 72,
						'background-svg-left-xxl': 14,
						SVGElement:
							'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-1718__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
						SVGData: {
							'group-maxi-12__30': {
								color: '',
								imageID: '',
								imageURL: '',
							},
						},
						'SVGElement-l':
							'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
						'SVGData-l': {
							'group-maxi-12__30': {
								color: '',
								imageID: '',
								imageURL: '',
							},
						},
						'background-svg-palette-status-l': true,
						'background-svg-palette-color-l': 3,
						'background-svg-palette-opacity-l': 0.37,
						'background-svg-top-l': 82,
						'background-svg-left-l': 62,
						'SVGElement-s':
							'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
						'SVGData-s': {
							'group-maxi-12__30': {
								color: '',
								imageID: '',
								imageURL: '',
							},
						},
						'background-svg-palette-status-s': true,
						'background-svg-palette-color-s': 7,
						'background-svg-palette-opacity-s': 0.37,
						'background-svg-top-s': 23,
						'background-svg-left-s': 31,
						'background-svg-palette-status-xl-hover': true,
						'background-svg-palette-color-xl-hover': 4,
						'background-svg-palette-opacity-xl-hover': 0.92,
						'background-svg-palette-status-general-hover': true,
						'background-svg-palette-color-general-hover': 4,
						'background-svg-palette-opacity-general-hover': 0.92,
						'background-svg-top-xl-hover': 57,
						'background-svg-top-general-hover': 57,
						'background-svg-left-xl-hover': 39,
						'background-svg-left-general-hover': 39,
						'background-svg-palette-status-xxl-hover': true,
						'background-svg-palette-color-xxl-hover': 3,
						'background-svg-palette-opacity-xxl-hover': 0.17,
						'background-svg-top-xxl-hover': 16,
						'background-svg-left-xxl-hover': 11,
						'background-svg-palette-status-s-hover': true,
						'background-svg-palette-color-s-hover': 8,
						'background-svg-palette-opacity-s-hover': 0.92,
						'background-svg-top-s-hover': 10,
						'background-svg-left-s-hover': 72,
						...getGeneralSizeAndPositionAttributes({
							type: 'svg',
							isResponsive: true,
							isHover: true,
						}),
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for different layers, onces created on normal and other on hover', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 2,
					isHover: false,
					'isHover-general': false,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 1,
						'bc_ps-xl-hover': true,
						'bc_pc-xl-hover': 4,
						'bc_ps-general-hover': true,
						'bc_pc-general-hover': 4,
					}),
				},
				{
					type: 'shape',
					order: 3,
					isHover: false,
					'isHover-general': false,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-svg-palette-status-general': true,
						'background-svg-palette-color-general': 4,
						'background-svg-SVGElement':
							'<svg fill="undefined" data-fill="" viewBox="2.1999988555908203, 2.5000007152557373, 31.674436569213867, 31" class="tick-5-maxi-svg" data-item="group-maxi-12__svg"><path d="M31.2 14.4c.3 1.2.5 2.4.5 3.6 0 7.7-6.3 13.9-14 13.9C10.1 32 3.8 25.7 3.8 18s6.3-13.9 14-13.9c2.2 0 4.2.5 6 1.4l1-1.3c-2.1-1.1-4.5-1.7-7-1.7-8.6 0-15.6 7-15.6 15.5 0 8.6 7 15.5 15.5 15.5 8.6 0 15.5-7 15.5-15.5 0-1.8-.3-3.5-.9-5.1l-1.1 1.5zm2.3-8.2l-3.9-2.9a.95.95 0 0 0-1.3.2l-1.5 1.9-1 1.3L18 16.9a.97.97 0 0 1-1.4.1l-4.5-4.5a.85.85 0 0 0-1.3 0L7.5 16c-.3.3-.3.9 0 1.2l9 9.8c.4.4 1 .4 1.4 0l12.3-15.2 1.1-1.3 2.4-2.9c.3-.5.2-1.1-.2-1.4z" fill=""/></svg>',
						'background-svg-SVGData': {
							'group-maxi-12__81': {
								color: '',
								imageID: '',
								imageURL: '',
							},
						},
						'background-svg-top-unit-general': '%',
						...getGeneralSizeAndPositionAttributes({
							type: 'svg',
							isResponsive: false,
						}),
						'background-svg-palette-status-xl': true,
						'background-svg-palette-color-xl': 4,
					}),
				},
				{
					type: 'video',
					order: 4,
					isHover: false,
					'isHover-general': false,
					...parseLongAttrObj({
						'_d-general': 'block',
						'background-video-mediaURL':
							'https://www.youtube.com/watch?v=CXSV98tr51A',
						'background-video-loop': false,
						'background-video-playOnMobile-general': false,
						'background-video-opacity-general': 1,
						'background-video-reduce-border-general': false,
					}),
				},
			],
			'b_ly.h': [
				{
					type: 'image',
					isHover: true,
					'isHover-general-hover': false,
					'isHover-general': false,
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'none',
						'_d-general-hover': 'block',
						'bi_si-general': 'auto',
						'bi_si-general-hover': 'auto',
						'bi_w-general': 100,
						'bi_w-general-hover': 600,
						'bi_w-unit-general': '%',
						'bi_w-unit-general-hover': '%',
						'bi_h-general': 100,
						'bi_h-general-hover': 600,
						'bi_h-unit-general': '%',
						'bi_h-unit-general-hover': '%',
						'bi_re-general': 'no-repeat',
						'bi_re-general-hover': 'no-repeat',
						'bi_pos-general': 'center center',
						'bi_pos-general-hover': 'center center',
						'bi_pos-width-unit-general': '%',
						'bi_pos-width-unit-general-hover': '%',
						'bi_pos-width-general': 0,
						'bi_pos-width-general-hover': 0,
						'bi_pos_h-unit-general': '%',
						'bi_pos_h-unit-general-hover': '%',
						'bi_pos_h-general': 0,
						'bi_pos_h-general-hover': 0,
						'bi_ori-general': 'padding-box',
						'bi_ori-general-hover': 'padding-box',
						'bi_clp-general': 'border-box',
						'bi_clp-general-hover': 'border-box',
						'bi_at-general': 'scroll',
						'bi_at-general-hover': 'scroll',
						'bi_o-general': 1,
						'bi_o-general-hover': 1,
						'bi_pa.s': false,
						bi_psp: 4,
						bi_pd: 'up',

						'bi_w-xl-hover': 600,
						'bi_h-xl-hover': 600,
					}),
				},
				{
					type: 'shape',
					order: 1,
					isHover: true,
					'isHover-general': false,
					'isHover-general-hover': false,
					...parseLongAttrObj({
						'_d-general': 'none',
						'_d-general-hover': 'block',
						'background-svg-palette-status-general': true,
						'background-svg-palette-status-general-hover': true,
						'background-svg-palette-color-general': 5,
						'background-svg-palette-color-general-hover': 2,
						'background-svg-SVGElement':
							'<svg viewBox="2.590501546859741, 2.455554962158203, 30.95997428894043, 31.187908172607422" class="tick-12-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M32.4 16.4c.4-.6.7-1.4.6-2.3-.1-1.3-1-2.3-2.1-2.8.2-.8.1-1.6-.3-2.3-.6-1.2-1.7-1.8-2.9-1.9-.1-.8-.5-1.5-1.1-2.1-1-.9-2.3-1.1-3.4-.7-.4-.7-1-1.3-1.8-1.6-1.2-.5-2.5-.2-3.4.6-.6-.5-1.4-.8-2.2-.8-1.5 0-2.7.9-3.2 2.3-.9-.4-1.9-.5-2.8 0-1.2.5-1.9 1.6-2 2.8-.8.2-1.6.5-2.2 1.1-.9.9-1.2 2.2-.9 3.4-.7.3-1.3.9-1.6 1.7-.5 1.2-.3 2.5.4 3.5-.5.6-.9 1.3-.9 2.2-.1 1.3.6 2.4 1.6 3.1-.3.7-.4 1.6-.1 2.4.4 1.2 1.4 2.1 2.6 2.3 0 .8.2 1.6.8 2.2.8 1 2.1 1.4 3.3 1.2.3.7.8 1.4 1.5 1.8 1.1.6 2.5.6 3.5-.1.5.6 1.2 1 2.1 1.2 1.3.2 2.5-.3 3.2-1.3.7.4 1.5.5 2.3.3 1.3-.3 2.2-1.2 2.6-2.4.8.1 1.6-.1 2.3-.5 1.1-.7 1.6-1.9 1.5-3.1.8-.2 1.5-.6 2-1.3.8-1 .8-2.4.3-3.5.6-.4 1.1-1.1 1.4-1.9.2-1.4-.2-2.6-1.1-3.5zM25.7 14l-9.5 10.1-5.4-5.4 1.7-1.7 3.7 3.7 7.8-8.3 1.7 1.6z"/></svg>',
						'background-svg-SVGData': {
							'group-maxi-12__69': {
								color: '',
								imageID: '',
								imageURL: '',
							},
						},
						'background-svg-top-unit-general': '%',
						'background-svg-top-unit-general-hover': '%',
						'background-svg-wrapper-position-top-general': 0,
						'background-svg-wrapper-position-top-general-hover': 0,
						'background-svg-wrapper-position-right-general': 0,
						'background-svg-wrapper-position-right-general-hover': 0,
						'background-svg-wrapper-position-bottom-general': 0,
						'background-svg-wrapper-position-bottom-general-hover': 0,
						'background-svg-wrapper-position-left-general': 0,
						'background-svg-wrapper-position-top-unit-general': '%',
						'background-svg-wrapper-position-right-unit-general':
							'%',
						'background-svg-wrapper-position-bottom-unit-general':
							'%',
						'background-svg-wrapper-position-left-unit-general':
							'%',
						'background-svg-wrapper-width-general': 100,
						'background-svg-wrapper-width-general-hover': 100,
						'background-svg-wrapper-width-unit-general': '%',
						'background-svg-wrapper-width-unit-general-hover': '%',
						'background-svg-wrapper-height-general': 100,
						'background-svg-wrapper-height-general-hover': 100,
						'background-svg-wrapper-height-unit-general': '%',
						'background-svg-wrapper-height-unit-general-hover': '%',
						'background-svg-palette-status-xl-hover': true,
						'background-svg-palette-color-xl-hover': 2,
						'background-svg-palette-opacity-xl-hover': 0.38,
						'background-svg-palette-opacity-general-hover': 0.38,
					}),
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer with border', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 1,
						'bc_po-general': 0.07,
						'background-color-custom-color-general': '',
						'background-color-clip-path-status-general': true,
						'background-color-clip-path-general':
							'polygon(50% 0%, 0% 100%, 100% 100%)',
					}),
				},
			],
			...parseLongAttrObj({
				'border-radius-bottom-left-general': 180,
				'border-radius-bottom-right-general': 180,
				'border-width-bottom-general': 2,
				'border-width-left-general': 2,
				'border-palette-color-general': 5,
				'border-palette-color-general-hover': 6,
				'border-palette-status-general': true,
				'border-palette-status-general-hover': true,
				'border-width-right-general': 2,
				'bo.sh': false,
				'border-style-general': 'solid',
				'border-radius-sync-general': 'all',
				'border-width-sync-general': 'all',
				'border-radius-top-left-general': 180,
				'border-radius-top-right-general': 180,
				'border-width-top-general': 2,
				'border-radius-unit-general': 'px',
				'border-radius-unit-general-hover': 'px',
				'border-width-unit-general': 'px',
			}),
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer different values for border on different responsive stages and hovers', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					isHover: false,
					order: 1,
					id: 1,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 4,
						'background-color-clip-path-status-general': false,
						'background-color-wrapper-position-sync-general': 'all',
						'background-color-wrapper-position-top-unit-general':
							'px',
						'background-color-wrapper-position-right-unit-general':
							'px',
						'background-color-wrapper-position-bottom-unit-general':
							'px',
						'background-color-wrapper-position-left-unit-general':
							'px',
						'background-color-wrapper-width-general': 100,
						'background-color-wrapper-width-unit-general': '%',
					}),
				},
			],
			...parseLongAttrObj({
				'bb.sh': false,
				'border-palette-status-general': true,
				'border-palette-color-general': 5,
				'border-style-general': 'solid',
				'border-width-top-general': 5,
				'border-width-top-l': 10,
				'border-width-top-m': 0,
				'border-width-right-general': 10,
				'border-width-right-l': 15,
				'border-width-bottom-general': 15,
				'border-width-bottom-l': 20,
				'border-width-left-general': 20,
				'border-width-left-l': 5,
				'border-width-left-m': 0,
				'border-width-sync-general': 'none',
				'border-width-unit-general': 'px',
				'border-radius-sync-general': 'all',
				'border-radius-unit-general': 'px',
				'border-palette-status-general-hover': true,
				'border-palette-color-general-hover': 3,
				'border-style-general-hover': 'solid',
				'border-style-m-hover': 'solid',
				'bo.sh': true,
				'border-width-top-general-hover': 5,
				'border-width-top-l-hover': 10,
				'border-width-top-m-hover': 2,
				'border-width-right-general-hover': 10,
				'border-width-right-l-hover': 15,
				'border-width-right-m-hover': 15,
				'border-width-bottom-general-hover': 15,
				'border-width-bottom-l-hover': 20,
				'border-width-bottom-m-hover': 20,
				'border-width-left-general-hover': 20,
				'border-width-left-l-hover': 5,
				'border-width-left-m-hover': 2,
				'border-width-sync-general-hover': 'none',
				'border-width-sync-m-hover': 'all',
				'border-width-unit-general-hover': 'px',
				'border-width-unit-m-hover': 'px',
				'border-radius-sync-general-hover': 'all',
				'border-radius-unit-general-hover': 'px',
			}),
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer with row border radius', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 1,
						'bc_po-general': 0.07,
						'background-color-custom-color-general': '',
					}),
				},
			],
			rowBorderRadius: parseLongAttrObj({
				'border-radius-bottom-left-general': 181,
				'border-radius-bottom-right-general': 182,
				'border-radius-top-left-general': 183,
				'border-radius-top-right-general': 184,
			}),
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer with border radius and row border radius', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 1,
						'bc_po-general': 0.07,
						'background-color-custom-color-general': '',
					}),
				},
			],
			rowBorderRadius: parseLongAttrObj({
				'border-radius-bottom-left-general': 180,
				'border-radius-bottom-right-general': 181,
				'border-radius-top-left-general': 182,
				'border-radius-top-right-general': 183,
			}),
			...parseLongAttrObj({
				'border-radius-bottom-left-general': 160,
				'border-radius-bottom-right-general': 200,
			}),
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles when hover status is disabled, but hover attributes are set', () => {
		const attributes = {
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 1,
						'bc_po-general': 0.07,
						'background-color-custom-color-general': '',
						'background-color-clip-path-general': true,
						'bc_ps-xl': true,
						'bc_pc-xl': 1,
						'bc_po-xl': 0.07,
						'background-color-custom-color-xl': '',
						'background-color-clip-path-xl': true,
						'background-color-clip-path-xxl':
							'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
						'bc_ps-xxl': true,
						'bc_pc-xxl': 2,
						'bc_po-xxl': 0.2,
						'background-color-custom-color-xxl': '',
						'bc_ps-l': true,
						'bc_pc-l': 4,
						'bc_po-l': 0.3,
						'background-color-custom-color-l': '',
						'background-color-clip-path-l':
							'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
						'bc_ps-m': true,
						'bc_pc-m': 5,
						'bc_po-m': 0.59,
						'background-color-custom-color-m': '',
						'background-color-clip-path-m':
							'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
						'bc_ps-s': false,
						'bc_pc-s': 5,
						'bc_po-s': 0.59,
						'background-color-custom-color-s':
							'rgba(204,68,68,0.59)',
						'background-color-clip-path-s':
							'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
						'background-color-clip-path-xs':
							'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
						'bc_ps-xl-hover': true,
						'bc_pc-xl-hover': 4,
						'bc_po-xl-hover': 0.59,
						'background-color-custom-color-xl-hover': '',
						'bc_ps-general-hover': true,
						'bc_pc-general-hover': 4,
						'bc_po-general-hover': 0.59,
						'background-color-general-hover': '',
						'bc_ps-xxl-hover': true,
						'bc_pc-xxl-hover': 7,
						'bc_po-xxl-hover': 0.22,
						'background-color-custom-color-xxl-hover': '',
						'bc_ps-l-hover': true,
						'bc_pc-l-hover': 1,
						'bc_po-l-hover': 0.59,
						'background-color-custom-color-l-hover': '',
						'bc_ps-s-hover': true,
						'bc_pc-s-hover': 8,
						'bc_po-s-hover': 0.59,
						'background-color-custom-color-s-hover':
							'rgba(204,68,68,0.59)',
						'background-color-clip-path-l-hover':
							'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
						'background-color-clip-path-s-hover':
							'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
						...getGeneralSizeAndPositionAttributes({
							type: 'color',
							isResponsive: true,
							isHover: true,
						}),
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles when border attributes are default, so the source is the normal attributes', () => {
		const attributes = {
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					isHover: false,
					order: 1,
					id: 1,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 1,
						'background-color-clip-path-status-general': false,
						'bc_ps-general-hover': true,
						'bc_pc-general-hover': 1,
						'bc_po-general-hover': 0,
						'background-color-wrapper-position-top-unit-general':
							'px',
						'background-color-wrapper-position-left-unit-general':
							'px',
						'background-color-wrapper-position-bottom-unit-general':
							'px',
						'background-color-wrapper-position-right-unit-general':
							'px',
					}),
				},
			],
			...parseLongAttrObj({
				'bb.sh': true,
				'border-palette-status-general': true,
				'border-palette-color-general': 2,
				'border-style-general': 'solid',
				'border-width-top-general': 2,
				'border-width-top-xxl': 4,
				'border-width-top-xl': 2,
				'border-width-right-general': 2,
				'border-width-right-xxl': 4,
				'border-width-right-xl': 2,
				'border-width-bottom-general': 2,
				'border-width-bottom-xxl': 4,
				'border-width-bottom-xl': 2,
				'border-width-left-general': 2,
				'border-width-left-xxl': 4,
				'border-width-left-xl': 2,
				'border-width-sync-general': 'all',
				'border-width-unit-general': 'px',
				'border-radius-sync-general': 'all',
				'border-radius-unit-general': 'px',
				'bo.sh': true,
				'border-palette-status-general-hover': true,
				'border-palette-color-general-hover': 6,
				'border-palette-opacity-general-hover': 0,
			}),
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles when most border attributes are default, so the source is the normal attributes and the one different', () => {
		const attributes = {
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					isHover: false,
					order: 1,
					id: 1,
					...parseLongAttrObj({
						'_d-general': 'block',
						'bc_ps-general': true,
						'bc_pc-general': 1,
						'background-color-clip-path-status-general': false,
						'bc_ps-general-hover': true,
						'bc_pc-general-hover': 1,
						'bc_po-general-hover': 0,
						'background-color-wrapper-position-top-unit-general':
							'px',
						'background-color-wrapper-position-left-unit-general':
							'px',
						'background-color-wrapper-position-bottom-unit-general':
							'px',
						'background-color-wrapper-position-right-unit-general':
							'px',
					}),
				},
			],
			...parseLongAttrObj({
				'bb.sh': true,
				'border-palette-status-general': true,
				'border-palette-color-general': 2,
				'border-style-general': 'solid',
				'border-width-top-general': 2,
				'border-width-top-xxl': 4,
				'border-width-top-xl': 2,
				'border-width-right-general': 2,
				'border-width-right-xxl': 4,
				'border-width-right-xl': 2,
				'border-width-bottom-general': 2,
				'border-width-bottom-xxl': 4,
				'border-width-bottom-xl': 2,
				'border-width-left-general': 2,
				'border-width-left-xxl': 4,
				'border-width-left-xl': 2,
				'border-width-sync-general': 'all',
				'border-width-unit-general': 'px',
				'border-radius-sync-general': 'all',
				'border-radius-unit-general': 'px',
				'bo.sh': true,
				'border-palette-status-general-hover': true,
				'border-palette-color-general-hover': 6,
				'border-palette-opacity-general-hover': 0,
				'border-width-top-general-hover': 3,
			}),
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});
});
