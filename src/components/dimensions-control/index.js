/**
 * External dependencies
 */
import classnames from 'classnames';
import map from 'lodash/map';

/**
 * Internal dependencies
 */
import icons from './icons';
import './styles/editor.scss';
import DimensionsSelect from './dimensions-select';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { withInstanceId } from '@wordpress/compose';
import { dispatch } from '@wordpress/data';
import { Component, Fragment } from '@wordpress/element';
import { ButtonGroup, BaseControl, Button, Tooltip, TabPanel } from '@wordpress/components';

class DimensionsControl extends Component {
	constructor( props ) {
		super( ...arguments );
		this.onChangeTop = this.onChangeTop.bind( this );
		this.onChangeRight = this.onChangeRight.bind( this );
		this.onChangeBottom = this.onChangeBottom.bind( this );
		this.onChangeLeft = this.onChangeLeft.bind( this );
		this.onChangeAll = this.onChangeAll.bind( this );
		this.onChangeUnits = this.onChangeUnits.bind( this );
		this.onChangeSize = this.onChangeSize.bind( this );
		this.syncUnits = this.syncUnits.bind( this );
		this.saveMeta = this.saveMeta.bind( this );
	}

	onChangeTop( value, device ) {
		if ( this.props.type === 'padding' ) {
			this.props.setAttributes( { [ 'paddingTop' + device ]: value } );
		} else if ( this.props.type === 'margin' ) {
			this.props.setAttributes( { [ 'marginTop' + device ]: value } );
		} else if ( this.props.type === 'borderRadius' ) {
			this.props.setAttributes( { [ 'borderRadiusTopLeft' + device ]: value } );
		} else if ( this.props.type === 'borderWidth' ) {
			this.props.setAttributes( { [ 'borderWidthTop' + device ]: value } );
		}
		this.saveMeta();
	}

	onChangeRight( value, device ) {
		if ( this.props.type === 'padding' ) {
			this.props.setAttributes( { [ 'paddingRight' + device ]: value } );
		} else if ( this.props.type === 'margin' ){
			this.props.setAttributes( { [ 'marginRight' + device ]: value } );
		} else if ( this.props.type === 'borderRadius' ) {
			this.props.setAttributes( { [ 'borderRadiusTopRight' + device ]: value } );
		} else if ( this.props.type === 'borderWidth' ) {
			this.props.setAttributes( { [ 'borderWidthRight' + device ]: value } );
		}
		this.saveMeta();
	}

	onChangeBottom( value, device ) {
		if ( this.props.type === 'padding' ) {
			this.props.setAttributes( { [ 'paddingBottom' + device ]: value } );
		} else if ( this.props.type === 'margin' ){
			this.props.setAttributes( { [ 'marginBottom' + device ]: value } );
		} else if ( this.props.type === 'borderRadius' ) {
			this.props.setAttributes( { [ 'borderRadiusBottomRight' + device ]: value } );
		} else if ( this.props.type === 'borderWidth' ) {
			this.props.setAttributes( { [ 'borderWidthBottom' + device ]: value } );
		}
		this.saveMeta();
	}

	onChangeLeft( value, device ) {
		if ( this.props.type === 'padding' ) {
			this.props.setAttributes( { [ 'paddingLeft' + device ]: value } );
		} else if ( this.props.type === 'margin' ){
			this.props.setAttributes( { [ 'marginLeft' + device ]: value } );
		} else if ( this.props.type === 'borderRadius' ) {
			this.props.setAttributes( { [ 'borderRadiusBottomLeft' + device ]: value } );
		} else if ( this.props.type === 'borderWidth' ) {
			this.props.setAttributes( { [ 'borderWidthLeft' + device ]: value } );
		}
		this.saveMeta();
	}

	onChangeAll( value, device ) {
		if ( this.props.type === 'padding' ) {
			this.props.setAttributes( { [ 'paddingTop' + device ]: value, [ 'paddingRight' + device ]: value, [ 'paddingBottom' + device ]: value, [ 'paddingLeft' + device ]: value } );
		} else if ( this.props.type === 'margin' ){
			this.props.setAttributes( { [ 'marginTop' + device ]: value, [ 'marginRight' + device ]: value, [ 'marginBottom' + device ]: value, [ 'marginLeft' + device ]: value } );
		} else if ( this.props.type === 'borderRadius' ) {
			this.props.setAttributes( { [ 'borderRadiusTopLeft' + device ]: value, [ 'borderRadiusTopRight' + device ]: value, [ 'borderRadiusBottomRight' + device ]: value, [ 'borderRadiusBottomLeft' + device ]: value } );
		} else if ( this.props.type === 'borderWidth' ) {
			this.props.setAttributes( { [ 'borderWidthTop' + device ]: value, [ 'borderWidthRight' + device ]: value, [ 'borderWidthBottom' + device ]: value, [ 'borderWidthLeft' + device ]: value } );
		}
		this.saveMeta();
	}

	onChangeUnits( value ) {
		if ( this.props.type === 'padding' ) {
			this.props.setAttributes( { paddingUnit: value } );
		} else if ( this.props.type === 'margin' ){
			this.props.setAttributes( { marginUnit: value } );
		} else if ( this.props.type === 'borderRadius' ) {
			this.props.setAttributes( { borderRadiusUnit: value } );
		} else if ( this.props.type === 'borderWidth' ) {
			this.props.setAttributes( { borderWidthUnit: value } );
		}
		this.saveMeta();
	}

