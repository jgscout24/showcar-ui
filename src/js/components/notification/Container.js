class Container {

    /**
     * @event Container#onScroll
     * @param {String} target
     */
    constructor(target) {
        this.target        = target;
        this.targetHeight  = 0;
        this.element       = this.createElement('div', document.body, '', ['sc-notification-container']);
        this.notifications = [];

        this.updatePosition();

        $(document).on('scroll', this.onScroll.bind(this));
        $(this.target).on('DOMSubtreeModified propertychange', this.observeTargetHeight.bind(this));
    }

    /**
     * @returns {Array}
     */
    get childNodes() {
        return this.element.childNodes;
    }

    /**
     * @returns {Node}
     */
    remove() {
        return this.element.remove();
    }

    /**
     * @param {Notification} notification
     */
    addNotificationToTarget(notification) {
        this.element.appendChild(notification.element);
    }

    /**
     * @param {Notification} notification
     */
    addNotification(notification) {
        if (this.notifications.indexOf(notification) < 0) {
            this.notifications.push(notification);
        }
        this.addNotificationToTarget(notification);
    }

    /**
     * @param {Notification} notification
     * @returns {Array.<T>}
     */
    removeNotification(notification) {
        return this.notifications.splice(this.notifications.indexOf(notification), 1);
    }

    /**
     * @param {String} name
     * @param {String} body
     * @param {Array} classes
     * @param {HTMLElement} parent
     * @returns {Element}
     */
    createElement(name, parent, body, classes = []) {
        let element = document.createElement(name);

        classes.forEach((cls) => {
            element.classList.add(cls);
        });
        element.innerHTML = body;

        parent.appendChild(element);

        return element;
    }

    updatePosition() {
        if (!this.target) return;

        let target  = $(this.target);
        let offset  = target.offset();
        let width   = target.width();
        let element = $(this.element);

        this.targetHeight = offset.height;

        if ($(window).scrollTop() > (offset.top + offset.height)) {
            element.css({
                position: 'fixed',
                top: 0,
                width: width + 'px',
                left: offset.left + 'px'
            });
        } else {
            element.css({
                position: 'absolute',
                width: width + 'px',
                top: (offset.top + offset.height) + 'px',
                left: offset.left + 'px'
            });
        }
    }

    onScroll() {
        if ($('.show', this.element).length > 0) {
            this.updatePosition();
        }
    }

    observeTargetHeight() {
        let currentHeight = $(this.target).offset().height;
        if (this.targetHeight != currentHeight) {
            this.updatePosition();
        }
    }

}

module.exports = Container;
