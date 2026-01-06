const User = {
    defaultUsername: '用户1',
    defaultAvatar: null,
    currentPage: 1,
    listeners: new Set(),

    init() {
        this.loadDefaultAvatar();
        this.render();
        this.bindEvents();
        this.setupStorageListener();
    },

    loadDefaultAvatar() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 200, 200);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 200);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 80px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👤', 100, 100);

        this.defaultAvatar = canvas.toDataURL('image/png');
    },

    getProfile() {
        try {
            const profile = localStorage.getItem(Config.STORAGE_KEYS.USER_PROFILE);
            if (profile) {
                return JSON.parse(profile);
            }
            return this.getDefaultProfile();
        } catch (error) {
            console.error('Error reading user profile:', error);
            return this.getDefaultProfile();
        }
    },

    getDefaultProfile() {
        return {
            username: this.defaultUsername,
            avatar: this.defaultAvatar,
            updatedAt: null
        };
    },

    saveProfile(profile) {
        try {
            profile.updatedAt = new Date().toISOString();
            localStorage.setItem(Config.STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
            this.notifyListeners('update', profile);
            return true;
        } catch (error) {
            console.error('Error saving user profile:', error);
            return false;
        }
    },

    getUsername() {
        const profile = this.getProfile();
        return profile.username || this.defaultUsername;
    },

    setUsername(username) {
        const validation = this.validateUsername(username);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        const sanitizedUsername = this.sanitizeUsername(username);
        const profile = this.getProfile();
        profile.username = sanitizedUsername;

        if (this.saveProfile(profile)) {
            Notification.show(
                Constants.SUCCESS_MESSAGES.USERNAME_UPDATED,
                Constants.NOTIFICATION_TYPES.SUCCESS,
                3000
            );
            return { success: true };
        } else {
            return { success: false, error: '保存失败，请稍后重试' };
        }
    },

    validateUsername(username) {
        if (!username || username.trim().length === 0) {
            return { valid: false, error: '用户名不能为空' };
        }

        const trimmedUsername = username.trim();
        const length = this.getTextLength(trimmedUsername);

        if (length < Config.LIMITS.USERNAME_MIN_LENGTH) {
            return { valid: false, error: `用户名至少需要 ${Config.LIMITS.USERNAME_MIN_LENGTH} 个字符` };
        }

        if (length > Config.LIMITS.USERNAME_MAX_LENGTH) {
            return { valid: false, error: `用户名不能超过 ${Config.LIMITS.USERNAME_MAX_LENGTH} 个字符` };
        }

        const invalidPattern = /[<>'"\\{}[\]|`^~#%&*=]/g;
        if (invalidPattern.test(trimmedUsername)) {
            return { valid: false, error: '用户名包含非法字符，请使用中文、英文、数字或常用符号' };
        }

        return { valid: true };
    },

    sanitizeUsername(username) {
        let sanitized = username.trim();

        sanitized = sanitized.replace(/[<>'"\\{}[\]|`^~#%&*=]/g, '');

        sanitized = sanitized.replace(/\s+/g, ' ');

        if (this.getTextLength(sanitized) > Config.LIMITS.USERNAME_MAX_LENGTH) {
            sanitized = this.truncateByLength(sanitized, Config.LIMITS.USERNAME_MAX_LENGTH);
        }

        return sanitized;
    },

    getTextLength(str) {
        let length = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            if (char > 0xFFFF) {
                length += 2;
            } else if (char > 0x7F) {
                length += 2;
            } else {
                length += 1;
            }
        }
        return length;
    },

    truncateByLength(str, maxLength) {
        let length = 0;
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            const charLength = (char > 0xFFFF || char > 0x7F) ? 2 : 1;
            if (length + charLength > maxLength) {
                break;
            }
            result += str[i];
            length += charLength;
        }
        return result;
    },

    getAvatar() {
        const profile = this.getProfile();
        return profile.avatar || this.defaultAvatar;
    },

    setAvatar(avatarDataUrl) {
        if (!avatarDataUrl) {
            return { success: false, error: '头像数据无效' };
        }

        try {
            const profile = this.getProfile();
            profile.avatar = avatarDataUrl;

            if (this.saveProfile(profile)) {
                Notification.show(
                    Constants.SUCCESS_MESSAGES.AVATAR_UPDATED,
                    Constants.NOTIFICATION_TYPES.SUCCESS,
                    3000
                );
                return { success: true };
            } else {
                return { success: false, error: '保存失败，请稍后重试' };
            }
        } catch (error) {
            console.error('Error setting avatar:', error);
            return { success: false, error: '处理头像时发生错误' };
        }
    },

    processAvatar(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('请选择要上传的头像'));
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                reject(new Error('请选择 JPG、PNG、GIF 或 WebP 格式的图片'));
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                reject(new Error('图片大小不能超过 5MB'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const targetSize = Config.LIMITS.AVATAR_SIZE;
                    canvas.width = targetSize;
                    canvas.height = targetSize;

                    let x = 0, y = 0, width = img.width, height = img.height;

                    const minDim = Math.min(img.width, img.height);
                    width = minDim;
                    height = minDim;
                    x = (img.width - minDim) / 2;
                    y = (img.height - minDim) / 2;

                    ctx.drawImage(img, x, y, width, height, 0, 0, targetSize, targetSize);

                    try {
                        const dataUrl = canvas.toDataURL('image/png', Config.LIMITS.AVATAR_QUALITY);
                        resolve(dataUrl);
                    } catch (error) {
                        reject(new Error('头像处理失败，请重试'));
                    }
                };

                img.onerror = () => {
                    reject(new Error('无法加载图片，请选择其他文件'));
                };

                img.src = e.target.result;
            };

            reader.onerror = () => {
                reject(new Error('读取文件失败，请重试'));
            };

            reader.readAsDataURL(file);
        });
    },

    resetProfile() {
        const defaultProfile = this.getDefaultProfile();
        if (this.saveProfile(defaultProfile)) {
            Notification.show(
                '已恢复默认设置',
                Constants.NOTIFICATION_TYPES.INFO,
                3000
            );
            this.render();
            return { success: true };
        }
        return { success: false, error: '重置失败，请稍后重试' };
    },

    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    },

    notifyListeners(eventType, data = {}) {
        this.listeners.forEach(callback => {
            try {
                callback(eventType, data);
            } catch (error) {
                console.error('User listener error:', error);
            }
        });
    },

    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === Config.STORAGE_KEYS.USER_PROFILE) {
                this.notifyListeners('update', this.getProfile());
                this.render();
            }
        });
    },

    render() {
        const usernameElement = document.getElementById('username');
        const avatarElement = document.querySelector('.avatar img');
        const avatarIconElement = document.querySelector('.avatar-icon');

        if (usernameElement) {
            usernameElement.textContent = this.getUsername();
        }

        const avatar = this.getAvatar();
        if (avatarElement) {
            avatarElement.src = avatar;
            avatarElement.style.display = 'block';
            if (avatarIconElement) {
                avatarIconElement.style.display = 'none';
            }
        } else if (avatarIconElement) {
            const avatarContainer = avatarIconElement.parentElement;
            if (avatar !== this.defaultAvatar) {
                avatarIconElement.style.display = 'none';
                avatarContainer.style.backgroundImage = `url(${avatar})`;
                avatarContainer.style.backgroundSize = 'cover';
                avatarContainer.style.backgroundPosition = 'center';
            }
        }
    },

    bindEvents() {
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.showEditModal();
            });
        }

        const usernameEditBtn = document.getElementById('username-edit-btn');
        if (usernameEditBtn) {
            usernameEditBtn.addEventListener('click', () => {
                this.showEditModal();
            });
        }

        const closeModalBtn = document.getElementById('close-edit-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.hideEditModal();
            });
        }

        const saveUsernameBtn = document.getElementById('save-username');
        if (saveUsernameBtn) {
            saveUsernameBtn.addEventListener('click', () => {
                this.handleSaveUsername();
            });
        }

        const avatarInput = document.getElementById('avatar-upload');
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                this.handleAvatarUpload(e);
            });
        }

        const dropZone = document.getElementById('avatar-drop-zone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file) {
                    this.processAvatar(file)
                        .then(avatarDataUrl => {
                            const result = this.setAvatar(avatarDataUrl);
                            if (result.success) {
                                this.updateAvatarPreview(avatarDataUrl);
                            } else {
                                Notification.show(result.error, Constants.NOTIFICATION_TYPES.ERROR, 5000);
                            }
                        })
                        .catch(error => {
                            Notification.show(error.message, Constants.NOTIFICATION_TYPES.ERROR, 5000);
                        });
                }
            });

            dropZone.addEventListener('click', () => {
                avatarInput.click();
            });
        }

        const closeModalOnBackdrop = document.getElementById('edit-profile-modal');
        if (closeModalOnBackdrop) {
            closeModalOnBackdrop.addEventListener('click', (e) => {
                if (e.target === closeModalOnBackdrop) {
                    this.hideEditModal();
                }
            });
        }

        const usernameInput = document.getElementById('username-input');
        if (usernameInput) {
            usernameInput.addEventListener('input', (e) => {
                this.handleUsernameInput(e.target.value);
            });

            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSaveUsername();
                }
            });
        }

        const resetBtn = document.getElementById('reset-profile-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('确定要恢复默认设置吗？此操作不可恢复。')) {
                    this.resetProfile();
                }
            });
        }
    },

    showEditModal() {
        const modal = document.getElementById('edit-profile-modal');
        const usernameInput = document.getElementById('username-input');
        const avatarPreview = document.getElementById('avatar-preview');

        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        if (usernameInput) {
            usernameInput.value = this.getUsername();
            usernameInput.focus();
        }

        if (avatarPreview) {
            avatarPreview.src = this.getAvatar();
        }

        this.updateUsernameValidation('');
    },

    hideEditModal() {
        const modal = document.getElementById('edit-profile-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    },

    handleUsernameInput(value) {
        this.updateUsernameValidation(value);
    },

    updateUsernameValidation(value) {
        const validationResult = this.validateUsername(value);
        const feedbackElement = document.getElementById('username-feedback');
        const saveBtn = document.getElementById('save-username');

        if (feedbackElement) {
            if (value.length === 0) {
                feedbackElement.textContent = '';
                feedbackElement.className = 'validation-feedback';
            } else if (validationResult.valid) {
                const length = this.getTextLength(value);
                const remaining = Config.LIMITS.USERNAME_MAX_LENGTH - length;
                feedbackElement.textContent = `还可以输入 ${remaining} 个字符`;
                feedbackElement.className = 'validation-feedback valid';
            } else {
                feedbackElement.textContent = validationResult.error;
                feedbackElement.className = 'validation-feedback invalid';
            }
        }

        if (saveBtn) {
            saveBtn.disabled = !validationResult.valid || value.length === 0;
        }
    },

    handleSaveUsername() {
        const usernameInput = document.getElementById('username-input');
        if (!usernameInput) return;

        const username = usernameInput.value.trim();
        const result = this.setUsername(username);

        if (result.success) {
            this.render();
            this.hideEditModal();
        } else {
            Notification.show(result.error, Constants.NOTIFICATION_TYPES.ERROR, 5000);
        }
    },

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.processAvatar(file)
            .then(avatarDataUrl => {
                const result = this.setAvatar(avatarDataUrl);
                if (result.success) {
                    this.updateAvatarPreview(avatarDataUrl);
                } else {
                    Notification.show(result.error, Constants.NOTIFICATION_TYPES.ERROR, 5000);
                }
            })
            .catch(error => {
                Notification.show(error.message, Constants.NOTIFICATION_TYPES.ERROR, 5000);
            });

        event.target.value = '';
    },

    updateAvatarPreview(avatarDataUrl) {
        const avatarPreview = document.getElementById('avatar-preview');
        if (avatarPreview) {
            avatarPreview.src = avatarDataUrl;
        }

        const avatarElements = document.querySelectorAll('.avatar img, .user-avatar');
        avatarElements.forEach(el => {
            el.src = avatarDataUrl;
        });

        const avatarIconElements = document.querySelectorAll('.avatar-icon');
        avatarIconElements.forEach(el => {
            el.style.display = 'none';
        });
    },

    updateAvatarDisplay() {
        const avatarContainer = document.querySelector('.avatar');
        if (!avatarContainer) return;

        const avatar = this.getAvatar();
        if (avatar && avatar !== this.defaultAvatar) {
            let img = avatarContainer.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                img.className = 'user-avatar';
                img.alt = '用户头像';
                avatarContainer.innerHTML = '';
                avatarContainer.appendChild(img);
            }
            img.src = avatar;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = User;
}
