/**
 * WordPress dependencies
 */
const {
    select,
} = wp.data;

/**
 * General
 */
const allowedBlocks = [
    'maxi-blocks/block-image-box',
    'maxi-blocks/block-title-extra',
    'maxi-blocks/testimonials-slider-block',
    'maxi-blocks/row-maxi',
    'maxi-blocks/column-maxi',
    'maxi-blocks/button-maxi',
    'maxi-blocks/text-maxi',
    'maxi-blocks/divider-maxi',
    'maxi-blocks/image-maxi',
    'maxi-blocks/section-maxi',
    'maxi-blocks/container-maxi',
];

document.addEventListener(
    'DOMContentLoaded',
    () => {
        /**
         * Mutation Observer for:
         * - Add special classes on Settings Sidebar
         * - Hide original WP toolbar on selected Maxi Blocks
         */
        if (!!document.getElementsByClassName('edit-post-layout')) {
            const targetNode = document.querySelector('.edit-post-layout');
            const config = {
                attributes: false,
                childList: true,
                subtree: true
            };
            const observer = new MutationObserver(mutationsList => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList' && !!mutation.target.classList) {
                        const blockName = select('core/block-editor').getBlockName((select('core/block-editor').getSelectedBlockClientId()));
                        const editPostSidebarNode = document.querySelector('.edit-post-sidebar');
                        const blockEditorBlockInspectorNode = document.querySelector('.block-editor-block-inspector');
                        const blockToolbarUniversal = document.querySelector('.block-editor-block-toolbar');
                        const blockToolbarEditor = document.querySelector('.block-editor-block-list__block-popover');

                        if (!!blockName && allowedBlocks.includes(blockName)) {
                            if (editPostSidebarNode)
                                editPostSidebarNode.classList.add('maxi-sidebar');
                            if (blockEditorBlockInspectorNode)
                                blockEditorBlockInspectorNode.classList.add('maxi-controls')
                            if (blockToolbarUniversal)
                                blockToolbarUniversal.style.display = 'none';
                            if (blockToolbarEditor)
                                blockToolbarEditor.style.display = 'none';
                        }
                        else {
                            if (!!editPostSidebarNode && editPostSidebarNode.classList.contains('maxi-sidebar'))
                                editPostSidebarNode.classList.remove('maxi-sidebar');
                            if (!!blockEditorBlockInspectorNode && blockEditorBlockInspectorNode.classList.contains('maxi-controls'))
                                blockEditorBlockInspectorNode.classList.remove('maxi-controls');
                            if (blockToolbarUniversal)
                                blockToolbarUniversal.style.display = null;
                            if (blockToolbarEditor)
                                blockToolbarEditor.style.display = null;
                        }
                    }
                }
            });
            observer.observe(targetNode, config);
        }
        /**
         * Hover classes
         */
        window.addEventListener(
            'mouseover',
            e => {
                if(e.target.classList.contains('maxi-column-block')) {
                    const elem = (e.target).parentNode.parentNode.children;
                    for (var i = 0; i < elem.length; i++) {
                        elem[i].classList.add('maxi-column-hover');
                    }
                    (e.target).parentNode.classList.remove('maxi-column-hover');
                }
                if (
                    e.target.classList.contains('wp-block-maxi-blocks-column-maxi') &&
                    e.target.querySelector('.block-list-appender')
                ) {
                    Array.from(e.target.children).map(child =>
                        child.classList.contains('block-list-appender') ?
                            child.classList.add('block-list-appender--show') :
                            null
                    )
                }
            }
        )
        window.addEventListener(
            'mouseout',
            e => {
                if (
                    e.target.classList.contains('maxi-block') &&
                    e.target.querySelector('.block-list-appender')
                ) {
                    Array.from(e.target.children).map(child =>
                        child.classList.contains('block-list-appender') ?
                            child.classList.remove('block-list-appender--show') :
                            null
                    )
                }
            }
        )
    }
)

const openSidebar = item => {
    const sidebar = document.querySelector('.maxi-sidebar');
    const wrapperElement = document.querySelector(`.maxi-accordion-control__item[data-name="${item}"]`);
    const button = wrapperElement.querySelector('.maxi-accordion-control__item__button');
    const content = wrapperElement.querySelector('.maxi-accordion-control__item__panel');

    Array.from(document.getElementsByClassName('maxi-accordion-control__item__button')).map(el => {
        if (el.getAttribute('aria-expanded'))
            el.setAttribute('aria-expanded', false)
    })
    Array.from(document.getElementsByClassName('maxi-accordion-control__item__panel')).map(el => {
        if (!el.getAttribute('hidden'))
            el.setAttribute('hidden', '')
    })

    button.setAttribute('aria-expanded', true)
    content.removeAttribute('hidden');

    sidebar.scroll({
        top: wrapperElement.getBoundingClientRect().top,
        behavior: 'smooth'
    })
}
export default openSidebar;
