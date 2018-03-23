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
     */
    function Draad(element) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Draad);

        this.element = element;
        this.parent = this.findAncestor(document.getElementsByClassName(element)[0], options.parentClass) || document.getElementsByTagName('body')[0];
        this.smoothing = options.smoothing;
        this.offsetX = options.offsetX;
        this.offsetY = options.offsetY;
        this.fill = options.fill;
        this.color = options.color;
        this.lineWidth = options.lineWidth;
        this.lineOpacity = options.lineOpacity;
        this.dasharray = options.dasharray;
        this.cap = options.cap;
        this.responsive = options.responsive;
        this.options = options;

        this.init();
    }

    /**
     * @param {*} element
     * @param {string} cls
     * @returns {*}
     */


    _createClass(Draad, [{
        key: 'findAncestor',
        value: function findAncestor(element, cls) {
            while ((element = element.parentElement) && !element.classList.contains(cls)) {
                return element;
            }
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

            if (this.parent === document.getElementsByTagName('body')[0]) {
                for (var i = 0; i < dots.length; i++) {
                    var currentDot = document.getElementsByClassName(this.element)[i];
                    var sampleDotOffsetX = offsetX || currentDot.offsetWidth / 2;
                    var sampleDotOffsetY = offsetY || currentDot.offsetHeight / 2;
                    var currentDotX = parseInt(currentDot.getBoundingClientRect().left + sampleDotOffsetX, 10);
                    var currentDotY = parseInt(currentDot.getBoundingClientRect().top + sampleDotOffsetY, 10);
                    points.push([currentDotX, currentDotY]);
                }
            } else {
                for (var _i = 0; _i < dots.length; _i++) {
                    var _currentDot = document.getElementsByClassName(this.element)[_i];
                    var _sampleDotOffsetX = offsetX || _currentDot.offsetWidth / 2;
                    var _sampleDotOffsetY = offsetY || _currentDot.offsetHeight / 2;
                    var _currentDotX = parseInt(_currentDot.offsetLeft + _sampleDotOffsetX, 10);
                    var _currentDotY = parseInt(_currentDot.offsetTop + _sampleDotOffsetY, 10);
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
            var smoothing = this.smoothing || 0.2;
            var svgParent = this.parent;

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

            svgEl.setAttribute("style", "width: 100%; " + "height: 100%; " + "top: 0; " + "left: 0; " + "bottom: 0; " + "right: 0; " + "position: absolute; ");

            svgParent.appendChild(svgEl);
        }

        /**
         * Line initialization
         */

    }, {
        key: 'init',
        value: function init() {
            var _this = this;

            this.connectingMagic(this.goThroughDots());

            var self = this;

            /**
             * If responsive option is true, line will be recalculated on resize
             */
            if (this.responsive === true) {
                window.addEventListener('resize', function () {
                    _this.resize(self);
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
            window.removeEventListener('resize', this.resize);
            this.options = {};
            document.getElementsByClassName('draad-line--' + this.element)[0].remove();
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