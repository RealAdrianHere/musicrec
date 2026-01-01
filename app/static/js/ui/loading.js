const Loading = {
    show(container, message = '加载中...') {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading';
        loadingElement.innerHTML = `
            <div class="spinner"></div>
            <p>${message}</p>
        `;

        container.innerHTML = '';
        container.appendChild(loadingElement);
        return loadingElement;
    },

    hide(container) {
        const loadingElement = container.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    },

    showOverlay(message = '加载中...') {
        let overlay = document.getElementById('loading-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn 0.3s ease;
            `;
            
            overlay.innerHTML = `
                <div class="spinner" style="border-top-color: white; border-color: rgba(255, 255, 255, 0.2);"></div>
                <p style="color: white; margin-top: 20px; font-size: 16px;">${message}</p>
            `;
            
            document.body.appendChild(overlay);
        }

        return overlay;
    },

    hideOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    },

    showButtonLoading(button, originalText = '提交') {
        button.disabled = true;
        const btnText = button.querySelector('.btn-text') || button;
        
        if (!btnText.dataset.originalText) {
            btnText.dataset.originalText = btnText.textContent;
        }
        
        btnText.textContent = '加载中...';
        
        if (!button.querySelector('.spinner-sm')) {
            const spinner = document.createElement('span');
            spinner.className = 'spinner-sm';
            spinner.style.cssText = `
                display: inline-block;
                margin-left: 8px;
                vertical-align: middle;
                border: 2px solid rgba(255, 255, 255, 0.7);
                border-top-color: transparent;
                animation: spin 0.8s linear infinite;
            `;
            btnText.appendChild(spinner);
        }
    },

    hideButtonLoading(button) {
        button.disabled = false;
        const btnText = button.querySelector('.btn-text') || button;
        const spinner = btnText.querySelector('.spinner-sm');
        
        if (spinner) {
            spinner.remove();
        }
        
        if (btnText.dataset.originalText) {
            btnText.textContent = btnText.dataset.originalText;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Loading;
}
