/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useMaxiDCLink from './useMaxiDCLink';
import LoopContext from './loopContext';
import DC_LINK_BLOCKS from '../../components/toolbar/components/link/dcLinkBlocks';

const withMaxiContextLoopContext = createHigherOrderComponent(
	WrappedComponent =>
		pure(props => {
			const context = useContext(LoopContext);

			if (DC_LINK_BLOCKS.includes(props.name)) {
				useMaxiDCLink(
					props.attributes,
					props.clientId,
					context,
					props.setAttributes
				);
			}

			return <WrappedComponent contextLoopContext={context} {...props} />;
		}),
	'withMaxiContextLoopContext'
);

export default withMaxiContextLoopContext;
