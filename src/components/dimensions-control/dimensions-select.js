/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

// List of pre-defined sizes, DEPRICATED
const utilitySizes = [
	{
		name: __( 'None', 'gx' ),
		size: 0,
		slug: 'no',
	},
	{
		name: __( 'Small', 'gx' ),
		size: 14,
		slug: 'small',
	},
	{
		name: __( 'Medium', 'gx' ),
		size: 24,
		slug: 'medium',
	},
	{
		name: __( 'Large', 'gx' ),
		size: 34,
		slug: 'large',
	},
	{
		name: __( 'Huge', 'gx' ),
		size: 60,
		slug: 'huge',
	},
];

export default class DimensionsSelect extends Component {
	constructor( ) {
		super( ...arguments );

		this.getSelectValuesFromUtilitySizes = this.getSelectValuesFromUtilitySizes.bind( this );
		this.getCurrentSelectValue = this.getCurrentSelectValue.bind( this );
		this.setCurrentSelectValue = this.setCurrentSelectValue.bind( this );
		this.onChangeValue = this.onChangeValue.bind( this );
		this.getSelectOptions = this.getSelectOptions.bind( this );
	}

	getSelectValuesFromUtilitySizes( listOfSizes, value ) {
		let selectedPreset;
		if ( typeof value === 'string' ) {
			selectedPreset = listOfSizes.find( choice => choice.slug === value );
			return selectedPreset ? selectedPreset.slug : 'custom';
		}
	}

	getCurrentSelectValue( type ) {
		const { paddingSize, marginSize, borderRadiusSize } = this.props;
		switch ( type ) {
			case 'margin':
				return marginSize;
			case 'padding':
				return paddingSize;
			case 'borderRadius':
				return borderRadiusSize;
			case 'borderWidth':
				return borderWidthSize;
			default:
		}
	}

	setCurrentSelectValue( newSetting ) {
		const { type, setAttributes } = this.props;
		switch ( type ) {
			case 'margin':
				setAttributes( { marginSize: newSetting } );
				break;
			case 'padding':
				setAttributes( { paddingSize: newSetting } );
				break;
			case 'borderRadius':
				setAttributes( { borderRadiusSize: newSetting } );
				break;
			case 'borderWidth':
				setAttributes( { borderWidthSize: newSetting } );
				break;
			default:
		}
	}

	onChangeValue( event ) {
		const selectedUtil = utilitySizes.find( util => util.slug === event );
		if ( selectedUtil ) {
			this.setCurrentSelectValue(
				this.getSelectValuesFromUtilitySizes( utilitySizes, selectedUtil.slug )
			);
		}
	}

	getSelectOptions( optionsArray ) {
		return [
			...optionsArray.map( option => ( {
				value: option.slug,
				label: option.name,
			} ) ),
		];
	}

	render() {
		const { type } = this.props;
		return (
			<Fragment>
				<SelectControl
					className={ 'components-font-size-picker__select' }
					label={ `Choose ${ type } preset` }
					hideLabelFromVision={ true }
					value={ this.getCurrentSelectValue( type ) }
					onChange={ this.onChangeValue }
					options={ this.getSelectOptions( utilitySizes ) }
				/>
			</Fragment>
		);
	}
}
