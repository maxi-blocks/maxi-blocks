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
			console.time('withMaxiContextLoopContext');
			const context = useContext(LoopContext);

			useMaxiDCLink(
				props.name,
				props.attributes,
				props.clientId,
				context,
				props.setAttributes
			);

			console.timeEnd('withMaxiContextLoopContext');

			return <WrappedComponent contextLoopContext={context} {...props} />;
		}),
	'withMaxiContextLoopContext'
);

export default withMaxiContextLoopContext;
