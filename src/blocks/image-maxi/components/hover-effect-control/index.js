/**
 * ============================================================================
 * HOVER EFFECT CONTROL - Image Block Hover Animation Settings Panel
 * ============================================================================
 *
 * This component provides a comprehensive UI for configuring hover effects
 * on image blocks in the Maxi Blocks WordPress plugin. It allows users to
 * choose between three hover modes:
 *
 * 1. NONE - No hover effect
 * 2. BASIC - Image-only effects (zoom, rotate, blur, sepia, etc.)
 * 3. TEXT - Text overlay effects with customizable title, content, and styling
 *
 * The component is optimized for performance using React.memo() on heavy
 * sub-components to prevent unnecessary re-renders during user input.
 * ============================================================================
 */

/**
 * WordPress dependencies
 * - __: Internationalization function for translating strings
 * - useState, useEffect, useRef, useCallback, useMemo, memo: React hooks for state and optimization
 * - useDebounce: WordPress hook to delay function execution (reduces API calls during typing)
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef, useCallback, useMemo, memo } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';

/**
 * External dependencies
 * - isNil: Lodash utility to check if value is null or undefined
 * - classnames: Utility for conditionally joining CSS class names
 */
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Internal Maxi Blocks UI Components
 * These are custom form controls used throughout the Maxi Blocks plugin
 */
import AdvancedNumberControl from '@components/advanced-number-control'; // Number input with min/max/step
import AxisControl from '@components/axis-control';                       // Padding/margin control (top/right/bottom/left)
import BackgroundControl from '@components/background-control';           // Background color/gradient picker
import BorderControl from '@components/border-control';                   // Border style/width/radius controls
import Icon from '@components/icon';                                      // SVG icon wrapper
import SelectControl from '@components/select-control';                   // Dropdown select
import SettingTabsControl from '@components/setting-tabs-control';        // Tab/button group switcher
import TextareaControl from '@components/textarea-control';               // Multi-line text input
import ToggleSwitch from '@components/toggle-switch';                     // On/off toggle
import TypographyControl from '@components/typography-control';           // Font family/size/weight controls

// Third-party bezier curve editor for custom animation timing
import BezierEditor from 'bezier-easing-editor';

// Helpers to get default and grouped block attributes
import { getDefaultAttribute, getGroupAttributes } from '@extensions/styles';

/**
 * Icons used in the hover type selector buttons
 * - hoverNone, hoverBasic, hoverText: Icons for the three hover modes
 * - align*: Icons for text position presets (corners and center)
 */
import {
    hoverNone,
    hoverBasic,
    hoverText,
    alignCenterCenter,
    alignLeftTop,
    alignLeftBottom,
    alignRightTop,
    alignRightBottom,
} from '@maxi-icons';

/**
 * ============================================================================
 * CONSTANTS - Effect type categorization
 * ============================================================================
 */

/**
 * Effects that support transition duration control
 * These effects animate over time, so users can adjust how long the animation takes
 */
const DURATION_SUPPORTED_EFFECTS = [
    'zoom-in',        // Scale image larger
    'zoom-out',       // Scale image smaller
    'slide',          // Move image in a direction
    'rotate',         // Rotate image
    'blur',           // Apply blur filter
    'sepia',          // Apply sepia color filter
    'clear-sepia',    // Remove sepia (starts sepia, becomes clear)
    'grey-scale',     // Convert to grayscale
    'clear-grey-scale', // Remove grayscale (starts gray, becomes colored)
];

/**
 * Effects that support an "amount" value control
 * These effects have variable intensity (e.g., how much to zoom, how many degrees to rotate)
 */
const AMOUNT_SUPPORTED_EFFECTS = [
    'zoom-in',   // Amount = scale factor
    'zoom-out',  // Amount = scale factor
    'rotate',    // Amount = degrees of rotation
    'blur',      // Amount = blur radius in pixels
    'slide',     // Amount = distance to slide
];

