const Notification = {
    currentNotification: null,
    timeoutId: null,
    hideTimeoutId: null,

    show(message, type = Constants.NOTIFICATION_TYPES.INFO, duration = Config.NOTIFICATION.DURATION) {
        if (this.currentNotification) {
            const current = this.currentNotification;
            this.currentNotification = null;
            
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }

            current.style.animation = 'slideOutRight 0.3s ease';
            
            setTimeout(() => {
                if (current.parentNode) {
                    current.parentNode.removeChild(current);
                }
            }, 300);

            setTimeout(() => {
                this._show(message, type, duration);
            }, 50);
        } else {
            this._show(message, type, duration);
        }
    },

    _show(message, type, duration) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            maxWidth: '350px',
            wordWrap: 'break-word'
        });

        notification.style.animation = 'slideInRight 0.3s ease';

        const bgColor = Constants.NOTIFICATION_COLORS[type] || Constants.NOTIFICATION_COLORS.info;
        notification.style.backgroundColor = bgColor;

        document.body.appendChild(notification);
        this.currentNotification = notification;

        this.timeoutId = setTimeout(() => {
            this.hide();
        }, duration);
    },

    hide() {
        if (this.currentNotification) {
            this.currentNotification.style.animation = 'slideOutRight 0.3s ease';
            
            setTimeout(() => {
                if (this.currentNotification && this.currentNotification.parentNode) {
                    this.currentNotification.parentNode.removeChild(this.currentNotification);
                }
                this.currentNotification = null;
            }, 300);
        }

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    },

    success(message, duration) {
        this.show(message, Constants.NOTIFICATION_TYPES.SUCCESS, duration);
    },

    error(message, duration) {
        this.show(message, Constants.NOTIFICATION_TYPES.ERROR, duration);
    },

    warning(message, duration) {
        this.show(message, Constants.NOTIFICATION_TYPES.WARNING, duration);
    },

    info(message, duration) {
        this.show(message, Constants.NOTIFICATION_TYPES.INFO, duration);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Notification;
}
