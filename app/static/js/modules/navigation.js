const Navigation = {
    currentSection: null,

    init() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.bindEvents();
        this.setActiveSection(Constants.NAVIGATION_SECTIONS.DISCOVER);
    },

    bindEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });
    },

    handleNavClick(event, link) {
        event.preventDefault();
        const targetSection = link.getAttribute('data-section');
        this.setActiveSection(targetSection);
    },

    setActiveSection(sectionId) {
        if (this.currentSection === sectionId) return;

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        this.sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });

        this.currentSection = sectionId;
    },

    getActiveSection() {
        return this.currentSection;
    },

    navigateTo(sectionId) {
        const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}