/**
 * ============================================================================
 * SUB-COMPONENT: DebouncedTextareaControl
 * ============================================================================
 *
 * A performance-optimized textarea that:
 * 1. Updates the UI immediately when the user types (no lag)
 * 2. Delays the actual attribute save by 300ms (reduces re-renders)
 *
 * This prevents the entire block from re-rendering on every keystroke,
 * which would cause noticeable lag, especially with heavy components
 * like TypographyControl rendered nearby.
 */
const DebouncedTextareaControl = memo( ( { value, onChange, ...props } ) => {
    // Local state for immediate UI updates
    const [ localValue, setLocalValue ] = useState( value );

    // Sync local state when external value changes (e.g., undo/redo)
    useEffect( () => {
        setLocalValue( value );
    }, [ value ] );

    // Debounced onChange - waits 300ms after typing stops before saving
    const debouncedOnChange = useDebounce( onChange, 300 );

    // Handle user input: update UI instantly, save to attributes after delay
    const handleChange = ( newValue ) => {
        setLocalValue( newValue );      // Instant: user sees their typing immediately
        debouncedOnChange( newValue );  // Delayed: attribute update happens in background
    };

    return (
        <TextareaControl
            { ...props }
            value={ localValue }
            onChange={ handleChange }
        />
    );
} );

/**
 * ============================================================================
 * SUB-COMPONENT: MemoizedTypography
 * ============================================================================
 *
 * A memoized wrapper around TypographyControl to prevent expensive re-renders.
 *
 * TypographyControl is a heavy component (font picker, size, weight, line-height,
 * letter-spacing, text-transform, etc.). Without memoization, it would re-render
 * every time the user types in the textarea, causing lag.
 *
 * Props:
 * - groupName: 'hoverTitleTypography' or 'hoverContentTypography' for getGroupAttributes
 * - attrPrefix: 'hover-title-' or 'hover-content-' for TypographyControl prefix
 * - props: All block attributes (passed through to getGroupAttributes)
 * - onChange: Function to save attribute changes
 * - onChangeInline: Function for live preview updates
 * - blockStyle: Current block style (light/dark theme)
 * - clientId: Unique block identifier
 * - textLevel: 'h4' for title, 'p' for content
 */
const MemoizedTypography = memo(({ props, groupName, attrPrefix, onChange, onChangeInline, blockStyle, clientId, textLevel = 'p' }) => (
    <TypographyControl
        // Get all typography-related attributes for this group
        typography={{ ...getGroupAttributes( props, groupName ) }}
        hideAlignment                    // Don't show text alignment (handled by preset buttons)
        onChangeInline={ onChangeInline } // Live preview in editor
        onChange={ onChange }            // Save to block attributes
        prefix={ attrPrefix }            // Attribute key prefix (e.g., 'hover-title-')
        disableCustomFormats             // Don't allow custom text formats
        showBottomGap                    // Show spacing control below text
        blockStyle={ blockStyle }        // Current style theme
        clientId={ clientId }            // Block ID for targeting
        textLevel={ textLevel }
        globalProps={ { target: '', type: textLevel } }
        // CSS selector for inline style targeting
        inlineTarget={ `maxi-hover-details__content ${textLevel}` }
        tabsClassName="mb-hover-bg"
    />
));

/**
 * ============================================================================
 * SUB-COMPONENT: MemoizedDecoration
 * ============================================================================
 *
 * A memoized section containing the hover overlay's visual styling controls:
 * - Background color/gradient
 * - Border (optional, toggled by user)
 * - Padding (optional, toggled by user)
 * - Margin (optional, toggled by user)
 *
 * These controls style the text overlay container that appears on hover.
 * Memoized to prevent re-renders when the user is typing in textareas.
 */
