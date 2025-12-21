/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import AxisControl from '@components/axis-control';
import BackgroundControl from '@components/background-control';
import BorderControl from '@components/border-control';
import Icon from '@components/icon';
import SelectControl from '@components/select-control';
import SettingTabsControl from '@components/setting-tabs-control';
import TextareaControl from '@components/textarea-control';
import ToggleSwitch from '@components/toggle-switch';
import TypographyControl from '@components/typography-control';

import BezierEditor from 'bezier-easing-editor';

import { getDefaultAttribute, getGroupAttributes } from '@extensions/styles';

/**
 * Styles and icons
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
 * Component
 */
const HoverEffectControl = ( props ) => {
	const {
		className,
		onChangeInline,
		onChange,
		blockStyle,
		clientId,
		breakpoint,
	} = props;

	const classes = classnames( 'maxi-hover-effect-control', className );

	const handleHoverTitleChange = useCallback(
		( val ) =>
			onChange( {
				'hover-title-typography-content': isNil( val )
					? getDefaultAttribute( 'hover-title-typography-content' )
					: val,
			} ),
		[ onChange ]
	);

	const handleHoverContentChange = useCallback(
		( val ) =>
			onChange( {
				'hover-content-typography-content': isNil( val )
					? getDefaultAttribute( 'hover-content-typography-content' )
					: val,
			} ),
		[ onChange ]
	);

	const setEffectNone = () => {
		onChange( {
			'hover-type': 'none',
		} );
		document
			.querySelector( `#block-${ clientId } .maxi-image-block__image` )
			?.removeAttribute( 'style' );
	};

	const disablePreview = () => {
		onChange( {
			'hover-preview': false,
		} );
		document
			.querySelector( `#block-${ clientId } .maxi-image-block__image` )
			?.removeAttribute( 'style' );
	};

	return (
		<div className={ classes }>
			<SettingTabsControl
				className="maxi-hover-effect-control__tabs"
				label={ __( 'Hover animation', 'maxi-blocks' ) }
				type="buttons"
				selected={ props[ 'hover-type' ] }
				items={ [
					{ icon: <Icon icon={ hoverNone } />, value: 'none' },
					{ icon: <Icon icon={ hoverBasic } />, value: 'basic' },
					{ icon: <Icon icon={ hoverText } />, value: 'text' },
				] }
				onChange={ ( val ) => {
					if ( val === 'none' ) {
						setEffectNone();
					} else {
						onChange( {
							'hover-type': val,
							'hover-transition-duration': 0.5,
						} );
					}
				} }
				hasBorder
			/>
			{ props[ 'hover-type' ] !== 'none' && (
				<>
					<ToggleSwitch
						label={ __( 'Show hover preview', 'maxi-blocks' ) }
						selected={ props[ 'hover-preview' ] }
						onChange={ ( val ) =>
							! val ? disablePreview() : onChange( { 'hover-preview': val } )
						}
					/>
					<ToggleSwitch
						label={ __( 'Extend outside boundary', 'maxi-blocks' ) }
						selected={ props[ 'hover-extension' ] }
						onChange={ ( val ) =>
							onChange( {
								'hover-extension': val,
							} )
						}
					/>
					{ ( props[ 'hover-type' ] === 'text' ||
						[
							'zoom-in',
							'zoom-out',
							'slide',
							'rotate',
							'blur',
							'sepia',
							'clear-sepia',
							'grey-scale',
							'clear-grey-scale',
						].includes( props[ 'hover-basic-effect-type' ] ) ) && (
						<>
							<AdvancedNumberControl
								label={ __( 'Duration(s)', 'maxi-blocks' ) }
								value={ props[ 'hover-transition-duration' ] }
								min={ 0 }
								step={ 0.1 }
								max={ 10 }
								initialPosition={ getDefaultAttribute(
									'hover-transition-duration'
								) }
								onChangeValue={ ( val ) =>
									onChange( {
										'hover-transition-duration':
											! isNil( val ) && val !== '' ? val : '',
									} )
								}
								onReset={ () =>
									onChange( {
										'hover-transition-duration': getDefaultAttribute(
											'hover-transition-duration'
										),
										isReset: true,
									} )
								}
							/>
							<SelectControl
								__nextHasNoMarginBottom
								label={ __( 'Easing', 'maxi-blocks' ) }
								value={ props[ 'hover-transition-easing' ] }
								defaultValue={ getDefaultAttribute(
									'hover-transition-easing'
								) }
								options={ [
									{ label: __( 'Ease', 'maxi-blocks' ), value: 'ease' },
									{ label: __( 'Linear', 'maxi-blocks' ), value: 'linear' },
									{ label: __( 'Ease-in', 'maxi-blocks' ), value: 'ease-in' },
									{ label: __( 'Ease-out', 'maxi-blocks' ), value: 'ease-out' },
									{ label: __( 'Ease-in-out', 'maxi-blocks' ), value: 'ease-in-out' },
									{ label: __( 'Cubic-bezier', 'maxi-blocks' ), value: 'cubic-bezier' },
								] }
								onChange={ ( val ) =>
									onChange( { 'hover-transition-easing': val } )
								}
								onReset={ () =>
									onChange( {
										'hover-transition-easing': getDefaultAttribute(
											'hover-transition-easing'
										),
										isReset: true,
									} )
								}
							/>
							{ props[ 'hover-transition-easing' ] === 'cubic-bezier' && (
								<BezierEditor
									value={ props[ 'hover-transition-easing-cubic-bezier' ] }
									onChange={ ( val ) =>
										onChange( {
											'hover-transition-easing-cubic-bezier': val,
										} )
									}
								/>
							) }
						</>
					) }
					{ props[ 'hover-type' ] === 'basic' && (
						<>
							<SelectControl
								__nextHasNoMarginBottom
								label={ __( 'Effect type', 'maxi-blocks' ) }
								value={ props[ 'hover-basic-effect-type' ] }
								defaultValue={ getDefaultAttribute( 'hover-basic-effect-type' ) }
								options={ [
									{ label: __( 'Zoom in', 'maxi-blocks' ), value: 'zoom-in' },
									{ label: __( 'Zoom out', 'maxi-blocks' ), value: 'zoom-out' },
									{ label: __( 'Slide', 'maxi-blocks' ), value: 'slide' },
									{ label: __( 'Rotate', 'maxi-blocks' ), value: 'rotate' },
									{ label: __( 'Flashing', 'maxi-blocks' ), value: 'flashing' },
									{ label: __( 'Blur', 'maxi-blocks' ), value: 'blur' },
									{ label: __( 'Sepia', 'maxi-blocks' ), value: 'sepia' },
									{ label: __( 'Clear sepia', 'maxi-blocks' ), value: 'clear-sepia' },
									{ label: __( 'Gray scale', 'maxi-blocks' ), value: 'grey-scale' },
									{ label: __( 'Clear gray scale', 'maxi-blocks' ), value: 'clear-grey-scale' },
									{ label: __( 'Shine', 'maxi-blocks' ), value: 'shine' },
									{ label: __( 'Circle shine', 'maxi-blocks' ), value: 'circle-shine' },
								] }
								onChange={ ( val ) =>
									onChange( { 'hover-basic-effect-type': val } )
								}
								onReset={ () =>
									onChange( {
										'hover-basic-effect-type': getDefaultAttribute(
											'hover-basic-effect-type'
										),
										isReset: true,
									} )
								}
							/>
							{ [ 'zoom-in', 'zoom-out', 'rotate', 'blur', 'slide' ].includes(
								props[ 'hover-basic-effect-type' ]
							) && (
								<AdvancedNumberControl
									label={ __( 'Amount', 'maxi-blocks' ) }
									value={
										props[
											`hover-basic-${ props[ 'hover-basic-effect-type' ] }-value`
										]
									}
									min={ 0 }
									step={ 0.1 }
									max={ 100 }
									initialPosition={ getDefaultAttribute(
										`hover-basic-${ props[ 'hover-basic-effect-type' ] }-value`
									) }
									onChangeValue={ ( val ) =>
										onChange( {
											[ `hover-basic-${ props[ 'hover-basic-effect-type' ] }-value` ]:
												! isNil( val ) && val !== '' ? val : '',
										} )
									}
									onReset={ () =>
										onChange( {
											[ `hover-basic-${ props[ 'hover-basic-effect-type' ] }-value` ]:
												getDefaultAttribute(
													`hover-basic-${ props[ 'hover-basic-effect-type' ] }-value`
												),
											isReset: true,
										} )
									}
								/>
							) }
						</>
					) }
					{ props[ 'hover-type' ] === 'text' && (
						<>
							<SelectControl
								__nextHasNoMarginBottom
								label={ __( 'Animation type', 'maxi-blocks' ) }
								value={ props[ 'hover-text-effect-type' ] }
								defaultValue={ getDefaultAttribute( 'hover-text-effect-type' ) }
								options={ [
									{ label: __( 'Fade', 'maxi-blocks' ), value: 'fade' },
									{ label: __( 'Push up', 'maxi-blocks' ), value: 'push-up' },
									{ label: __( 'Push right', 'maxi-blocks' ), value: 'push-right' },
									{ label: __( 'Push down', 'maxi-blocks' ), value: 'push-down' },
									{ label: __( 'Push left', 'maxi-blocks' ), value: 'push-left' },
									{ label: __( 'Slide up', 'maxi-blocks' ), value: 'slide-up' },
									{ label: __( 'Slide right', 'maxi-blocks' ), value: 'slide-right' },
									{ label: __( 'Slide down', 'maxi-blocks' ), value: 'slide-down' },
									{ label: __( 'Slide left', 'maxi-blocks' ), value: 'slide-left' },
									{ label: __( 'Flip horizontal', 'maxi-blocks' ), value: 'flip-horiz' },
								] }
								onChange={ ( val ) =>
									onChange( { 'hover-text-effect-type': val } )
								}
								onReset={ () =>
									onChange( {
										'hover-text-effect-type': getDefaultAttribute(
											'hover-text-effect-type'
										),
										isReset: true,
									} )
								}
							/>
							<SettingTabsControl
								type="buttons"
								fullWidthMode
								target="hover-text-preset"
								selected={ props[ 'hover-text-preset' ] }
								items={ [
									{ icon: <Icon icon={ alignLeftTop } />, value: 'left-top' },
									{ icon: <Icon icon={ alignRightTop } />, value: 'right-top' },
									{ icon: <Icon icon={ alignCenterCenter } />, value: 'center-center' },
									{ icon: <Icon icon={ alignLeftBottom } />, value: 'left-bottom' },
									{ icon: <Icon icon={ alignRightBottom } />, value: 'right-bottom' },
								] }
								onChange={ ( val ) => onChange( { 'hover-text-preset': val } ) }
							/>
							<TextareaControl
								placeholder={ __( 'Add hover title text here', 'maxi-blocks' ) }
								value={ props[ 'hover-title-typography-content' ] }
								onChange={ handleHoverTitleChange }
							/>
							<ToggleSwitch
								label={ __( 'Custom hover text', 'maxi-blocks' ) }
								selected={ props[ 'hover-title-typography-status' ] }
								onChange={ ( val ) =>
									onChange( { 'hover-title-typography-status': val } )
								}
							/>
							{ props[ 'hover-title-typography-status' ] && (
								<TypographyControl
									typography={ {
										...getGroupAttributes( props, 'hoverTitleTypography' ),
									} }
									hideAlignment
									onChangeInline={ onChangeInline }
									onChange={ onChange }
									prefix="hover-title-"
									disableCustomFormats
									showBottomGap
									blockStyle={ blockStyle }
									clientId={ clientId }
									tabsClassName="mb-hover-bg"
									globalProps={ { target: '', type: 'h4' } }
									textLevel="h4"
									inlineTarget="maxi-hover-details__content h4"
								/>
							) }
							<hr />
							<TextareaControl
								placeholder={ __( 'Add hover content text here', 'maxi-blocks' ) }
								value={ props[ 'hover-content-typography-content' ] }
								onChange={ handleHoverContentChange }
							/>
							<ToggleSwitch
								label={ __( 'Custom content text', 'maxi-blocks' ) }
								selected={ props[ 'hover-content-typography-status' ] }
								onChange={ ( val ) =>
									onChange( { 'hover-content-typography-status': val } )
								}
							/>
							{ props[ 'hover-content-typography-status' ] && (
								<TypographyControl
									typography={ {
										...getGroupAttributes( props, 'hoverContentTypography' ),
									} }
									hideAlignment
									onChange={ onChange }
									prefix="hover-content-"
									disableCustomFormats
									blockStyle={ blockStyle }
									clientId={ clientId }
									globalProps={ { target: '', type: 'p' } }
									textLevel="p"
									inlineTarget="maxi-hover-details__content p"
								/>
							) }
						</>
					) }
					<hr />
					<BackgroundControl
						{ ...getGroupAttributes( props, [
							'hoverBackground',
							'hoverBackgroundColor',
							'hoverBackgroundGradient',
						] ) }
						onChangeInline={ ( obj ) =>
							onChangeInline( obj, '.maxi-hover-details__content' )
						}
						onChange={ onChange }
						disableClipPath
						disableImage
						disableVideo
						disableSVG
						prefix="hover-"
						clientId={ clientId }
						tabsClassName="mb-hover-bg"
						breakpoint={ breakpoint }
					/>
					<ToggleSwitch
						label={ __( 'Custom border', 'maxi-blocks' ) }
						selected={ props[ 'hover-border-status' ] }
						onChange={ ( val ) => onChange( { 'hover-border-status': val } ) }
					/>
					{ props[ 'hover-border-status' ] && (
						<BorderControl
							{ ...getGroupAttributes( props, [
								'hoverBorder',
								'hoverBorderWidth',
								'hoverBorderRadius',
							] ) }
							onChangeInline={ ( obj ) =>
								onChangeInline( obj, '.maxi-hover-details__content' )
							}
							onChange={ onChange }
							prefix="hover-"
							disablePalette
							clientId={ clientId }
							breakpoint={ breakpoint }
						/>
					) }
					<ToggleSwitch
						label={ __( 'Custom padding', 'maxi-blocks' ) }
						selected={ props[ 'hover-padding-status' ] }
						onChange={ ( val ) => onChange( { 'hover-padding-status': val } ) }
					/>
					{ props[ 'hover-padding-status' ] && (
						<AxisControl
							{ ...getGroupAttributes( props, 'padding', false, 'hover-' ) }
							label={ __( 'Padding', 'maxi-blocks' ) }
							onChange={ onChange }
							target="padding"
							prefix="hover-"
							breakpoint={ breakpoint }
							optionType="string"
							disableAuto
							enableAxisUnits
						/>
					) }
					<ToggleSwitch
						label={ __( 'Custom margin', 'maxi-blocks' ) }
						selected={ props[ 'hover-margin-status' ] }
						onChange={ ( val ) => onChange( { 'hover-margin-status': val } ) }
					/>
					{ props[ 'hover-margin-status' ] && (
						<AxisControl
							{ ...getGroupAttributes( props, 'margin', false, 'hover-' ) }
							label={ __( 'Margin', 'maxi-blocks' ) }
							onChange={ onChange }
							target="margin"
							prefix="hover-"
							optionType="string"
							breakpoint={ breakpoint }
							enableAxisUnits
						/>
					) }
				</>
			) }
		</div>
	);
};

export default HoverEffectControl;