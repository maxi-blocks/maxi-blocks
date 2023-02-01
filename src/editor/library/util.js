/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getBlockStyle, getPaletteAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import { isNil, uniq, isEmpty } from 'lodash';

export const rgbToHex = color => {
	if (isNil(color)) return '';

	const rgb = color.match(
		/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
	);

	return rgb && rgb.length === 4
		? `#${`0${parseInt(rgb[1], 10).toString(16)}`.slice(-2)}${`0${parseInt(
				rgb[2],
				10
		  ).toString(16)}`.slice(-2)}${`0${parseInt(rgb[3], 10).toString(
				16
		  )}`.slice(-2)}`
		: '';
};

export const fitSvg = svgCode => {
	const template = document.createElement('div');

	template.setAttribute('id', 'maxi-temporary-elem');
	template.innerHTML = svgCode.trim();
	document.querySelector('body').append(template);

	const bbox = document.querySelector('#maxi-temporary-elem svg').getBBox();

	const SVGElement = document.querySelector('#maxi-temporary-elem svg');
	SVGElement.setAttribute(
		'viewBox',
		`${bbox.x}, ${bbox.y}, ${bbox.width}, ${bbox.height}`
	);
	SVGElement.removeAttribute('width');
	SVGElement.removeAttribute('height');

	const newSvgCode = document.querySelector(
		'#maxi-temporary-elem svg'
	).outerHTML;

	document.querySelector('#maxi-temporary-elem').remove();

	return newSvgCode;
};

export const svgAttributesReplacer = (svgCode, target = 'svg') => {
	const fillRegExp = /fill:[^n]+?(?=})/g;
	const fillStr = 'fill:#ff4a17';

	const fillRegExp2 = /[^-]fill="[^n]+?(?=")/g;
	const fillStr2 = ' fill="#ff4a17';

	const strokeRegExp = /stroke:[^n]+?(?=})/g;
	const strokeStr = 'stroke:#081219';

	const strokeRegExp2 = /[^-]stroke="[^n]+?(?=")/g;
	const strokeStr2 = ' stroke="#081219';

	return target === 'svg'
		? svgCode
				.replace(fillRegExp, fillStr)
				.replace(fillRegExp2, fillStr2)
				.replace(strokeRegExp, strokeStr)
				.replace(strokeRegExp2, strokeStr2)
		: target === 'icon'
		? svgCode
				.replace(strokeRegExp, strokeStr)
				.replace(strokeRegExp2, strokeStr2)
		: svgCode.replace(fillRegExp, fillStr).replace(fillRegExp2, fillStr2);
};

export const isColorLight = color => {
	const hex = color.replace('#', '');
	const colorRed = parseInt(hex.substr(0, 2), 16);
	const colorGreen = parseInt(hex.substr(2, 2), 16);
	const colorBlue = parseInt(hex.substr(4, 2), 16);
	const brightness =
		(colorRed * 299 + colorGreen * 587 + colorBlue * 114) / 1000;
	return brightness > 155;
};

export const getVarValue = currentColor => {
	return window
		.getComputedStyle(document.documentElement)
		.getPropertyValue(
			currentColor
				.substr(currentColor.lastIndexOf('var(') + 4)
				.replaceAll(')', '')
		);
};

