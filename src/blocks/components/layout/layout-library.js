/**
 * Layout Library UI.
 *
 * Interface for browsing, searching, filtering and inserting sections and layouts.
 */

 /**
 * Dependencies.
 */
import map from 'lodash/map';
import classnames from 'classnames';
import LayoutLibraryItem from './layout-library-item';
import { LayoutsContext } from '../layouts-provider';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	ButtonGroup,
	TextControl,
	SelectControl,
	Dashicon,
	Tooltip,
} = wp.components;

export default class LayoutLibrary extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			category: 'all',
			search: undefined,
			activeView: 'grid',
		};
	}

	/* Conditionally load the layout array based on the tab. */
	getLayoutArray() {
		let component = [];

		switch ( this.props.currentTab ) {
			case 'gx-layout-tgx-layouts' :
				component = this.props.context.layouts;
				break;
			case 'gx-layout-tab-sections' :
				component = this.props.context.sections;
				break;
			case 'gx-layout-tab-favorites' :
				component = this.props.context.favorites;
				break;
		}

		return component;
	}

	render() {
		/* Grab the layout array. */
		const blockLayout = this.getLayoutArray();

		/* Set a default category. */
		const cats = [ 'all' ];

		/* Build a category array. */
		for ( let i = 0; i < blockLayout.length; i++ ) {
			for ( let c = 0; c < blockLayout[ i ].category.length; c++ ) {
				if ( ! cats.includes( blockLayout[ i ].category[ c ] ) ) {
					cats.push( blockLayout[ i ].category[ c ] );
				}
			}
		}

		/* Setup categories for select menu. */
		const catOptions = cats.map( ( item ) => {
			return {
				value: item, label: item.charAt( 0 ).toUpperCase() + item.slice( 1 ) }
		} );

		/* Expand each layout full width. */
		const onZoom = () => {
			const imageZoom = document.querySelector('.gx-layout-zoom-button');
			imageZoom.parentNode.classList.toggle('gx-layout-zoom-layout');
		};

		return (
			<Fragment key={ 'layout-library-fragment-' + this.props.clientId }>
				{ /* Category filter and search header. */ }
				<div className="gx-layout-modal-header">
					<SelectControl
						key={ 'layout-library-select-categories-' + this.props.clientId }
						label={ __( 'Layout Categories', 'gutenberg-den-blocks' ) }
						value={ this.state.category }
						options={ catOptions }
						onChange={ value => this.setState( { category: value } ) }
					/>
					<TextControl
						key={ 'layout-library-search-layouts-' + this.props.clientId }
						type="text"
						value={ this.state.search }
						placeholder={ __( 'Search Layouts', 'gutenberg-den-blocks' ) }
						onChange={ value => this.setState( { search: value } ) }
					/>
				</div>

				<div className={ 'gx-layout-view' }>
					{ <div className={ 'gx-layout-view-left' }><p>{ __( 'Showing: ', 'gutenberg-den-blocks' ) + this.props.data.length }</p></div> }

					{ /* Grid width view. */ }
					<div className={ 'gx-layout-view-right' }>
						<Tooltip key={ 'layout-library-grid-view-tooltip-' + this.props.clientId } text={ __( 'Grid View', 'gutenberg-den-blocks' ) }>
							<Button
								key={ 'layout-library-grid-view-button-' + this.props.clientId }
								className={ classnames(
									this.state.activeView === 'grid' ? 'is-primary' : null,
									'gx-layout-grid-view-button'
								) }
								isSmall
								onClick={ () => this.setState( {
									activeView: 'grid'
								} ) }
							>
								<Dashicon
									key={ 'layout-library-grid-view-dashicon-' + this.props.clientId }
									icon={ 'screenoptions' }
									className={ 'gx-layout-icon-grid' }
								/>
							</Button>
						</Tooltip>

						{ /* Full width layout view. */ }
						<Tooltip key={ 'layout-library-full-view-tooltip-' + this.props.clientId } text={ __( 'Full Width View', 'gutenberg-den-blocks' ) }>
							<Button
								key={ 'layout-library-full-view-button-' + this.props.clientId }
								className={ classnames(
									this.state.activeView === 'full' ? 'is-primary' : null,
									'gx-layout-full-view-button'
								) }
								isSmall
								onClick={ () => this.setState( {
									activeView: 'full'
								} ) }
							>
								<Dashicon
									key={ 'layout-library-full-view-dashicon-' + this.props.clientId }
									icon={ 'tablet' }
									className={ 'gx-layout-icon-tablet' }
								/>
							</Button>
						</Tooltip>
					</div>
				</div>

				<LayoutsContext.Consumer>
					{ ( context ) => (
						<ButtonGroup
							key={ 'layout-library-context-button-group-' + this.props.clientId }
							className={ classnames(
								'gx-layout-choices',
								this.state.activeView === 'full' ? 'gx-layout-view-full' : null,
							) }
							aria-label={ __( 'Layout Options', 'gutenberg-den-blocks' ) }
						>
							{ map( this.props.data, ( { name, key, image, content, category, keywords } ) => {
								if ( ( 'all' === this.state.category || category.includes( this.state.category ) ) && ( ! this.state.search || ( keywords && keywords.some( x => x.toLowerCase().includes( this.state.search.toLowerCase() ) ) ) ) ) {
									return (
										/* Section and layout items. */
										<LayoutLibraryItem
											key={ 'layout-library-item-' + key }
											name={ name }
											itemKey={ key } /* 'key' is reserved, so we use itemKey. */
											image={ image }
											content={ content }
											context={ context }
											clientId={ this.props.clientId }
										/>
									);
								}
							} ) }
						</ButtonGroup>
					) }
				</LayoutsContext.Consumer>
			</Fragment>
		);
	}
}
