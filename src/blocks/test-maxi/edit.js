/**
 * WordPress dependencies
 */
const { withSelect, dispatch } = wp.data;
const { __experimentalBlock } = wp.blockEditor;
const { render } = wp.element;

/**
 * Internal dependencies
 */
import { MaxiBlock } from '../../components';
import Inspector from './inspector';
import styleResolver from '../../extensions/styles/newStyleResolver';
import styleGenerator from '../../extensions/styles/newStylesGenerator';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import { getBorderStyles } from '../../extensions/styles/helpers';

/**
 * Edit
 */
class edit extends MaxiBlock {
	componentWillUnmount() {
		const obj = this.getObject;

		styleResolver(obj, true);

		dispatch('maxiBlocks/customData').removeCustomData(
			this.props.attributes.uniqueID
		);
	}

	/**
	 * Refresh the styles on Editor
	 */
	displayStyles() {
		const obj = this.getObject;
		const customData = this.getCustomData;

		const styles = styleResolver(obj);
		// console.log(styleGenerator(styles));
		dispatch('maxiBlocks/customData').updateCustomData(customData);

		if (document.body.classList.contains('maxi-blocks--active')) {
			let wrapper = document.querySelector(
				`#maxi-blocks__styles--${this.props.attributes.uniqueID}`
			);
			if (!wrapper) {
				wrapper = document.createElement('div');
				wrapper.id = `maxi-blocks__styles--${this.props.attributes.uniqueID}`;
				document.head.appendChild(wrapper);
			}

			render(<style>{styleGenerator(styles)}</style>, wrapper);
		}
	}

	get getObject() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const response = {
			[uniqueID]: {
				border: getBorderStyles({
					...getGroupAttributes(attributes, 'border'),
				}),
			},
		};

		return response;
	}

	render() {
		const {
			attributes: { defaultBlockStyle, fullWidth, uniqueID },
		} = this.props;

		return [
			<Inspector {...this.props} />,
			<__experimentalBlock.section
				className={`test-maxi maxi-block maxi-block--backend ${uniqueID}`}
				data-align={fullWidth}
				data-maxi_initial_block_class={defaultBlockStyle}
			>
				<div style={{ width: '20rem', height: '5rem' }}>Hello!</div>
			</__experimentalBlock.section>,
		];
	}
}

export default withSelect((select, ownProps) => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
})(edit);
