import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from '@wordpress/element';
var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
export default function useDragging(_ref) {
  var onDragStart = _ref.onDragStart,
      onDragMove = _ref.onDragMove,
      onDragEnd = _ref.onDragEnd;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isDragging = _useState2[0],
      setIsDragging = _useState2[1];

  var eventsRef = useRef({
    onDragStart: onDragStart,
    onDragMove: onDragMove,
    onDragEnd: onDragEnd
  });
  useIsomorphicLayoutEffect(function () {
    eventsRef.current.onDragStart = onDragStart;
    eventsRef.current.onDragMove = onDragMove;
    eventsRef.current.onDragEnd = onDragEnd;
  }, [onDragStart, onDragMove, onDragEnd]);
  var onMouseMove = useCallback(function () {
    var _eventsRef$current;

    return eventsRef.current.onDragMove && (_eventsRef$current = eventsRef.current).onDragMove.apply(_eventsRef$current, arguments);
  }, []);
  var endDrag = useCallback(function () {
    if (eventsRef.current.onDragEnd) {
      var _eventsRef$current2;

      (_eventsRef$current2 = eventsRef.current).onDragEnd.apply(_eventsRef$current2, arguments);
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', endDrag);
    setIsDragging(false);
  }, []);
  var startDrag = useCallback(function () {
    if (eventsRef.current.onDragStart) {
      var _eventsRef$current3;

      (_eventsRef$current3 = eventsRef.current).onDragStart.apply(_eventsRef$current3, arguments);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', endDrag);
    setIsDragging(true);
  }, []); // Remove the global events when unmounting if needed.

  useEffect(function () {
    return function () {
      if (isDragging) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', endDrag);
      }
    };
  }, [isDragging]);
  return {
    startDrag: startDrag,
    endDrag: endDrag,
    isDragging: isDragging
  };
}
//# sourceMappingURL=index.js.map