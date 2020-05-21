/**
 * Edit component.
 */

 /**
 * Import dependencies.
 */
import LayoutModal from './layout/layout-modal';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Placeholder } = wp.components;
const { Component, Fragment } = wp.element;
const {
	BlockControls,
	BlockAlignmentToolbar,
} = wp.editor;

export default class Edit extends Component {

	constructor( props ) {
		super( ...arguments );
	}

	render() {

		const {
			attributes,
			setAttributes,
			clientId,
		} = this.props;

		/* Placeholder with layout modal */
		return [
			<Fragment key={ this.props.clientId }>
				<BlockControls key="controls">
					<BlockAlignmentToolbar
						value={ attributes.align }
						onChange={ align => setAttributes( { align } ) }
						controls={ [] }
					/>
				</BlockControls>
				<Placeholder
					key="placeholder"
					label={ __( 'Layout Selector', 'maxi-blocks' ) }
					instructions={ __( 'Launch the layout library to browse pre-designed sections.', 'maxi-blocks' ) }
					className={ 'maxi-layout-selector-placeholder' }
					icon="layout"
				>
					<LayoutModal clientId={ clientId } />
				</Placeholder>
			</Fragment>
		];
	}
}
