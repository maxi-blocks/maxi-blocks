/**
 * WordPress dependencies
 */
const {
    useSelect,
    useDispatch,
} = wp.data;
const {
    Button,
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Components
 */
const ResponsiveSelector = props => {
    const {
        className,
    } = props;

    const { deviceType, breakpoints } = useSelect(
        select => {
            const {
                __experimentalGetPreviewDeviceType
            } = select(
                'core/edit-post'
            );
            const {
                receiveMaxiBreakpoints
            } = select(
                'maxiBlocks'
            );
            return {
                deviceType: __experimentalGetPreviewDeviceType(),
                breakpoints: receiveMaxiBreakpoints()
            }
        }
    );

    const {
        __experimentalSetPreviewDeviceType: setPreviewDevice
    } = useDispatch(
        'core/edit-post'
    )

    const classes = classnames(
        'maxi-responsive-selector',
        className
    )

    const onChangeSize = size => {
        if (size === 'general')
            setPreviewDevice('Desktop')
        else
            setPreviewDevice(size)

        setScreenSize(size)
    }

    const setScreenSize = size => {
        const editorWrapper = document.querySelector('.edit-post-visual-editor.editor-styles-wrapper');
        const winHeight = window.outerWidth;

        editorWrapper.setAttribute('maxi-blocks-responsive', size)

        if (size === 'general') {
            editorWrapper.style.width = '';
            editorWrapper.style.margin = '';
        }
        else {
            editorWrapper.style.width = `${breakpoints[size]}px`;
            if (winHeight > breakpoints[size])
                editorWrapper.style.margin = '36px auto';
            else
                editorWrapper.style.margin = ''
        }
    }

    return (
        <div
            className={classes}
        >
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('general')}
                aria-pressed={'Desktop' === deviceType}
            >
                G
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('xl')}
                aria-pressed={'xl' === deviceType}
            >
                XL
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('l')}
                aria-pressed={'l' === deviceType}
            >
                L
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('m')}
                aria-pressed={'m' === deviceType}
            >
                M
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('s')}
                aria-pressed={'s' === deviceType}
            >
                S
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('xs')}
                aria-pressed={'xs' === deviceType}
            >
                XS
            </Button>
        </div>
    )
}

export default ResponsiveSelector;