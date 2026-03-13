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

const filterEditorInteractionProps = (
	styles,
	{ stripTransitionProperties = false } = {}
) => {
	if (!stripTransitionProperties) {
		return styles;
	}

	return Object.fromEntries(
		Object.entries(styles).filter(
			([key]) => !/^transition(?:-.+)?$/.test(key)
		)
	);
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

const styleGenerator = (
	rawStyles,
	isIframe = false,
	isSiteEditor = false,
	breakpoint,
	options = {}
) => {
	let response = '';
	const {
		includeHoverSelectors = true,
		includeInteractionSelectors = includeHoverSelectors,
		stripTransitionProperties = !includeInteractionSelectors,
	} = options;

	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();
	const currentBreakpoint =
		breakpoint ?? select('maxiBlocks').receiveMaxiDeviceType();

	const styles = viewportUnitsProcessor(
		rawStyles,
		currentBreakpoint,
		baseBreakpoint
	); // replacing viewport units only for the editor

	BREAKPOINTS.forEach(breakpoint => {
		Object.entries(styles).forEach(([key, value]) => {
			const target = getTarget(key);
			const { content } = value;
			Object.entries(content).forEach(([suffix, props]) => {
				if (
					!includeInteractionSelectors &&
					/:(hover|focus|focus-visible|focus-within|active|visited)/.test(
						suffix
					)
				)
					return;
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

				const style = getResponsiveStyles(
					filterEditorInteractionProps(props[breakpoint], {
						stripTransitionProperties,
					})
				);

				if (!style.trim()) return;

				response += styleStringGenerator(
					`${target}${suffix}`,
					style,
					breakpoint,
					isIframe,
					isSiteEditor
				);

				if (breakpoint === 'general') {
					const generalStyle = getResponsiveStyles(
						filterEditorInteractionProps(props.general, {
							stripTransitionProperties,
						})
					);

					if (generalStyle.trim())
						response += styleStringGenerator(
							`${target}${suffix}`,
							generalStyle,
							baseBreakpoint,
							isIframe,
							isSiteEditor
						);

					if (props?.[baseBreakpoint]) {
						const baseBreakpointStyle = getResponsiveStyles(
							filterEditorInteractionProps(
								props[baseBreakpoint],
								{
									stripTransitionProperties,
								}
							)
						);

						if (baseBreakpointStyle.trim())
						response += styleStringGenerator(
							`${target}${suffix}`,
							baseBreakpointStyle,
							baseBreakpoint,
							isIframe,
							isSiteEditor
						);
					}
				}
			});
		});
	});

	return response;
};

export default styleGenerator;
