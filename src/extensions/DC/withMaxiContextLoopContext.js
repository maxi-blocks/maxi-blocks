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

const withMaxiContextLoopContext = createHigherOrderComponent(
	WrappedComponent =>
		pure(props => {
			if (!props) {
				return null;
			}
			console.time(`withMaxiContextLoopContext ${props.attributes.uniqueID}`);

			const context = useContext(LoopContext);

			useMaxiDCLink(
				props.name,
				props.attributes,
				props.clientId,
				context,
				props.setAttributes
			);

			console.timeEnd(`withMaxiContextLoopContext ${props.attributes.uniqueID}`);


			return <WrappedComponent contextLoopContext={context} {...props} />;
		}),
	'withMaxiContextLoopContext'
);

export default withMaxiContextLoopContext;
