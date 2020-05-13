/**
 * WordPress dependencies
 */
const {
    InnerBlocks,
    __experimentalBlock
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import { GXBlock } from '../../components';
import Inspector from './inspector';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Edit
 */
class edit extends GXBlock {

    componentDidMount() {
        this.uniqueIDChecker(this.props.attributes.uniqueID);
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                extraClassName,
                defaultBlockStyle
            },
            className,
        } = this.props;

        let classes = classnames(
            'gx-block gx-section-block',
            uniqueID,
            blockStyle,
            extraClassName,
            className
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalBlock
                data-gx_initial_block_class={defaultBlockStyle}
                className={classes}
            >
                <InnerBlocks />
            </__experimentalBlock>
        ];
    }
}

export default edit;