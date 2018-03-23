export default class Draad {
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
    constructor(element, options = {}) {
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
    findAncestor(element, cls) {
        while ((element = element.parentElement) && !element.classList.contains(cls)) {
            return element;
        }
    }

    /**
     * It goes through elements and creates points with coordinates
     * @returns {Array}
     */
    goThroughDots() {
        let dots = document.getElementsByClassName(this.element);
        let points = [];
        let offsetX = this.offsetX;
        let offsetY = this.offsetY;

        if (this.parent === document.getElementsByTagName('body')[0]) {
            for (let i = 0; i < dots.length; i++) {
                let currentDot = document.getElementsByClassName(this.element)[i];
                let sampleDotOffsetX = offsetX || currentDot.offsetWidth / 2;
                let sampleDotOffsetY = offsetY || currentDot.offsetHeight / 2;
                let currentDotX = parseInt(currentDot.getBoundingClientRect().left + sampleDotOffsetX, 10);
                let currentDotY = parseInt(currentDot.getBoundingClientRect().top + sampleDotOffsetY, 10);
                points.push([currentDotX, currentDotY]);
            }
        } else {
            for (let i = 0; i < dots.length; i++) {
                let currentDot = document.getElementsByClassName(this.element)[i];
                let sampleDotOffsetX = offsetX || currentDot.offsetWidth / 2;
                let sampleDotOffsetY = offsetY || currentDot.offsetHeight / 2;
                let currentDotX = parseInt(currentDot.offsetLeft + sampleDotOffsetX, 10);
                let currentDotY = parseInt(currentDot.offsetTop + sampleDotOffsetY, 10);
                points.push([currentDotX, currentDotY]);
            }
        }

        return points;
    }

    /**
     * @param {array} points
     */
    connectingMagic(points) {
        const smoothing = this.smoothing || 0.2;
        const svgParent = this.parent;

        const line = (pointA, pointB) => {
            const lengthX = pointB[0] - pointA[0];
            const lengthY = pointB[1] - pointA[1];
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
        const controlPoint = (current, previous, next, reverse) => {
            const prev = previous || current;
            const nex = next || current;

            const l = line(prev, nex);

            const angle = l.angle + (reverse ? Math.PI : 0);
            const length = l.length * smoothing;

            const xAxis = current[0] + Math.cos(angle) * length;
            const yAxis = current[1] + Math.sin(angle) * length;
            return [xAxis, yAxis];
        };

        /**
         * @param point
         * @param i
         * @param a
         * @returns {string}
         */
        const bezierCommand = (point, i, a) => {
            const cps = controlPoint(a[i - 1], a[i - 2], point);
            const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
            return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
        };

        /**
         * @param points
         * @param command
         * @param {string} dAttr
         * @returns {*}
         */
        const svgPath = (points, command) => {
            const dAttr = points.reduce((acc, point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${command(point, i, a)}`, "");
            return dAttr;
        };

        const xmlns = "http://www.w3.org/2000/svg";
        const svgEl = document.createElementNS(xmlns, "svg");
        svgEl.setAttribute('class', `draad-line draad-line--${this.element}`);
        const path = document.createElementNS(xmlns, "path");
        path.setAttribute('d', svgPath(points, bezierCommand));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'black');
        svgEl.appendChild(path);

        const fill = this.fill;
        const lineColor = this.color;
        const lineWidth = this.lineWidth;
        const lineOpacity = this.lineOpacity;
        const lineDasharray = this.dasharray;
        const linecap = this.cap;

        path.setAttribute(
            "style",
            `fill: ${fill}; ` +
            `stroke: ${lineColor}; ` +
            `stroke-width: ${lineWidth};` +
            `stroke-opacity: ${lineOpacity};` +
            `stroke-dasharray: ${lineDasharray};` +
            `stroke-linecap: ${linecap}`
        );

        svgEl.setAttribute(
            "style",
            "width: 100%; " +
            "height: 100%; " +
            "top: 0; " +
            "left: 0; " +
            "bottom: 0; " +
            "right: 0; " +
            "position: absolute; "
        );

        svgParent.appendChild(svgEl);
    }

    /**
     * Line initialization
     */
    init() {
        this.connectingMagic(this.goThroughDots());

        let self = this;

        /**
         * If responsive option is true, line will be recalculated on resize
         */
        if (this.responsive === true) {
            window.addEventListener('resize', () => {
                this.resize(self);
            });
        }
    }

    /**
     * Resize check
     */
    resize(self) {
        document.getElementsByClassName(`draad-line--${self.element}`)[0].remove();
        this.connectingMagic(self.goThroughDots());
    }

    /**
     * Draad instance destroy()
     */
    destroyDraad() {
        window.removeEventListener('resize', this.resize);
        this.options = {};
        document.getElementsByClassName(`draad-line--${this.element}`)[0].remove();
    }

    get destroy() {
        return this.destroyDraad();
    }
}


