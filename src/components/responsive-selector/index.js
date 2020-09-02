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
import {
    xsMode,
    xlMode,
    xllMode,
    largeMode,
    mediumMode,
    smallMode,
} from '../../icons';

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
            if(size != 'xxl')
                editorWrapper.style.width = `${breakpoints[size]}px`;
            else
                editorWrapper.style.width = `2000px`;   // !!!

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
                {__('Base', 'maxi-blocks')}
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('xxl')}
                aria-pressed={'xxl' === deviceType}
            >
            {   xllMode}
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('xl')}
                aria-pressed={'xl' === deviceType}
            >
                {xlMode}
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('l')}
                aria-pressed={'l' === deviceType}
            >
                {largeMode}
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('m')}
                aria-pressed={'m' === deviceType}
            >
                {mediumMode}
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('s')}
                aria-pressed={'s' === deviceType}
            >
                {smallMode}
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChangeSize('xs')}
                aria-pressed={'xs' === deviceType}
            >
                {xsMode}
            </Button>
        </div>
    )
}

export default ResponsiveSelector;