	onChangeSize( value, size ) {

		if ( this.props.type === 'padding' ) {
			this.props.setAttributes( { paddingSyncUnits: true } );
			this.props.setAttributes( { paddingSize: value } );
			if ( size ) {
				if ( size < 0 ) {
					size = '';
				}
				this.props.setAttributes( { paddingTop: size, paddingRight: size, paddingBottom: size, paddingLeft: size, paddingUnit: 'px' } );
			}
		} else if ( this.props.type === 'margin' ){
			this.props.setAttributes( { marginSize: value } );
			if ( size ) {
				if ( size < 0 ) {
					size = '';
				}
				this.props.setAttributes( { marginTop: size, marginRight: 0, marginBottom: size, marginLeft: 0, marginUnit: 'px' } );
			}
		} else if ( this.props.type === 'borderRadius' ) {
			this.props.setAttributes( { borderRadiusSyncUnits: true } );
			this.props.setAttributes( { borderRadiusSize: value } );
			if ( size ) {
				if ( size < 0 ) {
					size = '';
				}
				this.props.setAttributes( { borderRadiusTopLeft: size, borderRadiusTopRight: size, borderRadiusBottomLeft: size, borderRadiusBottomLeft: size, borderRadiusUnit: 'px' } );
			}
		}

		this.saveMeta();
	}

	syncUnits( value, device ) {
		const numbers = [ this.props[ 'valueTop' + device ], this.props[ 'valueRight' + device ], this.props[ 'valueBottom' + device ], this.props[ 'valueLeft' + device ] ];

		const syncValue = Math.max.apply( null, numbers );

		if ( this.props.type === 'padding' ) {
			this.props.setAttributes( { [ 'paddingSyncUnits' + device ]: ! this.props[ 'syncUnits' + device ] } );
			this.props.setAttributes( { [ 'paddingTop' + device ]: syncValue, [ 'paddingRight' + device ]: syncValue, [ 'paddingBottom' + device ]: syncValue, [ 'paddingLeft' + device ]: syncValue } );
		} else if ( this.props.type === 'margin' ){
			this.props.setAttributes( { [ 'marginSyncUnits' + device ]: ! this.props[ 'syncUnits' + device ] } );
			this.props.setAttributes( { [ 'marginTop' + device ]: syncValue, [ 'marginRight' + device ]: syncValue, [ 'marginBottom' + device ]: syncValue, [ 'marginLeft' + device ]: syncValue } );
		} else if ( this.props.type === 'borderRadius' ) {
			this.props.setAttributes( { [ 'borderRadiusSyncUnits' + device ]: ! this.props[ 'syncUnits' + device ] } );
			this.props.setAttributes( { [ 'borderRadiusTopLeft' + device ]: syncValue, [ 'borderRadiusTopRight' + device ]: syncValue, [ 'borderRadiusBottomRight' + device ]: syncValue, [ 'borderRadiusBottomLeft' + device ]: syncValue } );
		} else if ( this.props.type === 'borderWidth' ) {
			this.props.setAttributes( { [ 'borderWidthSyncUnits' + device ]: ! this.props[ 'syncUnits' + device ] } );
			this.props.setAttributes( { [ 'borderWidthTop' + device ]: syncValue, [ 'borderWidthRight' + device ]: syncValue, [ 'borderWidthBottom' + device ]: syncValue, [ 'borderWidthLeft' + device ]: syncValue } );
		}

		this.saveMeta();
	}