const MemoizedDecoration = memo(({ props, clientId, onChange, onChangeInline, breakpoint }) => (
    <>
        {/* Background Control - Color and gradient picker for the overlay */}
        <BackgroundControl
            // Get background-related attributes (color, gradient)
            { ...getGroupAttributes( props, ['hoverBackground', 'hoverBackgroundColor', 'hoverBackgroundGradient'] ) }
            // Apply inline styles for live preview
            onChangeInline={ ( obj ) => onChangeInline( obj, '.maxi-hover-details__content' ) }
            onChange={ onChange }
            // Disable complex background types - only color/gradient for overlay
            disableClipPath disableImage disableVideo disableSVG
            prefix="hover-"
            clientId={ clientId }
            tabsClassName="mb-hover-bg"
            breakpoint={ breakpoint }
        />

        {/* Custom Border Toggle - Shows border controls when enabled */}
        <ToggleSwitch
            label={ __( 'Custom border', 'maxi-blocks' ) }
            selected={ props[ 'hover-border-status' ] }
            onChange={ ( val ) => onChange( { 'hover-border-status': val } ) }
        />
        { props[ 'hover-border-status' ] && (
        <BorderControl
            { ...getGroupAttributes( props, ['hoverBorder', 'hoverBorderWidth', 'hoverBorderRadius'] ) }
            onChangeInline={ ( obj ) => onChangeInline( obj, '.maxi-hover-details__content' ) }
            onChange={ onChange }
            prefix="hover-"
            disablePalette     // Don't show color palette (use solid colors)
            clientId={ clientId }
            breakpoint={ breakpoint }
        />
        )}

        {/* Custom Padding Toggle - Shows padding controls when enabled */}
        <ToggleSwitch
            label={ __( 'Custom padding', 'maxi-blocks' ) }
            selected={ props[ 'hover-padding-status' ] }
            onChange={ ( val ) => onChange( { 'hover-padding-status': val } ) }
        />
        { props[ 'hover-padding-status' ] && (
            <AxisControl
                { ...getGroupAttributes( props, 'hoverPadding' ) }
                label={ __( 'Padding', 'maxi-blocks' ) }
                onChange={ onChange }
                target="hover-padding"
                breakpoint={ breakpoint }
                disableAuto        // Don't allow "auto" value for padding
            />
        ) }

        {/* Custom Margin Toggle - Shows margin controls when enabled */}
        <ToggleSwitch
            label={ __( 'Custom margin', 'maxi-blocks' ) }
            selected={ props[ 'hover-margin-status' ] }
            onChange={ ( val ) => onChange( { 'hover-margin-status': val } ) }
        />
        { props[ 'hover-margin-status' ] && (
            <AxisControl
                { ...getGroupAttributes( props, 'hoverMargin' ) }
                label={ __( 'Margin', 'maxi-blocks' ) }
                onChange={ onChange }
                target="hover-margin"
                optionType="string"  // Allow string values for margin
                breakpoint={ breakpoint }
            />
        ) }
    </>
));

/**
 * ============================================================================
 * MAIN COMPONENT: HoverEffectControl
 * ============================================================================
 *
 * The primary settings panel for image hover effects. This component orchistrates
 * all hover effect configuration including:
 *
 * 1. Hover type selection (none/basic/text)
 * 2. Preview toggle
 * 3. Extend outside boundary toggle
 * 4. Transition timing controls (duration, easing)
 * 5. Effect-specific controls (varies by hover type)
 *
 * Props:
 * - className: Additional CSS classes
 * - onChangeInline: Function for live preview updates
 * - onChange: Function to save attribute changes
 * - blockStyle: Current block style theme
 * - clientId: Unique block identifier
 * - breakpoint: Current responsive breakpoint (general/xxl/xl/l/m/s/xs)
 * - ...props: All block attributes (accessed via props['attribute-name'])
 */
