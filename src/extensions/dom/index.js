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

/**
 * Mutation Observer for:
 * - Add special classes on Settings Sidebar
 * - Hide original WP toolbar on selected Maxi Blocks
 */
document.addEventListener(
    'DOMContentLoaded',
    () => {
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
    }
)

/**
 * Fix Object Follower
 * Returns top and left constant position relative to scroll container for fixed elements
 *
 * @param {node} target     Element to be fixed
 * @param {node} reference  Element to be followed
 * @param {node} scrollEl   Element container with scroll attach
 */
export class FixObjectFollower {
    constructor(target, reference, scrollEl, position = 'top') {
        this.target = target;
        this.reference = reference;
        this.scrollEl = scrollEl || document;
        this.position = position;
        this.initEvents();
    }

    initEvents() {
        this.getPosition();
        this.scrollEl.addEventListener(
            'scroll',
            this.getPosition.bind(this)
        )
        this.scrollEl.addEventListener(
            'resize',
            this.getPosition.bind(this)
        )
        this.scrollEl.addEventListener(
            'change',
            this.getPosition.bind(this)
        )
        window.addEventListener(
            'resize',
            this.getPosition.bind(this)
        )
        document.addEventListener(
            'click',
            this.onClick.bind(this)
        )
    }

    onClick() {
        setTimeout(() => {
            this.getPosition()
        }, 500);
    }

    getPosition() {
        const posData = this.reference.getBoundingClientRect();
        const position = {
            top: this.getTop(posData),
            left: posData.left + posData.width,
        }

        this.setPosition(position)
    }

    getTop(posData) {
        switch (this.position) {
            case 'top':
                return posData.top;
            case 'middle':
                return posData.top + (posData.height / 2) - (this.target.clientHeight / 2);
            case 'down':
                return posData.top + posData.height - this.target.clientHeight;
        }
    }

    setPosition(position) {
        this.target.style.top = position.top + 'px';
        this.target.style.left = position.left + 'px';
    }
}

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