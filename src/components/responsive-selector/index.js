/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
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
        onChange,
        selected
    } = props;

    const classes = classnames(
        'maxi-responsive-selector',
        className
    )

    return (
        <div
            className={classes}
        >
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChange('general')}
                aria-pressed={'general' === selected}
            >
                G
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChange('xl')}
                aria-pressed={'xl' === selected}
            >
                XL
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChange('l')}
                aria-pressed={'l' === selected}
            >
                L
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChange('m')}
                aria-pressed={'m' === selected}
            >
                M
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChange('s')}
                aria-pressed={'s' === selected}
            >
                S
            </Button>
            <Button
                className='maxi-responsive-selector__button'
                onClick={() => onChange('xs')}
                aria-pressed={'xs' === selected}
            >
                XS
            </Button>
        </div>
    )
}

export default ResponsiveSelector;