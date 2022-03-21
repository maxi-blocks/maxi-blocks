const ALLOWED_BREAKPOINTS = ['xs', 's', 'm', 'l', 'xl'];
const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Retrieve cleaned target
 *
 * @param {string} target style target for scoping
 */
const getTarget = target => {
	if (target.indexOf('__$:') !== -1) return target.replace('__$', '');
	if (target.indexOf('__$>') !== -1) return target.replace('__$', '');
	if (target.indexOf('__$#') !== -1) return target.replace('__$', '');

	return target.replace('__$', ' .');
};

/**
 * Retrieve each one of the styles CSS props
 *
 * @param {obj} styles responsive styles device
 */
const getResponsiveStyles = styles => {
	let responsiveStyles = '';
	for (const [key, value] of Object.entries(styles)) {
		responsiveStyles += ` ${key}: ${value};`;
	}
	return responsiveStyles;
};

const getTargetString = (target, isIframe) => {
	if (!isIframe)
		return `body.maxi-blocks--active .edit-post-visual-editor .maxi-block.maxi-block--backend.${target}, body.maxi-blocks--active .edit-post-visual-editor[maxi-blocks-responsive] .maxi-block.maxi-block--backend.${target}{`;

	return `body.maxi-blocks--active.editor-styles-wrapper .maxi-block.maxi-block--backend.${target}, body.maxi-blocks--active.editor-styles-wrapper[maxi-blocks-responsive] .maxi-block.maxi-block--backend.${target}{`;
};

const styleStringGenerator = (target, content, breakpoint, isIframe) => {
	let string = '';
	let generalString = '';
	let finalContent = content;

	if (content.includes('css:'))
		finalContent = content.replace('css: ', '').replace(';;', ';');

	generalString += getTargetString(target, isIframe);

	if (breakpoint === 'general') {
		string += generalString;
	} else if (breakpoint === 'xxl') {
		string += `body.maxi-blocks--active${
			!isIframe ? ' .edit-post-visual-editor' : '.editor-styles-wrapper'
		}[maxi-blocks-responsive="xxl"] .maxi-block.maxi-block--backend.${target}{`;
	} else {
		let breakpointPos = ALLOWED_BREAKPOINTS.indexOf(breakpoint);

		do {
			string += `body.maxi-blocks--active${
				!isIframe
					? ' .edit-post-visual-editor'
					: '.editor-styles-wrapper'
			}[maxi-blocks-responsive="${
				ALLOWED_BREAKPOINTS[breakpointPos]
			}"] .maxi-block.maxi-block--backend.${target}${
				breakpointPos ? ',' : '{'
			}`;
			breakpointPos -= 1;
		} while (breakpointPos >= 0);
	}

	string += finalContent;
	string += '}';

	return string;
};

const mediaStylesGenerator = (target, content, breakpoint, media, isIframe) => {
	let string = '';
	let generalString = '';
	let finalContent = content;

	if (content.includes('css:')) {
		finalContent = content.replaceAll('css: ', '').replaceAll(';;', ';');
	}

	generalString += getTargetString(target, isIframe);

	// Media
	if (breakpoint !== 'general')
		string += `@media only screen and (${
			breakpoint !== 'xxl' ? 'max-width' : 'min-width'
		}: ${
			breakpoint !== 'xxl' ? media : media + 1 // Ensures XXl doesn't affect XL
		}px){${generalString}${finalContent}}}`;

	return string;
};

const styleGenerator = (
	styles,
	breakpoints,
	currentBreakpoint,
	isIframe = false
) => {
	let response = '';

	BREAKPOINTS.forEach(breakpoint => {
		Object.entries(styles).forEach(([key, value]) => {
			const target = getTarget(key);
			const { content } = value;
			Object.entries(content).forEach(([suffix, props]) => {
				if (!props[breakpoint]) return;

				const style = getResponsiveStyles(props[breakpoint]);

				if (currentBreakpoint === 'general') {
					response += mediaStylesGenerator(
						`${target}${suffix}`,
						style,
						breakpoint,
						breakpoints[breakpoint !== 'xxl' ? breakpoint : 'xl'],
						isIframe
					);
					if (breakpoint === 'general')
						response += styleStringGenerator(
							`${target}${suffix}`,
							style,
							breakpoint,
							isIframe
						);
				} else
					response += styleStringGenerator(
						`${target}${suffix}`,
						style,
						breakpoint,
						isIframe
					);
			});
		});
	});

	return response;
};

export default styleGenerator;