	saveMeta() {
		const meta = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'meta' );
		const block = wp.data.select( 'core/block-editor' ).getBlock( this.props.clientId );
		let dimensions = {};
		if ( typeof this.props.attributes.gx !== 'undefined' && typeof this.props.attributes.gx.id !== 'undefined' ) {
			const id = this.props.name.split( '/' ).join( '-' ) + '-' + this.props.attributes.gx.id;
			const paddingUnit = block.attributes.paddingUnit;
			const marginUnit = block.attributes.marginUnit;
			const borderRadiusUnit = block.attributes.borderRadiusUnit;
			const padding = {
				paddingTop: ( typeof block.attributes.paddingTop !== 'undefined' ) ? block.attributes.paddingTop + paddingUnit : null,
				paddingRight: ( typeof block.attributes.paddingRight !== 'undefined' ) ? block.attributes.paddingRight + paddingUnit : null,
				paddingBottom: ( typeof block.attributes.paddingBottom !== 'undefined' ) ? block.attributes.paddingBottom + paddingUnit : null,
				paddingLeft: ( typeof block.attributes.paddingLeft !== 'undefined' ) ? block.attributes.paddingLeft + paddingUnit : null,
				paddingTopTablet: ( typeof block.attributes.paddingTopTablet !== 'undefined' ) ? block.attributes.paddingTopTablet + paddingUnit : null,
				paddingRightTablet: ( typeof block.attributes.paddingRightTablet !== 'undefined' ) ? block.attributes.paddingRightTablet + paddingUnit : null,
				paddingBottomTablet: ( typeof block.attributes.paddingBottomTablet !== 'undefined' ) ? block.attributes.paddingBottomTablet + paddingUnit : null,
				paddingLeftTablet: ( typeof block.attributes.paddingLeftTablet !== 'undefined' ) ? block.attributes.paddingLeftTablet + paddingUnit : null,
				paddingTopMobile: ( typeof block.attributes.paddingTopMobile !== 'undefined' ) ? block.attributes.paddingTopMobile + paddingUnit : null,
				paddingRightMobile: ( typeof block.attributes.paddingRightMobile !== 'undefined' ) ? block.attributes.paddingRightMobile + paddingUnit : null,
				paddingBottomMobile: ( typeof block.attributes.paddingBottomMobile !== 'undefined' ) ? block.attributes.paddingBottomMobile + paddingUnit : null,
				paddingLeftMobile: ( typeof block.attributes.paddingLeftMobile !== 'undefined' ) ? block.attributes.paddingLeftMobile + paddingUnit : null,
			};
			const margin = {
				marginTop: ( typeof block.attributes.marginTop !== 'undefined' ) ? block.attributes.marginTop + marginUnit : null,
				marginRight: ( typeof block.attributes.marginRight !== 'undefined' ) ? block.attributes.marginRight + marginUnit : null,
				marginBottom: ( typeof block.attributes.marginBottom !== 'undefined' ) ? block.attributes.marginBottom + marginUnit : null,
				marginLeft: ( typeof block.attributes.marginLeft !== 'undefined' ) ? block.attributes.marginLeft + marginUnit : null,
				marginTopTablet: ( typeof block.attributes.marginTopTablet !== 'undefined' ) ? block.attributes.marginTopTablet + marginUnit : null,
				marginRightTablet: ( typeof block.attributes.marginRightTablet !== 'undefined' ) ? block.attributes.marginRightTablet + marginUnit : null,
				marginBottomTablet: ( typeof block.attributes.marginBottomTablet !== 'undefined' ) ? block.attributes.marginBottomTablet + marginUnit : null,
				marginLeftTablet: ( typeof block.attributes.marginLeftTablet !== 'undefined' ) ? block.attributes.marginLeftTablet + marginUnit : null,
				marginTopMobile: ( typeof block.attributes.marginTopMobile !== 'undefined' ) ? block.attributes.marginTopMobile + marginUnit : null,
				marginRightMobile: ( typeof block.attributes.marginRightMobile !== 'undefined' ) ? block.attributes.marginRightMobile + marginUnit : null,
				marginBottomMobile: ( typeof block.attributes.marginBottomMobile !== 'undefined' ) ? block.attributes.marginBottomMobile + marginUnit : null,
				marginLeftMobile: ( typeof block.attributes.marginLeftMobile !== 'undefined' ) ? block.attributes.marginLeftMobile + marginUnit : null,
			};

			const borderRadius = {
				borderRadiusTopLeft: ( typeof block.attributes.borderRadiusTopLeft !== 'undefined' ) ? block.attributes.borderRadiusTopLeft + borderRadiusUnit : null,
				borderRadiusTopRight: ( typeof block.attributes.borderRadiusTopRight !== 'undefined' ) ? block.attributes.borderRadiusTopRight + borderRadiusUnit : null,
				borderRadiusBottomRight: ( typeof block.attributes.borderRadiusBottomRight !== 'undefined' ) ? block.attributes.borderRadiusBottomRight + borderRadiusUnit : null,
				borderRadiusBottomLeft: ( typeof block.attributes.borderRadiusBottomLeft !== 'undefined' ) ? block.attributes.borderRadiusBottomLeft + borderRadiusUnit : null,
				borderRadiusTopLeftTablet: ( typeof block.attributes.borderRadiusTopLeftTablet !== 'undefined' ) ? block.attributes.borderRadiusTopLeftTablet + borderRadiusUnit : null,
				borderRadiusTopRightTablet: ( typeof block.attributes.borderRadiusTopRightTablet !== 'undefined' ) ? block.attributes.borderRadiusTopRightTablet + borderRadiusUnit : null,
				borderRadiusBottomRightTablet: ( typeof block.attributes.borderRadiusBottomRightTablet !== 'undefined' ) ? block.attributes.borderRadiusBottomRightTablet + borderRadiusUnit : null,
				borderRadiusBottomLeftTablet: ( typeof block.attributes.borderRadiusBottomLeftTablet !== 'undefined' ) ? block.attributes.borderRadiusBottomLeftTablet + borderRadiusUnit : null,
				borderRadiusTopLeftMobile: ( typeof block.attributes.borderRadiusTopLeftMobile !== 'undefined' ) ? block.attributes.borderRadiusTopLeftMobile + borderRadiusUnit : null,
				borderRadiusTopRightMobile: ( typeof block.attributes.borderRadiusTopRightMobile !== 'undefined' ) ? block.attributes.borderRadiusTopRightMobile + borderRadiusUnit : null,
				borderRadiusBottomRightMobile: ( typeof block.attributes.borderRadiusBottomRightMobile !== 'undefined' ) ? block.attributes.borderRadiusBottomRightMobile + borderRadiusUnit : null,
				borderRadiusBottomLeftMobile: ( typeof block.attributes.borderRadiusBottomLeftMobile !== 'undefined' ) ? block.attributes.borderRadiusBottomLeftMobile + borderRadiusUnit : null,
			};

			const borderWidth = {
				borderWidthTop: ( typeof block.attributes.borderWidthTop !== 'undefined' ) ? block.attributes.borderWidthTop + borderWidthUnit : null,
				borderWidthRight: ( typeof block.attributes.borderWidthRight !== 'undefined' ) ? block.attributes.borderWidthRight + borderWidthUnit : null,
				borderWidthBottom: ( typeof block.attributes.borderWidthBottom !== 'undefined' ) ? block.attributes.borderWidthBottom + borderWidthUnit : null,
				borderWidthLeft: ( typeof block.attributes.borderWidthLeft !== 'undefined' ) ? block.attributes.borderWidthLeft + borderWidthUnit : null,
				borderWidthTopTablet: ( typeof block.attributes.borderWidthTopTablet !== 'undefined' ) ? block.attributes.borderWidthTopTablet + borderWidthUnit : null,
				borderWidthRightTablet: ( typeof block.attributes.borderWidthRightTablet !== 'undefined' ) ? block.attributes.borderWidthRightTablet + borderWidthUnit : null,
				borderWidthBottomTablet: ( typeof block.attributes.borderWidthBottomTablet !== 'undefined' ) ? block.attributes.borderWidthBottomTablet + borderWidthUnit : null,
				borderWidthLeftTablet: ( typeof block.attributes.borderWidthLeftTablet !== 'undefined' ) ? block.attributes.borderWidthLeftTablet + borderWidthUnit : null,
				borderWidthTopMobile: ( typeof block.attributes.borderWidthTopMobile !== 'undefined' ) ? block.attributes.borderWidthTopMobile + borderWidthUnit : null,
				borderWidthRightMobile: ( typeof block.attributes.borderWidthRightMobile !== 'undefined' ) ? block.attributes.borderWidthRightMobile + borderWidthUnit : null,
				borderWidthBottomMobile: ( typeof block.attributes.borderWidthBottomMobile !== 'undefined' ) ? block.attributes.borderWidthBottomMobile + borderWidthUnit : null,
				borderWidthLeftMobile: ( typeof block.attributes.borderWidthLeftMobile !== 'undefined' ) ? block.attributes.borderWidthLeftMobile + borderWidthUnit : null,
			};

			if ( typeof meta === 'undefined' || typeof meta._gx_dimensions === 'undefined' || ( typeof meta._gx_dimensions !== 'undefined' && meta._gx_dimensions === '' ) ) {
				dimensions = {};
			} else {
				dimensions = JSON.parse( meta._gx_dimensions );
			}

			if ( typeof dimensions[ id ] === 'undefined' ) {
				dimensions[ id ] = {};
				dimensions[ id ][ this.props.type ] = {};
			} else {
				if ( typeof dimensions[ id ][ this.props.type ] === 'undefined' ) {
					dimensions[ id ][ this.props.type ] = {};
				}
			}

			if ( this.props.dimensionSize === 'advanced' ) {
				switch ( this.props.type ) {
					case 'padding':
						dimensions[ id ][ this.props.type ] = padding;
					case 'margin':
						dimensions[ id ][ this.props.type ] = margin;
					case 'borderRadius':
						dimensions[ id ][ this.props.type ] = borderRadius;
					case 'borderWidth':
						dimensions[ id ][ this.props.type ] = borderWidth;
					default: dimensions[ id ][ this.props.type ] = undefined;
				}
			}
			// Save values to metadata.
			wp.data.dispatch( 'core/editor' ).editPost( {
				meta: {
					_gx_dimensions: JSON.stringify( dimensions ),
				},
			} );

			//add CSS to head
			const head = document.head || document.getElementsByTagName( 'head' )[ 0 ];
			const style = document.createElement( 'style' );
			let responsiveCss = '';
			style.type = 'text/css';

			//add responsive styling for tablet device
			responsiveCss += '@media only screen and (max-width: 768px) {';
			responsiveCss += '.' + id + ' > div{';
			if ( typeof padding.paddingTopTablet !== 'undefined' ) {
				responsiveCss += 'padding-top: ' + padding.paddingTopTablet + ' !important;';
			}
			if ( typeof padding.paddingBottomTablet !== 'undefined' ) {
				responsiveCss += 'padding-bottom: ' + padding.paddingBottomTablet + ' !important;';
			}
			if ( typeof padding.paddingRightTablet !== 'undefined' ) {
				responsiveCss += 'padding-right: ' + padding.paddingRightTablet + ' !important;';
			}
			if ( typeof padding.paddingLeftTablet !== 'undefined' ) {
				responsiveCss += 'padding-left: ' + padding.paddingLeftTablet + ' !important;';
			}

			if ( typeof margin.marginTopTablet !== 'undefined' ) {
				responsiveCss += 'margin-top: ' + margin.marginTopTablet + ' !important;';
			}
			if ( typeof margin.marginBottomTablet !== 'undefined' ) {
				responsiveCss += 'margin-bottom: ' + margin.marginBottomTablet + ' !important;';
			}
			if ( typeof margin.marginRightTablet !== 'undefined' ) {
				responsiveCss += 'margin-right: ' + margin.marginRightTablet + ' !important;';
			}
			if ( typeof margin.marginleLtTablet !== 'undefined' ) {
				responsiveCss += 'margin-left: ' + margin.marginLeftTablet + ' !important;';
			}
			if ( typeof borderRadius.borderRadiusTopLeftTablet !== 'undefined' ) {
				responsiveCss += 'border-top-left-radius: ' + borderRadius.borderRadiusTopLeftTablet + ' !important;';
			}
			if ( typeof borderRadius.borderRadiusTopRightTablet !== 'undefined' ) {
				responsiveCss += 'border-top-right-radius: ' + borderRadius.borderRadiusTopRightTablet + ' !important;';
			}
			if ( typeof borderRadius.borderRadiusBottomRightTablet !== 'undefined' ) {
				responsiveCss += 'border-bottom-right-radius: ' + borderRadius.borderRadiusBottomRightTablet + ' !important;';
			}
			if ( typeof borderRadius.borderRadiusBottomLeftTablet !== 'undefined' ) {
				responsiveCss += 'border-bottom-left-radius: ' + borderRadius.borderRadiusBottomLeftTablet + ' !important;';
			}
			if ( typeof borderWidth.borderWidthTopTablet !== 'undefined' ) {
				responsiveCss += 'border-top-width: ' + borderWidth.borderWidthTopTablet + ' !important;';
			}
			if ( typeof borderWidth.borderWidthRightTablet !== 'undefined' ) {
				responsiveCss += 'border-right-width: ' + borderWidth.borderWidthRightTablet + ' !important;';
			}
			if ( typeof borderWidth.borderWidthBottomTablet !== 'undefined' ) {
				responsiveCss += 'border-bottom-width: ' + borderWidth.borderWidthBottomTablet + ' !important;';
			}
			if ( typeof borderWidth.borderWidthLeftTablet !== 'undefined' ) {
				responsiveCss += 'border-left-width: ' + borderWidth.borderWidthLeftTablet + ' !important;';
			}

			responsiveCss += '}';
			responsiveCss += '}';

			responsiveCss += '@media only screen and (max-width: 514px) {';
			responsiveCss += '.' + id + ' > div{';
			if ( typeof padding.paddingTopMobile !== 'undefined' ) {
				responsiveCss += 'padding-top: ' + padding.paddingTopMobile + ' !important;';
			}
			if ( typeof padding.paddingBottomMobile !== 'undefined' ) {
				responsiveCss += 'padding-bottom: ' + padding.paddingBottomMobile + ' !important;';
			}
			if ( typeof padding.paddingRightMobile !== 'undefined' ) {
				responsiveCss += 'padding-right: ' + padding.paddingRightMobile + ' !important;';
			}
			if ( typeof padding.paddingLeftMobile !== 'undefined' ) {
				responsiveCss += 'padding-left: ' + padding.paddingLeftMobile + ' !important;';
			}
			if ( typeof margin.marginTopMobile !== 'undefined' ) {
				responsiveCss += 'margin-top: ' + margin.marginTopMobile + ' !important;';
			}
			if ( typeof margin.marginBottomMobile !== 'undefined' ) {
				responsiveCss += 'margin-bottom: ' + margin.marginBottomMobile + ' !important;';
			}
			if ( typeof margin.marginRightMobile !== 'undefined' ) {
				responsiveCss += 'margin-right: ' + margin.marginRightMobile + ' !important;';
			}
			if ( typeof margin.marginleLtMobile !== 'undefined' ) {
				responsiveCss += 'margin-left: ' + margin.marginLeftMobile + ' !important;';
			}
			if ( typeof borderRadius.borderRadiusTopLeftMobile !== 'undefined' ) {
				responsiveCss += 'border-top-left-radius: ' + borderRadius.borderRadiusTopLeftMobile + ' !important;';
			}
			if ( typeof borderRadius.borderRadiusTopRightMobile !== 'undefined' ) {
				responsiveCss += 'border-top-right-radius: ' + borderRadius.borderRadiusTopRightMobile + ' !important;';
			}
			if ( typeof borderRadius.borderRadiusBottomRightMobile !== 'undefined' ) {
				responsiveCss += 'border-bottom-right-radius: ' + borderRadius.borderRadiusBottomRightMobile + ' !important;';
			}
			if ( typeof borderRadius.borderRadiusBottomLeftMobile !== 'undefined' ) {
				responsiveCss += 'border-bottom-left-radius: ' + borderRadius.borderRadiusBottomLeftMobile + ' !important;';
			}
			if ( typeof borderWidth.borderWidthTopMobile !== 'undefined' ) {
				responsiveCss += 'border-top-width: ' + borderWidth.borderWidthTopMobile + ' !important;';
			}
			if ( typeof borderWidth.borderWidthBottomMobile !== 'undefined' ) {
				responsiveCss += 'border-bottom-width: ' + borderWidth.borderWidthBottomMobile + ' !important;';
			}
			if ( typeof borderWidth.borderWidthRightMobile !== 'undefined' ) {
				responsiveCss += 'border-right-width: ' + borderWidth.borderWidthRightMobile + ' !important;';
			}
			if ( typeof borderWidth.borderWidthleLtMobile !== 'undefined' ) {
				responsiveCss += 'border-left-width: ' + borderWidth.borderWidthLeftMobile + ' !important;';
			}

			responsiveCss += '}';
			responsiveCss += '}';

			if ( style.styleSheet ) {
				style.styleSheet.cssText = responsiveCss;
			} else {
				style.appendChild( document.createTextNode( responsiveCss ) );
			}

			head.appendChild( style );
		}
	}

	render() {
		const {
			help,
			instanceId,
			label = __( 'Margin', 'gx' ),
			type = 'margin',
			unit,
			valueBottom,
			valueLeft,
			valueRight,
			valueTop,
			valueBottomTablet,
			valueLeftTablet,
			valueRightTablet,
			valueTopTablet,
			valueBottomMobile,
			valueLeftMobile,
			valueRightMobile,
			valueTopMobile,
			syncUnits,
			syncUnitsTablet,
			syncUnitsMobile,
			dimensionSize,
			setAttributes,
		} = this.props;

		const { paddingSize, marginSize } = this.props.attributes;

		const classes = classnames(
			'components-gx-dimensions-control',
			'gx-'+this.props.type + "-dimensions-control", {
			}
		);

		const id = `inspector-gx-dimensions-control-${ instanceId }`;

		const onChangeTopValue = ( event ) => {
			const newValue = ( event.target.value === '' ) ? undefined : Number( event.target.value );

			let device = '';
			if ( typeof event.target.getAttribute( 'data-device-type' ) !== 'undefined' && typeof event.target.getAttribute( 'data-device-type' ) !== 'undefined' ) {
				device = event.target.getAttribute( 'data-device-type' );
			}

			if ( this.props[ 'syncUnits' + device ] ) {
				this.onChangeAll( newValue, device );
			} else {
				this.onChangeTop( newValue, device );
			}
		};

		const onChangeRightValue = ( event ) => {
			const newValue = ( event.target.value === '' ) ? undefined : Number( event.target.value );

			let device = '';
			if ( typeof event.target.getAttribute( 'data-device-type' ) !== 'undefined' && typeof event.target.getAttribute( 'data-device-type' ) !== 'undefined' ) {
				device = event.target.getAttribute( 'data-device-type' );
			}

			if ( this.props[ 'syncUnits' + device ] ) {
				this.onChangeAll( newValue, device );
			} else {
				this.onChangeRight( newValue, device );
			}
		};

		const onChangeBottomValue = ( event ) => {
			const newValue = ( event.target.value === '' ) ? undefined : Number( event.target.value );

			let device = '';
			if ( typeof event.target.getAttribute( 'data-device-type' ) !== 'undefined' && typeof event.target.getAttribute( 'data-device-type' ) !== 'undefined' ) {
				device = event.target.getAttribute( 'data-device-type' );
			}

			if ( this.props[ 'syncUnits' + device ] ) {
				this.onChangeAll( newValue, device );
			} else {
				this.onChangeBottom( newValue, device );
			}
		};

		const onChangeLeftValue = ( event ) => {
			const newValue = ( event.target.value === '' ) ? undefined : Number( event.target.value );

			let device = '';
			if ( typeof event.target.getAttribute( 'data-device-type' ) !== 'undefined' && typeof event.target.getAttribute( 'data-device-type' ) !== 'undefined' ) {
				device = event.target.getAttribute( 'data-device-type' );
			}

			if ( this.props[ 'syncUnits' + device ] ) {
				this.onChangeAll( newValue, device );
			} else {
				this.onChangeLeft( newValue, device );
			}
		};

		const unitSizes = [
			{
				/* translators: a unit of size (px) for css markup */
				name: __( 'Pixel', 'gx' ),
				unitValue: 'px',
			},
			{
				/* translators: a unit of size (em) for css markup */
				name: __( 'Em', 'gx' ),
				unitValue: 'em',
			},
			{
				/* translators: a unit of size (vw) for css markup */
				name: __( 'Viewport Width', 'gx' ),
				unitValue: 'vw',
			},
			{
				/* translators: a unit of size (vh) for css markup */
				name: __( 'Viewport Height', 'gx' ),
				unitValue: 'vh',
			},
			{
				/* translators: a unit of size for css markup */
				name: __( 'Percentage', 'gx' ),
				unitValue: '%',
			},
		];

		const onSelect = ( tabName ) => {
			let selected = 'desktop';

			switch ( tabName ) {
				case 'desktop':
					selected = 'tablet';
					break;
				case 'tablet':
					selected = 'mobile';
					break;
				case 'mobile':
					selected = 'desktop';
					break;
				default:
					break;
			}

			//Reset z-index
			const buttons = document.getElementsByClassName( `components-gx-dimensions-control__mobile-controls-item--${ this.props.type }` );

			for ( let i = 0; i < buttons.length; i++ ) {
				buttons[ i ].style.display = 'none';
			}
			if ( tabName === 'default' ) {
				const button = document.getElementsByClassName( `components-gx-dimensions-control__mobile-controls-item-${ this.props.type }--tablet` );
				button[ 0 ].click();
			} else {
				const button = document.getElementsByClassName( `components-gx-dimensions-control__mobile-controls-item-${ this.props.type }--${ selected }` );
				button[ 0 ].style.display = 'block';
			}
		};

		return (
			<Fragment>
				<div className={ classes }>
						<Fragment>
							<div className="components-gx-dimensions-control__header">
								{ label && <p className={ 'components-gx-dimensions-control__label' }>{ label }</p> }
								<Button
										className="components-color-palette__clear"
										onClick={ () => this.onChangeSize( 'no', -1 ) }
										isSmall
										aria-label={ sprintf(
											/* translators: %s: a texual label  */
											__( 'Reset %s settings', 'gx' ),
											label.toLowerCase()
										) }
									>
										{ icons.reset }
									</Button>
								<div className="components-gx-dimensions-control__actions">
									<ButtonGroup className="components-gx-dimensions-control__units" aria-label={ __( 'Select Units', 'gx' ) }>
										{ map( unitSizes, ( { unitValue, name } ) => (
											<Tooltip text={ sprintf(
												/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
												__( '%s Units', 'gx' ),
												name
											) }>
												<Button
													key={ unitValue }
													className={ 'components-gx-dimensions-control__units--' + name }
													isSmall
													isPrimary={ unit === unitValue }
													aria-pressed={ unit === unitValue }
													aria-label={ sprintf(
														/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
														__( '%s Units', 'gx' ),
														name
													) }
													onClick={ () => this.onChangeUnits( unitValue ) }
												>
													{ unitValue }
												</Button>
											</Tooltip>
										) ) }
									</ButtonGroup>
								</div>
							</div>
							<TabPanel
								className="components-gx-dimensions-control__mobile-controls"
								activeClass="is-active"
								initialTabName="default"
								onSelect={ onSelect }
								tabs={ [
									{
										name: 'default',
										title: icons.desktopChrome,
										className: `components-gx-dimensions-control__mobile-controls-item components-gx-dimensions-control__mobile-controls-item--${ this.props.type } components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--default components-gx-dimensions-control__mobile-controls-item-${ this.props.type }--default`,
									},
									{
										name: 'desktop',
										title: icons.mobile,
										className: `components-gx-dimensions-control__mobile-controls-item components-gx-dimensions-control__mobile-controls-item--${ this.props.type } components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--desktop components-gx-dimensions-control__mobile-controls-item-${ this.props.type }--desktop`,
									},
									{
										name: 'tablet',
										title: icons.desktopChrome,
										className: `components-gx-dimensions-control__mobile-controls-item components-gx-dimensions-control__mobile-controls-item--${ this.props.type } components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--tablet components-gx-dimensions-control__mobile-controls-item-${ this.props.type }--tablet`,
									},
									{
										name: 'mobile',
										title: icons.tablet,
										className: `components-gx-dimensions-control__mobile-controls-item components-gx-dimensions-control__mobile-controls-item--${ this.props.type } components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--mobile components-gx-dimensions-control__mobile-controls-item-${ this.props.type }--mobile`,
									},
								] }>
								{
									( tab ) => {
										if ( 'mobile' === tab.name ) {
											return (
												<Fragment>
													<div className="components-gx-dimensions-control__inputs">
														<input
															className="components-gx-dimensions-control__number"
															type="number"
															onChange={ onChangeTopValue }
															aria-label={ sprintf(
																/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
																__( '%s Top', 'gx' ),
																label
															) }
															aria-describedby={ !! help ? id + '__help' : undefined }
															value={ valueTopMobile !== '' ? valueTopMobile : '' }
															min={ type === 'padding' ? 0 : undefined }
															data-device-type="Mobile"
														/>
														<input
															className="components-gx-dimensions-control__number"
															type="number"
															onChange={ onChangeRightValue }
															aria-label={ sprintf(
																/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
																__( '%s Right', 'gx' ),
																label
															) }
															aria-describedby={ !! help ? id + '__help' : undefined }
															value={ valueRightMobile !== '' ? valueRightMobile : '' }
															min={ type === 'padding' ? 0 : undefined }
															data-device-type="Mobile"
														/>
														<input
															className="components-gx-dimensions-control__number"
															type="number"
															onChange={ onChangeBottomValue }
															aria-label={ sprintf(
																/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
																__( '%s Bottom', 'gx' ),
																label
															) }
															aria-describedby={ !! help ? id + '__help' : undefined }
															value={ valueBottomMobile !== '' ? valueBottomMobile : '' }
															min={ type === 'padding' ? 0 : undefined }
															data-device-type="Mobile"
														/>
														<input
															className="components-gx-dimensions-control__number"
															type="number"
															onChange={ onChangeLeftValue }
															aria-label={ sprintf(
																/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
																__( '%s Left', 'gx' ),
																label
															) }
															aria-describedby={ !! help ? id + '__help' : undefined }
															value={ valueLeftMobile !== '' ? valueLeftMobile : '' }
															min={ type === 'padding' ? 0 : undefined }
															data-device-type="Mobile"
														/>
														<Tooltip text={ !! syncUnitsMobile ? __( 'Unsync', 'gx' ) : __( 'Sync', 'gx' ) } >
															<Button
																className="components-gx-dimensions-control_sync"
																aria-label={ __( 'Sync Units', 'gx' ) }
																isPrimary={ syncUnitsMobile ? syncUnitsMobile : false }
																aria-pressed={ syncUnitsMobile ? syncUnitsMobile : false }
																onClick={ ( value ) => this.syncUnits( value, 'Mobile' ) }
																data-device-type="Mobile"
																isSmall
															>
																{ !! syncUnitsMobile ? icons.sync : icons.sync }
															</Button>
														</Tooltip>
													</div>
												</Fragment>
											);
										} else if ( 'tablet' === tab.name ) {
											return (
												<Fragment>
													<div className="components-gx-dimensions-control__inputs">
														<input
															className="components-gx-dimensions-control__number"
															type="number"
															onChange={ onChangeTopValue }
															aria-label={ sprintf(
																/* translators: %s:  values associated with CSS syntax, 'Margin', 'Padding' */
																__( '%s Top', 'gx' ),
																label
															) }
															aria-describedby={ !! help ? id + '__help' : undefined }
															value={ valueTopTablet !== '' ? valueTopTablet : '' }
															min={ type === 'padding' ? 0 : undefined }
															data-device-type="Tablet"
														/>
														<input
															className="components-gx-dimensions-control__number"
															type="number"
															onChange={ onChangeRightValue }
															aria-label={ sprintf(
																/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
																__( '%s Right', 'gx' ),
																label
															) }
															aria-describedby={ !! help ? id + '__help' : undefined }
															value={ valueRightTablet !== '' ? valueRightTablet : '' }
															min={ type === 'padding' ? 0 : undefined }
															data-device-type="Tablet"
														/>
														<input
															className="components-gx-dimensions-control__number"
															type="number"
															onChange={ onChangeBottomValue }
															aria-label={ sprintf(
																/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
																__( '%s Bottom', 'gx' ),
																label
															) }
															aria-describedby={ !! help ? id + '__help' : undefined }
															value={ valueBottomTablet !== '' ? valueBottomTablet : '' }
															min={ type === 'padding' ? 0 : undefined }
															data-device-type="Tablet"
														/>
														<input
															className="components-gx-dimensions-control__number"
															type="number"
															onChange={ onChangeLeftValue }
															aria-label={ sprintf(
																/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
																__( '%s Left', 'gx' ),
																label
															) }
															aria-describedby={ !! help ? id + '__help' : undefined }
															value={ valueLeftTablet !== '' ? valueLeftTablet : '' }
															min={ type === 'padding' ? 0 : undefined }
															data-device-type="Tablet"
														/>
														<Tooltip text={ !! syncUnitsTablet ? __( 'Unsync', 'gx' ) : __( 'Sync', 'gx' ) } >
															<Button
																className="components-gx-dimensions-control_sync"
																aria-label={ __( 'Sync Units', 'gx' ) }
																isPrimary={ syncUnitsTablet ? syncUnitsTablet : false }
																aria-pressed={ syncUnitsTablet ? syncUnitsTablet : false }
																onClick={ ( value ) => this.syncUnits( value, 'Tablet' ) }
																data-device-type="Tablet"
																isSmall
															>
																{ !! syncUnitsTablet ? icons.sync : icons.sync }
															</Button>
														</Tooltip>
													</div>
												</Fragment>
											);
										}
										return (
											<Fragment>
												<div className="components-gx-dimensions-control__inputs">
													<input
														className="components-gx-dimensions-control__number"
														type="number"
														onChange={ onChangeTopValue }
														aria-label={ sprintf(
															/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
															__( '%s Top', 'gx' ),
															label
														) }
														aria-describedby={ !! help ? id + '__help' : undefined }
														value={ valueTop !== '' ? valueTop : '' }
														min={ type === 'padding' ? 0 : undefined }
														data-device-type=""
													/>
													<input
														className="components-gx-dimensions-control__number"
														type="number"
														onChange={ onChangeRightValue }
														aria-label={ sprintf(
															/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
															__( '%s Right', 'gx' ),
															label
														) }
														aria-describedby={ !! help ? id + '__help' : undefined }
														value={ valueRight !== '' ? valueRight : '' }
														min={ type === 'padding' ? 0 : undefined }
														data-device-type=""
													/>
													<input
														className="components-gx-dimensions-control__number"
														type="number"
														onChange={ onChangeBottomValue }
														aria-label={ sprintf(
															/* translators: %s:  values associated with CSS syntax, 'Margin', 'Padding' */
															__( '%s Bottom', 'gx' ),
															label
														) }
														aria-describedby={ !! help ? id + '__help' : undefined }
														value={ valueBottom !== '' ? valueBottom : '' }
														min={ type === 'padding' ? 0 : undefined }
														data-device-type=""
													/>
													<input
														className="components-gx-dimensions-control__number"
														type="number"
														onChange={ onChangeLeftValue }
														aria-label={ sprintf(
															/* translators: %s:  values associated with CSS syntax, 'Margin', 'Padding' */
															__( '%s Left', 'gx' ), label
														) }
														aria-describedby={ !! help ? id + '__help' : undefined }
														value={ valueLeft !== '' ? valueLeft : '' }
														min={ type === 'padding' ? 0 : undefined }
														data-device-type=""
													/>
													<Tooltip text={ !! syncUnits ? __( 'Unsync', 'gx' ) : __( 'Sync', 'gx' ) } >
														<Button
															className="components-gx-dimensions-control_sync"
															aria-label={ __( 'Sync Units', 'gx' ) }
															isPrimary={ syncUnits ? syncUnits : false }
															aria-pressed={ syncUnits ? syncUnits : false }
															onClick={ ( value ) => this.syncUnits( value, '' ) }
															data-device-type=""
															isSmall
														>
															{ !! syncUnits ? icons.sync : icons.sync }
														</Button>
													</Tooltip>
												</div>
											</Fragment>
										);
									}
								}
							</TabPanel>
							<div className="components-gx-dimensions-control__input-labels">
								<span className="components-gx-dimensions-control__number-label">{ __( 'Top', 'gx' ) }</span>
								<span className="components-gx-dimensions-control__number-label">{ __( 'Right', 'gx' ) }</span>
								<span className="components-gx-dimensions-control__number-label">{ __( 'Bottom', 'gx' ) }</span>
								<span className="components-gx-dimensions-control__number-label">{ __( 'Left', 'gx' ) }</span>
								<span className="components-gx-dimensions-control__number-label-blank"></span>
							</div>
						</Fragment>
				</div>
			</Fragment>
		);
	}
}

export default withInstanceId( DimensionsControl );
