/**
 * WordPress dependencies
 */
const { select } = wp.data;
const { getDefaultBlockName } = wp.blocks;

/**
 * Sidebar classes
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

                        if (!!blockName && blockName.indexOf('maxi-blocks') >= 0) {
                            if (document.querySelector('.edit-post-sidebar'))
                                document.querySelector('.edit-post-sidebar').classList.add('maxi-sidebar');
                            if (document.querySelector('.block-editor-block-inspector'))
                                document.querySelector('.block-editor-block-inspector').classList.add('maxi-controls')
                        }
                        else {
                            if (document.querySelector('.edit-post-sidebar').classList.contains('maxi-sidebar'))
                                document.querySelector('.edit-post-sidebar').classList.remove('maxi-sidebar');
                            if (document.querySelector('.block-editor-block-inspector').classList.contains('maxi-controls'))
                                document.querySelector('.block-editor-block-inspector').classList.remove('maxi-controls');
                        }
                    }
                }
            });
            observer.observe(targetNode, config);
        }
}