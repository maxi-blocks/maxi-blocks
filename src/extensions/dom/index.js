/**
 * WordPress dependencies
 */
const { select } = wp.data;
const { getDefaultBlockName } = wp.blocks;

/**
 * Adds special classes on Settings Sidebar
 */
document.onreadystatechange = () => {
    if (document.readyState === 'complete')
        if (!!document.getElementsByClassName('edit-post-layout')) {

            const targetNode = document.querySelector('.edit-post-layout');
            const config = {
                attributes: true,
                childList: true,
                subtree: true
            };
            const observer = new MutationObserver(mutationsList => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList' && !!mutation.target.classList) {
                        const blockName = select('core/block-editor').getBlockName((select('core/block-editor').getSelectedBlockClientId()));
                        const editPostSidebarNode = document.querySelector('.edit-post-sidebar');
                        const blockEditorBlockInspectorNode = document.querySelector('.block-editor-block-inspector');
                        
                        if (!!blockName && blockName.indexOf('maxi-blocks') >= 0) {
                            if (editPostSidebarNode)
                                editPostSidebarNode.classList.add('maxi-sidebar');
                            if (blockEditorBlockInspectorNode)
                                blockEditorBlockInspectorNode.classList.add('maxi-controls')
                        }
                        else {
                            if (!!editPostSidebarNode && editPostSidebarNode.classList.contains('maxi-sidebar'))
                                editPostSidebarNode.classList.remove('maxi-sidebar');
                            if (!!blockEditorBlockInspectorNode && blockEditorBlockInspectorNode.classList.contains('maxi-controls'))
                                blockEditorBlockInspectorNode.classList.remove('maxi-controls');
                        }
                    }
                }
            });
            observer.observe(targetNode, config);
        }
}