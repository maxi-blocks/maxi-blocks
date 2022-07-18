/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { useInnerBlocksProps } from '@wordpress/block-editor';
import { useEntityBlockEditor } from '@wordpress/core-data';

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
import copyPasteMapping from './copy-paste-mapping';

const Navigation = props => {
	const { selectedMenuId } = props.attributes;

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		'wp_navigation',
		{
			id: selectedMenuId,
		}
	);

	const ALLOWED_BLOCKS = ['maxi-blocks/navigation-link-maxi'];

	console.log(blocks);

	return (
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
				}
			)}
		/>
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

	maxiBlockDidUpdate() {
		const { selectedMenuId } = this.props.attributes;

		this.updateSelectedMenu(selectedMenuId);
	}

	createNewMenu(title) {
		const { maxiSetAttributes } = this.props;

		const record = {
			title,
			content: [],
			status: 'publish',
		};
		dispatch('core')
			.saveEntityRecord('postType', 'wp_navigation', record)
			.then(res => {
				maxiSetAttributes({ selectedMenuId: res.id });
			});
	}

	updateSelectedMenu(id) {
		if (!id) return;
		if (id === '-1') {
			this.createNewMenu('New menu');
		}

		const { getEditedEntityRecord } = select('core');

		const args = ['postType', 'wp_navigation', id];

		const editedNavigationMenu = getEditedEntityRecord(...args);

		this.setState({ editedNavigationMenu });
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
				{this.state.editedNavigationMenu && (
					<Navigation {...this.props} />
				)}
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