export const svgCurrentColorStatus = (blockStyle, target = 'svg') => {
	const { getSelectedBlockClientId, getBlock } = select('core/block-editor');
	const clientId = getSelectedBlockClientId();

	const currentAttributes = getBlock(clientId)?.attributes;

	if (!currentAttributes) return null;

	const { receiveActiveStyleCardValue } = select('maxiBlocks/style-cards');

	const lineColorGlobal = receiveActiveStyleCardValue(
		'line-color',
		getBlockStyle(clientId),
		'icon'
	);
	const lineColorGlobalStatus = receiveActiveStyleCardValue(
		'line-color-global',
		getBlockStyle(clientId),
		'icon'
	);

	const colorType =
		target === 'icon' ? '' : target === 'svg' ? '-line' : '-fill';

	const iconPaletteAttr = getPaletteAttributes({
		obj: currentAttributes,
		prefix: 'icon-',
	});

	const iconPaletteStatus = iconPaletteAttr.paletteStatus;
	const iconPaletteColor = iconPaletteAttr.paletteColor;
	const iconColor = iconPaletteAttr.color;

	const iconInheritColor = currentAttributes['icon-inherit']
		? !iconPaletteStatus
			? rgbToHex(iconColor)
			: rgbToHex(
					`rgba(${getVarValue(
						`var(--maxi-${blockStyle}-color-${iconPaletteColor})`
					)}, 1)`
			  )
		: '';

	const { paletteStatus, paletteColor, color } = getPaletteAttributes({
		obj: currentAttributes,
		prefix: `${target}${colorType}-`,
	});

	const currentColor = !paletteStatus
		? rgbToHex(color)
		: rgbToHex(
				`rgba(${getVarValue(
					`var(--maxi-${blockStyle}-color-${paletteColor})`
				)},1)`
		  );

	return target === 'svg' && lineColorGlobalStatus
		? isColorLight(rgbToHex(lineColorGlobal))
		: isColorLight(
				target === 'icon' && currentAttributes['icon-inherit']
					? iconInheritColor
					: currentColor
		  );
};

export const onRequestInsertPattern = (
	parsedContent,
	usePlaceholderImage,
	isValidTemplate,
	onSelect,
	onRequestClose,
	replaceBlock,
	clientId
) => {
	const isValid = isValidTemplate(parsedContent);

	if (isValid) {
		const loadingMessage = `<h3>${__(
			'LOADING…',
			'maxi-blocks'
		)}<span class="maxi-spinner"></span></h3>`;

		onSelect({ content: loadingMessage });

		onRequestClose();

		const imagesLinks = [];
		const imagesIds = [];

		const allImagesRegexp = new RegExp('mediaID":(.*)",', 'g');

		const allImagesLinks = parsedContent.match(allImagesRegexp);

		const allImagesLinksParsed = allImagesLinks?.map(image => {
			const parsed = image.replace(/\\/g, '');

			const idRegexp = new RegExp('(?<=":)(.*?)(?=,")', 'g');
			const id = parsed.match(idRegexp);
			imagesIds.push(id);

			const urlRegexp = new RegExp('(?<=mediaURL":")(.*?)(?=",)', 'g');
			const url = parsed.match(urlRegexp);
			imagesLinks.push(url);

			return null;
		});

		if (!isEmpty(allImagesLinksParsed)) {
			let tempContent = parsedContent;
			const imagesLinksUniq = uniq(imagesLinks);
			const imagesIdsUniq = uniq(imagesIds);
			let counter = imagesLinksUniq.length;
			const checkCounter = imagesIdsUniq.length;

			if (counter !== checkCounter) {
				console.error(
					__(
						"Error processing images' links and ids - counts do not match",
						'maxi-blocks'
					)
				);
				replaceBlock(
					clientId,
					wp.blocks.rawHandler({
						HTML: parsedContent,
						mode: 'BLOCKS',
					})
				);
				return;
			}

			const imagesUniq = imagesIdsUniq.reduce(
				(o, k, i) => ({ ...o, [k]: imagesLinksUniq[i] }),
				{}
			);

			Object.entries(imagesUniq).map(image => {
				const id = image[0];
				const url = image[1];

				imageUploader(url, usePlaceholderImage).then(data => {
					tempContent = tempContent.replaceAll(url, data.url);
					tempContent = tempContent.replaceAll(id, data.id);
					counter -= 1;
					if (counter === 0) {
						replaceBlock(
							clientId,
							wp.blocks.rawHandler({
								HTML: tempContent,
								mode: 'BLOCKS',
							})
						);
					}
				});
				return null;
			});
		} else {
			// no images to process
			replaceBlock(
				clientId,
				wp.blocks.rawHandler({
					HTML: parsedContent,
					mode: 'BLOCKS',
				})
			);
		}
	} else {
		// not valid gutenberg code
		// TODO: show a human-readable error here
		console.error(__('The Code is not valid', 'maxi-blocks'));
		onRequestClose();
	}
};
