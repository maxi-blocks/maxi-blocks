/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import viewportUnitsProcessor from './viewportUnitsProcessor';

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
export const getResponsiveStyles = styles => {
	let responsiveStyles = '';
	for (const [key, value] of Object.entries(styles)) {
		responsiveStyles += ` ${key}: ${value};`;
	}
	return responsiveStyles;
};

const getTargetString = (target, isIframe, isSiteEditor) => {
	if (isSiteEditor)
		return `body.maxi-blocks--active.editor-styles-wrapper .is-root-container .maxi-block.maxi-block--backend.${target},body.maxi-blocks--active.editor-styles-wrapper[maxi-blocks-responsive] .is-root-container .maxi-block.maxi-block--backend.${target}{`;

	if (isIframe)
		return `body.maxi-blocks--active.editor-styles-wrapper .maxi-block.maxi-block--backend.${target},body.maxi-blocks--active.editor-styles-wrapper[maxi-blocks-responsive] .maxi-block.maxi-block--backend.${target}{`;

	return `body.maxi-blocks--active .edit-post-visual-editor .maxi-block.maxi-block--backend.${target},body.maxi-blocks--active .edit-post-visual-editor[maxi-blocks-responsive] .maxi-block.maxi-block--backend.${target}{`;
};

const styleStringGenerator = (
	target,
	content,
	breakpoint,
	isIframe,
	isSiteEditor
) => {
	let string = '';
	let generalString = '';
	let finalContent = content;

	if (content.includes('css:'))
		finalContent = content.replace('css: ', '').replace(';;', ';');

	generalString += getTargetString(target, isIframe, isSiteEditor);

	if (breakpoint === 'general') {
		string += generalString;
	} else if (breakpoint === 'xxl') {
		string += `body.maxi-blocks--active${
			!isIframe && !isSiteEditor
				? ' .edit-post-visual-editor'
				: '.editor-styles-wrapper'
		}[maxi-blocks-responsive="xxl"]${
			isSiteEditor ? ' .is-root-container' : ''
		} .maxi-block.maxi-block--backend.${target}{`;
	} else {
		let breakpointPos = ALLOWED_BREAKPOINTS.indexOf(breakpoint);

		do {
			string += `body.maxi-blocks--active${
				!isIframe && !isSiteEditor
					? ' .edit-post-visual-editor'
					: '.editor-styles-wrapper'
			}[maxi-blocks-responsive="${ALLOWED_BREAKPOINTS[breakpointPos]}"]${
				isSiteEditor ? ' .is-root-container' : ''
			} .maxi-block.maxi-block--backend.${target}${
				breakpointPos > 0 ? ',' : '{'
			}`;
			breakpointPos -= 1;
		} while (breakpointPos >= 0);
	}

	string += finalContent;
	string += '}';

	return string;
};

// Simple Last-Result Cache (Size 1)
// We use reference equality for rawStyles because styleResolver returns cached objects
let lastCache = {
	args: null,
	result: null,
};

const styleGenerator = (
	rawStyles,
	isIframe = false,
	isSiteEditor = false,
	breakpoint
) => {
	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();
	const currentBreakpoint =
		breakpoint ?? select('maxiBlocks').receiveMaxiDeviceType();

	// Check cache
	if (
		lastCache.args &&
		lastCache.args.rawStyles === rawStyles &&
		lastCache.args.isIframe === isIframe &&
		lastCache.args.isSiteEditor === isSiteEditor &&
		lastCache.args.breakpoint === breakpoint &&
		lastCache.args.baseBreakpoint === baseBreakpoint &&
		lastCache.args.currentBreakpoint === currentBreakpoint
	) {
		return lastCache.result;
	}

	let response = '';

	const styles = viewportUnitsProcessor(rawStyles, currentBreakpoint); // replacing viewport units only for the editor

	BREAKPOINTS.forEach(breakpoint => {
		Object.entries(styles).forEach(([key, value]) => {
			const target = getTarget(key);
			const { content } = value;
			Object.entries(content).forEach(([suffix, props]) => {
				if (!props[breakpoint]) return;

				const isBaseLowerThanCurrent =
					BREAKPOINTS.indexOf(breakpoint) <=
					BREAKPOINTS.indexOf(baseBreakpoint);

				if (
					breakpoint !== currentBreakpoint &&
					isBaseLowerThanCurrent &&
					breakpoint !== 'general'
				)
					return;

				const style = getResponsiveStyles(props[breakpoint]);

				response += styleStringGenerator(
					`${target}${suffix}`,
					style,
					breakpoint,
					isIframe,
					isSiteEditor
				);

				if (breakpoint === 'general') {
					response += styleStringGenerator(
						`${target}${suffix}`,
						getResponsiveStyles(props.general),
						baseBreakpoint,
						isIframe,
						isSiteEditor
					);
					if (props?.[baseBreakpoint])
						response += styleStringGenerator(
							`${target}${suffix}`,
							getResponsiveStyles(props[baseBreakpoint]),
							baseBreakpoint,
							isIframe,
							isSiteEditor
						);
				}
			});
		});
	});

	// Update cache
	lastCache = {
		args: {
			rawStyles,
			isIframe,
			isSiteEditor,
			breakpoint,
			baseBreakpoint,
			currentBreakpoint,
		},
		result: response,
	};

	return response;
};

export default styleGenerator;
