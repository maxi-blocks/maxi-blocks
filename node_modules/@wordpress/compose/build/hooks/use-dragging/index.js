"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useDragging;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _element = require("@wordpress/element");

/**
 * WordPress dependencies
 */
var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? _element.useLayoutEffect : _element.useEffect;

function useDragging(_ref) {
  var onDragStart = _ref.onDragStart,
      onDragMove = _ref.onDragMove,
      onDragEnd = _ref.onDragEnd;

  var _useState = (0, _element.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isDragging = _useState2[0],
      setIsDragging = _useState2[1];

  var eventsRef = (0, _element.useRef)({
    onDragStart: onDragStart,
    onDragMove: onDragMove,
    onDragEnd: onDragEnd
  });
  useIsomorphicLayoutEffect(function () {
    eventsRef.current.onDragStart = onDragStart;
    eventsRef.current.onDragMove = onDragMove;
    eventsRef.current.onDragEnd = onDragEnd;
  }, [onDragStart, onDragMove, onDragEnd]);
  var onMouseMove = (0, _element.useCallback)(function () {
    var _eventsRef$current;

    return eventsRef.current.onDragMove && (_eventsRef$current = eventsRef.current).onDragMove.apply(_eventsRef$current, arguments);
  }, []);
  var endDrag = (0, _element.useCallback)(function () {
    if (eventsRef.current.onDragEnd) {
      var _eventsRef$current2;

      (_eventsRef$current2 = eventsRef.current).onDragEnd.apply(_eventsRef$current2, arguments);
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', endDrag);
    setIsDragging(false);
  }, []);
  var startDrag = (0, _element.useCallback)(function () {
    if (eventsRef.current.onDragStart) {
      var _eventsRef$current3;

      (_eventsRef$current3 = eventsRef.current).onDragStart.apply(_eventsRef$current3, arguments);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', endDrag);
    setIsDragging(true);
  }, []); // Remove the global events when unmounting if needed.

  (0, _element.useEffect)(function () {
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