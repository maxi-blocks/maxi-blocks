/**
 * Layout Library Section and Layout Item.
 */

 /**
 * Dependencies.
 */
import classnames from 'classnames';
import LazyLoad from 'react-lazy-load';

/**
 * WordPress dependencies.
 */
const { compose } = wp.compose;
const { rawHandler } = wp.blocks;
const {
	withSelect,
	withDispatch
} = wp.data;
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	Dashicon,
	Tooltip,
} = wp.components;

class LayoutLibraryItem extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		return (
			<Fragment>
				<div key={ 'gx-layout-design-' + this.props.itemKey } className="gx-layout-design">
					<div className="gx-layout-design-inside">
						<div className="gx-layout-design-item">
							{ /* Insert the selected layout. */ }
							<Button
								key={ this.props.itemKey }
								className="gx-layout-insert-button"
								isSmall
								onClick={ () => { this.props.import( this.props.content ) } }
							>
								<LazyLoad>
									<img
										src={ this.props.image }
										alt={ this.props.name }
									/>
								</LazyLoad>
							</Button>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default compose(
	/**
	 * Use rawHandler to parse html layouts to blocks
	 * See https://git.io/fjqGc for details
	 */
	withSelect( ( select, { clientId } ) => {
		const {
			getBlock,
			canUserUseUnfilteredHTML
		} = select( 'core/editor' );
		const block = getBlock( clientId );
		console.log('clientId ' + clientId);
		return {
			block,
			canUserUseUnfilteredHTML: canUserUseUnfilteredHTML(),
		};
	} ),
	withDispatch( ( dispatch, { block, canUserUseUnfilteredHTML } ) => ( {
		import: ( blockLayout ) => dispatch( 'core/editor' ).replaceBlocks(
			block.clientId,
			rawHandler( {
				HTML: blockLayout,
				mode: 'BLOCKS',
				canUserUseUnfilteredHTML,
			} ),
			console.log('clientId ' + clientId),
		),
	} ) ),
)( LayoutLibraryItem );
