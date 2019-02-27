'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * DraadJS v 1.0.1
 * Author: Tomislav Jezidžić
 * Repo: https://github.com/tomislavjezidzic/draad
 *
 * Year: 2018
 */

var Draad = function () {
    /**
     * @param {string} element
     * @param options
     * @param {string} options.parentClass
     * @param {number} options.smoothing
     * @param {number} options.offsetX
     * @param {number} options.offsetY
     * @param {string} options.fill
     * @param {string} options.color
     * @param {number} options.lineWidth
     * @param {number} options.lineOpacity
     * @param {string} options.dasharray
     * @param {string} options.cap
     * @param {boolean} options.responsive
     * @param {number} options.wait
     * @param {boolean} options.absoluteUnits
     */
    function Draad(element) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Draad);

        var _defaults = {
            element: '',
            parentClass: '',
            offsetX: '',
            offsetY: '',
            fill: '',
            color: '#000',
            lineWidth: '1',
            lineOpacity: '',
            dasharray: '',
            cap: '',
            responsive: '',
            options: '',
            wait: 0,
            smoothing: 0.2,
            absoluteUnits: false
        };

        this.defaults = Object.assign({}, _defaults, options);

        this.element = element;
        this.parent = function () {
            if (_this.defaults.parentClass.length < 1) {
                return document.getElementsByTagName('body')[0];
            } else {
                return _this.findAncestor(document.getElementsByClassName(element)[0], _this.defaults.parentClass);
            }
        };

        this.smoothing = this.defaults.smoothing;
        this.offsetX = this.defaults.offsetX;
        this.offsetY = this.defaults.offsetY;
        this.fill = this.defaults.fill;
        this.color = this.defaults.color;
        this.lineWidth = this.defaults.lineWidth;
        this.lineOpacity = this.defaults.lineOpacity;
        this.dasharray = this.defaults.dasharray;
        this.cap = this.defaults.cap;
        this.responsive = this.defaults.responsive;
        this.absoluteUnits = this.defaults.absoluteUnits;
        this.options = this.defaults;

        setTimeout(function () {
            _this.init();
        }, this.defaults.wait);
    }

    /**
     * @param {*} element
     * @param {string} cls
     * @returns {*}
     */


    _createClass(Draad, [{
        key: 'findAncestor',
        value: function findAncestor(element, cls) {
            return element.closest('.' + cls);
        }

        /**
         * It goes through elements and creates points with coordinates
         * @returns {Array}
         */

    }, {
        key: 'goThroughDots',
        value: function goThroughDots() {
            var dots = document.getElementsByClassName(this.element);
            var points = [];
            var offsetX = this.offsetX;
            var offsetY = this.offsetY;
            var body = document.body;
            var docEl = document.documentElement;
            var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
            var clientTop = docEl.clientTop || body.clientTop || 0;

            if (this.parent() === document.getElementsByTagName('body')[0]) {
                for (var i = 0; i < dots.length; i++) {
                    var currentDot = document.getElementsByClassName(this.element)[i];
                    var top = currentDot.getBoundingClientRect().top + scrollTop - clientTop;
                    var sampleDotOffsetX = offsetX || currentDot.offsetWidth / 2;
                    var sampleDotOffsetY = offsetY || currentDot.offsetHeight / 2;
                    var currentDotX = parseInt(currentDot.getBoundingClientRect().left + sampleDotOffsetX, 10);
                    var currentDotY = parseInt(Math.round(top) + sampleDotOffsetY, 10);
                    points.push([currentDotX, currentDotY]);
                }
            } else {
                for (var _i = 0; _i < dots.length; _i++) {
                    var _currentDot = document.getElementsByClassName(this.element)[_i];
                    var _sampleDotOffsetX = offsetX || _currentDot.offsetWidth / 2;
                    var _sampleDotOffsetY = offsetY || _currentDot.offsetHeight / 2;
                    var _top = _currentDot.getBoundingClientRect().top + scrollTop - clientTop;
                    var _currentDotX = parseInt(_currentDot.offsetLeft + _sampleDotOffsetX, 10);
                    var _currentDotY = parseInt(_currentDot.offsetTop + _sampleDotOffsetY, 10);

                    if (this.absoluteUnits === true) {
                        _currentDotX = parseInt(_currentDot.getBoundingClientRect().left + _sampleDotOffsetX, 10);
                        _currentDotY = parseInt(Math.round(_top) + _sampleDotOffsetY, 10);
                    }
                    points.push([_currentDotX, _currentDotY]);
                }
            }

            return points;
        }

        /**
         * @param {array} points
         */

    }, {
        key: 'connectingMagic',
        value: function connectingMagic(points) {
            var smoothing = this.smoothing;
            var svgParent = this.parent();

            var line = function line(pointA, pointB) {
                var lengthX = pointB[0] - pointA[0];
                var lengthY = pointB[1] - pointA[1];
                return {
                    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
                    angle: Math.atan2(lengthY, lengthX)
                };
            };

            /**
             * @param current
             * @param previous
             * @param next
             * @param reverse
             * @returns {[null,null]}
             */
            var controlPoint = function controlPoint(current, previous, next, reverse) {
                var prev = previous || current;
                var nex = next || current;

                var l = line(prev, nex);

                var angle = l.angle + (reverse ? Math.PI : 0);
                var length = l.length * smoothing;

                var xAxis = current[0] + Math.cos(angle) * length;
                var yAxis = current[1] + Math.sin(angle) * length;
                return [xAxis, yAxis];
            };

            /**
             * @param point
             * @param i
             * @param a
             * @returns {string}
             */
            var bezierCommand = function bezierCommand(point, i, a) {
                var cps = controlPoint(a[i - 1], a[i - 2], point);
                var cpe = controlPoint(point, a[i - 1], a[i + 1], true);
                return 'C ' + cps[0] + ',' + cps[1] + ' ' + cpe[0] + ',' + cpe[1] + ' ' + point[0] + ',' + point[1];
            };

            /**
             * @param points
             * @param command
             * @param {string} dAttr
             * @returns {*}
             */
            var svgPath = function svgPath(points, command) {
                var dAttr = points.reduce(function (acc, point, i, a) {
                    return i === 0 ? 'M ' + point[0] + ',' + point[1] : acc + ' ' + command(point, i, a);
                }, "");
                return dAttr;
            };

            var pointsLength = points.length;
            var firstPoint = points[0][1];
            var lastPoint = points[pointsLength - 1][1];

            var xmlns = "http://www.w3.org/2000/svg";
            var svgEl = document.createElementNS(xmlns, "svg");
            svgEl.setAttribute('class', 'draad-line draad-line--' + this.element);
            var path = document.createElementNS(xmlns, "path");
            path.setAttribute('d', svgPath(points, bezierCommand));
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', 'black');
            svgEl.appendChild(path);

            var fill = this.fill;
            var lineColor = this.color;
            var lineWidth = this.lineWidth;
            var lineOpacity = this.lineOpacity;
            var lineDasharray = this.dasharray;
            var linecap = this.cap;

            path.setAttribute("style", 'fill: ' + fill + '; ' + ('stroke: ' + lineColor + '; ') + ('stroke-width: ' + lineWidth + ';') + ('stroke-opacity: ' + lineOpacity + ';') + ('stroke-dasharray: ' + lineDasharray + ';') + ('stroke-linecap: ' + linecap));

            svgEl.setAttribute("style", "width: 100%; " + "min-height: 100%; " + ('height: ' + (lastPoint - firstPoint) + 'px;') + "top: 0; " + "left: 0; " + "bottom: 0; " + "right: 0; " + "position: absolute; ");

            svgParent.appendChild(svgEl);
        }

        /**
         * Line initialization
         */

    }, {
        key: 'init',
        value: function init() {
            var _this2 = this;

            this.connectingMagic(this.goThroughDots());
            var self = this;

            /**
             * If responsive option is true, line will be recalculated on resize
             */
            if (this.responsive === true) {
                window.addEventListener('resize', function () {
                    _this2.resize(self);
                });
            }
        }

        /**
         * Resize check
         */

    }, {
        key: 'resize',
        value: function resize(self) {
            document.getElementsByClassName('draad-line--' + self.element)[0].remove();
            this.connectingMagic(self.goThroughDots());
        }

        /**
         * Draad instance destroy()
         */

    }, {
        key: 'destroyDraad',
        value: function destroyDraad() {
            if (document.getElementsByClassName('draad-line--' + this.element)[0]) {
                document.getElementsByClassName('draad-line--' + this.element)[0].remove();
                window.removeEventListener('resize', this.resize);
                this.options = {};
            }
        }
    }, {
        key: 'destroy',
        get: function get() {
            return this.destroyDraad();
        }
    }]);

    return Draad;
}();

exports.default = Draad;