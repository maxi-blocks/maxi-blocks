/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { useEntityBlockEditor } from '@wordpress/core-data';
import { Spinner } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import getStyles from './styles';
import Inspector from './inspector';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import createNewMenu from '../../extensions/navigation-menu/create-new-menu';
import { copyPasteMapping, submenuIndicatorPrefix } from './data';
import NavigationContext from './context';

const Navigation = props => {
	const {
		selectedMenuId,
		[`${submenuIndicatorPrefix}icon-content`]: submenuIcon,
	} = props.attributes;
	const ALLOWED_BLOCKS = [
		'maxi-blocks/navigation-link-maxi',
		'maxi-blocks/navigation-submenu-maxi',
	];

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		'wp_navigation',
		{
			id: selectedMenuId,
		}
	);

	const contextValue = useMemo(
		() => ({
			submenuIcon,
		}),
		[submenuIcon]
	);

	return (
		<NavigationContext.Provider value={contextValue}>
			<div
				{...useInnerBlocksProps(
					{
						className: 'maxi-navigation-menu-block__container',
					},
					{
						value: blocks,
						onInput,
						onChange,
						allowedBlocks: ALLOWED_BLOCKS,
						direction: 'horizontal',
					}
				)}
			/>
		</NavigationContext.Provider>
	);
};

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.state = {
			editedNavigationMenu: null,
		};
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const response = {
			navigation_menu: {
				[uniqueID]: {},
			},
		};

		return response;
	}

	maxiBlockDidMount() {
		// TODO: if there is no `selectedMenuId` try to select menu from existing on mount
		const { selectedMenuId } = this.props.attributes;

		if (!selectedMenuId) return;

		const args = ['postType', 'wp_navigation', selectedMenuId];
		resolveSelect('core')
			.getEditedEntityRecord(...args)
			.then(editedNavigationMenu =>
				this.setState({ editedNavigationMenu })
			);
	}

	maxiBlockDidUpdate(prevProps) {
		const { selectedMenuId } = this.props.attributes;
		const { selectedMenuId: prevMenuId } = prevProps.attributes;

		if (selectedMenuId !== prevMenuId)
			this.updateSelectedMenu(selectedMenuId);
	}

	updateSelectedMenu(id) {
		if (!id) return;

		const { maxiSetAttributes } = this.props;

		if (id === '-1') {
			createNewMenu([]).then(newId =>
				maxiSetAttributes({ selectedMenuId: newId })
			);
		}

		resolveSelect('core')
			.getEditedEntityRecord('postType', 'wp_navigation', id)
			.then(editedNavigationMenu =>
				this.setState({ editedNavigationMenu })
			);
	}

	render() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-navigation-menu--${uniqueID}`}
				ref={this.blockRef}
				{...getMaxiBlockAttributes(this.props)}
				tagName='nav'
				state={this.state}
			>
				{this.state.editedNavigationMenu ? (
					<Navigation {...this.props} />
				) : (
					<Spinner />
				)}
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
