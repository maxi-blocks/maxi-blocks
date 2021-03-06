/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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

const styleGenerator = styles => {
	let response = '';

	Object.entries(styles).forEach(([key, prop]) => {
		const target = getTarget(key);

		Object.values(prop.content).forEach(value => {
			Object.entries(value).forEach(([breakpoint, content]) => {
				if (isEmpty(content)) return;

				if (breakpoint === 'general') {
					response += `body.maxi-blocks--active .maxi-block.maxi-block--backend.${target}{`;
					response += getResponsiveStyles(content);
					response += '}';
				}
				if (breakpoint === 'xxl') {
					response += `
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xxl"] .maxi-block.maxi-block--backend.${target}{`;
					response += getResponsiveStyles(content);
					response += '}';
				}
				if (breakpoint === 'xl') {
					response += `
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xl"] .maxi-block.maxi-block--backend.${target},
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="l"] .maxi-block.maxi-block--backend.${target},
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="m"] .maxi-block.maxi-block--backend.${target},
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="s"] .maxi-block.maxi-block--backend.${target},
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xs"] .maxi-block.maxi-block--backend.${target}{`;
					response += getResponsiveStyles(content);
					response += '}';
				}
				if (breakpoint === 'l') {
					response += `
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="l"] .maxi-block.maxi-block--backend.${target},
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="m"] .maxi-block.maxi-block--backend.${target},
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="s"] .maxi-block.maxi-block--backend.${target},
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xs"] .maxi-block.maxi-block--backend.${target}{`;
					response += getResponsiveStyles(content);
					response += '}';
				}
				if (breakpoint === 'm') {
					response += `
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="m"] .maxi-block.maxi-block--backend.${target},
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="s"] .maxi-block.maxi-block--backend.${target},
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xs"] .maxi-block.maxi-block--backend.${target}{`;
					response += getResponsiveStyles(content);
					response += '}';
				}
				if (breakpoint === 's') {
					response += `
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="s"] .maxi-block.maxi-block--backend.${target},
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xs"] .maxi-block.maxi-block--backend.${target}{`;
					response += getResponsiveStyles(content);
					response += '}';
				}
				if (breakpoint === 'xs') {
					response += `
						body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xs"] .maxi-block.maxi-block--backend.${target}{`;
					response += getResponsiveStyles(content);
					response += '}';
				}
			});
		});
	});

	return response;
};

export default styleGenerator;