const HoverEffectControl = ( props ) => {
    // Destructure commonly used props
    const {
        className,
        onChangeInline,  // For live preview CSS updates
        onChange,        // For saving to block attributes
        blockStyle,      // Current style theme
        clientId,        // Unique block ID
        breakpoint,      // Responsive breakpoint
    } = props;

    // Create readable aliases for frequently accessed attributes
    const hoverType = props[ 'hover-type' ];                     // 'none' | 'basic' | 'text'
    const basicEffectType = props[ 'hover-basic-effect-type' ];  // 'zoom-in' | 'blur' | etc.
    const transitionEasing = props[ 'hover-transition-easing' ]; // 'ease' | 'linear' | etc.

    // Build CSS class string for the container
    const classes = classnames( 'maxi-hover-effect-control', className );

    /**
     * ========================================================================
     * MEMOIZED LOGIC HELPERS
     * ========================================================================
     * These computed values determine which controls to show.
     * Memoized to avoid recalculating on every render.
     */

    /**
     * Should we show transition duration and easing controls?
     * Yes if: text mode OR a basic effect that animates over time
     */
    const showTransitionControls = useMemo( () => {
        return (
            hoverType === 'text' ||
            DURATION_SUPPORTED_EFFECTS.includes( basicEffectType )
        );
    }, [ hoverType, basicEffectType ] );

    /**
     * Should we show the "amount" slider?
     * Yes if: basic mode AND an effect with variable intensity
     */
    const showAmountControl = useMemo( () => {
        return (
            hoverType === 'basic' &&
            AMOUNT_SUPPORTED_EFFECTS.includes( basicEffectType )
        );
    }, [ hoverType, basicEffectType ] );

    /**
     * ========================================================================
     * HELPER FUNCTIONS
     * ========================================================================
     */

    /**
     * Remove any inline preview styles from the image element.
     * Called when disabling effects or preview mode.
     */
    const resetImagePreviewStyle = () => {
        const image = document.querySelector( `#block-${ clientId } .maxi-image-block__image` );
        if ( image ) {
            image.removeAttribute( 'style' );
        }
    };

    /**
     * Set hover type to 'none' and clean up preview styles.
     */
    const setEffectNone = () => {
        onChange( { 'hover-type': 'none' } );
        resetImagePreviewStyle();
    };

    /**
     * Disable preview mode and clean up preview styles.
     */
    const disablePreview = () => {
        onChange( { 'hover-preview': false } );
        resetImagePreviewStyle();
    };

    /**
     * Debounced onChange for text inputs (prevents lag while typing).
     * 300ms delay before saving to attributes.
     */
    const debouncedOnChange = useDebounce( onChange, 300 );

    /**
     * Memoized callback for updating text content attributes.
     * Uses debouncing to reduce re-renders during typing.
     */
    const handleTextUpdate = useCallback( ( key, val ) => {
        debouncedOnChange( { [ key ]: val } );
    }, [ debouncedOnChange ] );

    /**
     * ========================================================================
     * RENDER
     * ========================================================================
     */
    return (
        <div className={ classes }>

            {/* ================================================================
                SECTION 1: Hover Type Selector
                Three-button toggle: None | Basic | Text
                ================================================================ */}
            <SettingTabsControl
                className="maxi-hover-effect-control__tabs"
                label={ __( 'Hover animation', 'maxi-blocks' ) }
                type="buttons"
                selected={ hoverType }
                items={ [
                    { icon: <Icon icon={ hoverNone } />, value: 'none' },   // No effect
                    { icon: <Icon icon={ hoverBasic } />, value: 'basic' }, // Image effects
                    { icon: <Icon icon={ hoverText } />, value: 'text' },   // Text overlay
                ] }
                onChange={ ( val ) => {
                    if ( val === 'none' ) {
                        // Disable effects and clean up
                        setEffectNone();
                    } else {
                        // Enable effect with default duration
                        onChange( {
                            'hover-type': val,
                            'hover-transition-duration': 0.5, // Default 0.5 second animation
                        } );
                    }
                } }
                hasBorder
            />

            {/* Only show effect controls if hover type is not 'none' */}
            { hoverType !== 'none' && (
                <>
                    {/* ============================================================
                        SECTION 2: Common Toggle Options
                        - Preview: Show hover effect in editor
                        - Extend: Allow effect to overflow container
                        ============================================================ */}
                    <ToggleSwitch
                        label={ __( 'Show hover preview', 'maxi-blocks' ) }
                        selected={ props[ 'hover-preview' ] }
                        onChange={ ( val ) => ( ! val ? disablePreview() : onChange( { 'hover-preview': val } ) ) }
                    />
                    <ToggleSwitch
                        label={ __( 'Extend outside boundary', 'maxi-blocks' ) }
                        selected={ props[ 'hover-extension' ] }
                        onChange={ ( val ) => onChange( { 'hover-extension': val } ) }
                    />

                    {/* ============================================================
                        SECTION 3: Transition Timing Controls
                        Shown for text effects and most basic effects
                        ============================================================ */}
                    { showTransitionControls && (
                        <>
                            {/* Duration slider: 0-10 seconds in 0.1s increments */}
                            <AdvancedNumberControl
                                label={ __( 'Duration(s)', 'maxi-blocks' ) }
                                value={ props[ 'hover-transition-duration' ] }
                                min={ 0 }
                                step={ 0.1 }
                                max={ 10 }
                                initialPosition={ getDefaultAttribute( 'hover-transition-duration' ) }
                                onChangeValue={ ( val ) =>
                                    onChange( {
                                        'hover-transition-duration': ! isNil( val ) && val !== '' ? val : '',
                                    } )
                                }
                                onReset={ () =>
                                    onChange( {
                                        'hover-transition-duration': getDefaultAttribute( 'hover-transition-duration' ),
                                        isReset: true,
                                    } )
                                }
                            />

                            {/* Easing function dropdown */}
                            <SelectControl
                                __nextHasNoMarginBottom
                                label={ __( 'Easing', 'maxi-blocks' ) }
                                value={ transitionEasing }
                                defaultValue={ getDefaultAttribute( 'hover-transition-easing' ) }
                                options={ [
                                    { label: __( 'Ease', 'maxi-blocks' ), value: 'ease' },         // Smooth start & end
                                    { label: __( 'Linear', 'maxi-blocks' ), value: 'linear' },     // Constant speed
                                    { label: __( 'Ease-in', 'maxi-blocks' ), value: 'ease-in' },   // Slow start
                                    { label: __( 'Ease-out', 'maxi-blocks' ), value: 'ease-out' }, // Slow end
                                    { label: __( 'Ease-in-out', 'maxi-blocks' ), value: 'ease-in-out' }, // Slow start & end
                                    { label: __( 'Cubic-bezier', 'maxi-blocks' ), value: 'cubic-bezier' }, // Custom curve
                                ] }
                                onChange={ ( val ) => onChange( { 'hover-transition-easing': val } ) }
                                onReset={ () =>
                                    onChange( {
                                        'hover-transition-easing': getDefaultAttribute( 'hover-transition-easing' ),
                                        isReset: true,
                                    } )
                                }
                            />

                            {/* Custom bezier curve editor (shown when cubic-bezier selected) */}
                            { transitionEasing === 'cubic-bezier' && (
                                <BezierEditor
                                    value={ props[ 'hover-transition-easing-cubic-bezier' ] }
                                    onChange={ ( val ) =>
                                        onChange( { 'hover-transition-easing-cubic-bezier': val } )
                                    }
                                />
                            )}
                        </>
                    ) }

                    {/* ============================================================
                        SECTION 4: Basic Effect Configuration
                        Shown only when hover-type === 'basic'
                        ============================================================ */}
                    { hoverType === 'basic' && (
                        <>
                            {/* Effect type dropdown (zoom, blur, sepia, etc.) */}
                            <SelectControl
                                __nextHasNoMarginBottom
                                label={ __( 'Effect type', 'maxi-blocks' ) }
                                value={ basicEffectType }
                                defaultValue={ getDefaultAttribute( 'hover-basic-effect-type' ) }
                                options={ [
                                    // Transform effects
                                    { label: __( 'Zoom in', 'maxi-blocks' ), value: 'zoom-in' },
                                    { label: __( 'Zoom out', 'maxi-blocks' ), value: 'zoom-out' },
                                    { label: __( 'Slide', 'maxi-blocks' ), value: 'slide' },
                                    { label: __( 'Rotate', 'maxi-blocks' ), value: 'rotate' },
                                    // Opacity effect
                                    { label: __( 'Flashing', 'maxi-blocks' ), value: 'flashing' },
                                    // Filter effects
                                    { label: __( 'Blur', 'maxi-blocks' ), value: 'blur' },
                                    { label: __( 'Sepia', 'maxi-blocks' ), value: 'sepia' },
                                    { label: __( 'Clear sepia', 'maxi-blocks' ), value: 'clear-sepia' },
                                    { label: __( 'Gray scale', 'maxi-blocks' ), value: 'grey-scale' },
                                    { label: __( 'Clear gray scale', 'maxi-blocks' ), value: 'clear-grey-scale' },
                                    // Overlay effects
                                    { label: __( 'Shine', 'maxi-blocks' ), value: 'shine' },
                                    { label: __( 'Circle shine', 'maxi-blocks' ), value: 'circle-shine' },
                                ] }
                                onChange={ ( val ) => onChange( { 'hover-basic-effect-type': val } ) }
                                onReset={ () =>
                                    onChange( {
                                        'hover-basic-effect-type': getDefaultAttribute( 'hover-basic-effect-type' ),
                                        isReset: true,
                                    } )
                                }
                            />

                            {/* Amount slider for effects with variable intensity */}
                            { showAmountControl && (
                                <AdvancedNumberControl
                                    label={ __( 'Amount', 'maxi-blocks' ) }
                                    // Dynamic attribute key based on effect type
                                    value={ props[ `hover-basic-${ basicEffectType }-value` ] }
                                    min={ 0 }
                                    step={ 0.1 }
                                    max={ 100 }
                                    initialPosition={ getDefaultAttribute( `hover-basic-${ basicEffectType }-value` ) }
                                    onChangeValue={ ( val ) =>
                                        onChange( {
                                            [ `hover-basic-${ basicEffectType }-value` ]: ! isNil( val ) && val !== '' ? val : '',
                                        } )
                                    }
                                    onReset={ () =>
                                        onChange( {
                                            [ `hover-basic-${ basicEffectType }-value` ]: getDefaultAttribute( `hover-basic-${ basicEffectType }-value` ),
                                            isReset: true,
                                        } )
                                    }
                                />
                            ) }
                        </>
                    ) }

                    {/* ============================================================
                        SECTION 5: Text Effect Configuration
                        Shown only when hover-type === 'text'
                        Includes: animation type, position, title, content, styling
                        ============================================================ */}
                    { hoverType === 'text' && (
                        <>
                            {/* Text animation type dropdown */}
                            <SelectControl
                                __nextHasNoMarginBottom
                                label={ __( 'Animation type', 'maxi-blocks' ) }
                                value={ props[ 'hover-text-effect-type' ] }
                                defaultValue={ getDefaultAttribute( 'hover-text-effect-type' ) }
                                options={ [
                                    // Opacity animation
                                    { label: __( 'Fade', 'maxi-blocks' ), value: 'fade' },
                                    // Push animations (image moves to reveal text)
                                    { label: __( 'Push up', 'maxi-blocks' ), value: 'push-up' },
                                    { label: __( 'Push right', 'maxi-blocks' ), value: 'push-right' },
                                    { label: __( 'Push down', 'maxi-blocks' ), value: 'push-down' },
                                    { label: __( 'Push left', 'maxi-blocks' ), value: 'push-left' },
                                    // Slide animations (text slides in over image)
                                    { label: __( 'Slide up', 'maxi-blocks' ), value: 'slide-up' },
                                    { label: __( 'Slide right', 'maxi-blocks' ), value: 'slide-right' },
                                    { label: __( 'Slide down', 'maxi-blocks' ), value: 'slide-down' },
                                    { label: __( 'Slide left', 'maxi-blocks' ), value: 'slide-left' },
                                    // 3D animation
                                    { label: __( 'Flip horizontal', 'maxi-blocks' ), value: 'flip-horiz' },
                                ] }
                                onChange={ ( val ) => onChange( { 'hover-text-effect-type': val } ) }
                                onReset={ () =>
                                    onChange( {
                                        'hover-text-effect-type': getDefaultAttribute( 'hover-text-effect-type' ),
                                        isReset: true,
                                    } )
                                }
                            />

                            {/* Text position preset buttons (5 positions) */}
                            <SettingTabsControl
                                type="buttons"
                                fullWidthMode
                                target="hover-text-preset"
                                selected={ props[ 'hover-text-preset' ] }
                                items={ [
                                    { icon: <Icon icon={ alignLeftTop } />, value: 'left-top' },         // Top-left
                                    { icon: <Icon icon={ alignRightTop } />, value: 'right-top' },       // Top-right
                                    { icon: <Icon icon={ alignCenterCenter } />, value: 'center-center' }, // Center
                                    { icon: <Icon icon={ alignLeftBottom } />, value: 'left-bottom' },   // Bottom-left
                                    { icon: <Icon icon={ alignRightBottom } />, value: 'right-bottom' }, // Bottom-right
                                ] }
                                onChange={ ( val ) => onChange( { 'hover-text-preset': val } ) }
                            />

                            {/* --------------------------------------------------------
                                Hover Title Section
                                - Textarea for title content
                                - Toggle to enable custom typography
                                - Typography controls (when enabled)
                                -------------------------------------------------------- */}
                            <DebouncedTextareaControl
                                placeholder={ __( 'Add hover title text here', 'maxi-blocks' ) }
                                value={ props[ 'hover-title-typography-content' ] }
                                onChange={ ( val ) => handleTextUpdate( 'hover-title-typography-content', val ) }
                            />
                            <ToggleSwitch
                                label={ __( 'Custom hover text', 'maxi-blocks' ) }
                                selected={
                                    props[ 'hover-title-typography-status-hover' ] ??
                                    props[ 'hover-title-typography-status' ]
                                }
                                onChange={ ( val ) =>
                                    onChange( {
                                        'hover-title-typography-status': val,
                                        'hover-title-typography-status-hover': val,
                                    } )
                                }
                            />
                            { ( props[ 'hover-title-typography-status-hover' ] ??
                                props[ 'hover-title-typography-status' ] ) && (
                                <MemoizedTypography
                                    groupName="hoverTitleTypography"
                                    attrPrefix="hover-title-"
                                    textLevel="h4"
                                    props={ props }
                                    onChange={ onChange }
                                    onChangeInline={ onChangeInline }
                                    blockStyle={ blockStyle }
                                    clientId={ clientId }
                                />
                            ) }

                            <hr /> {/* Visual separator between title and content sections */}

                            {/* --------------------------------------------------------
                                Hover Content Section
                                - Textarea for content/description
                                - Toggle to enable custom typography
                                - Typography controls (when enabled)
                                -------------------------------------------------------- */}
                            <DebouncedTextareaControl
                                placeholder={ __( 'Add hover content text here', 'maxi-blocks' ) }
                                value={ props[ 'hover-content-typography-content' ] }
                                onChange={ ( val ) => handleTextUpdate( 'hover-content-typography-content', val ) }
                            />
                            <ToggleSwitch
                                label={ __( 'Custom content text', 'maxi-blocks' ) }
                                selected={
                                    props[ 'hover-content-typography-status-hover' ] ??
                                    props[ 'hover-content-typography-status' ]
                                }
                                onChange={ ( val ) =>
                                    onChange( {
                                        'hover-content-typography-status': val,
                                        'hover-content-typography-status-hover': val,
                                    } )
                                }
                            />
                            { ( props[ 'hover-content-typography-status-hover' ] ??
                                props[ 'hover-content-typography-status' ] ) && (
                                <MemoizedTypography
                                    groupName="hoverContentTypography"
                                    attrPrefix="hover-content-"
                                    textLevel="p"
                                    props={ props }
                                    onChange={ onChange }
                                    onChangeInline={ onChangeInline }
                                    blockStyle={ blockStyle }
                                    clientId={ clientId }
                                />
                            ) }

                            <hr /> {/* Visual separator before decoration section */}

                            {/* --------------------------------------------------------
                                Background & Decoration Section
                                - Background color/gradient
                                - Border (optional)
                                - Padding (optional)
                                - Margin (optional)
                                -------------------------------------------------------- */}
                            <MemoizedDecoration
                                props={ props }
                                clientId={ clientId }
                                onChange={ onChange }
                                onChangeInline={ onChangeInline }
                                breakpoint={ breakpoint }
                            />
                        </>
                    ) }
                </>
            ) }
        </div>
    );
};

export default HoverEffectControl;