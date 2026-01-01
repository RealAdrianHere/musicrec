const Categories = {
    init() {
        this.categoryCards = document.querySelectorAll('.category-card');
        this.bindEvents();
    },

    bindEvents() {
        this.categoryCards.forEach(card => {
            card.addEventListener('click', (e) => this.handleCategoryClick(e, card));
        });
    },

    handleCategoryClick(event, card) {
        const categoryName = card.querySelector('.category-name').textContent;
        const category = Object.values(Constants.MUSIC_CATEGORIES).find(
            cat => cat.name === categoryName
        );

        if (!category) return;

        this.animateCard(card);
        this.navigateToRecommendation(category);
    },

    animateCard(card) {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 100);
    },

    navigateToRecommendation(category) {
        Notification.show(`点击了${category.name}分类`, Constants.NOTIFICATION_TYPES.INFO);

        Navigation.navigateTo(Constants.NAVIGATION_SECTIONS.MOOD_RECOMMENDATION);

        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.value = category.text;
            textInput.dispatchEvent(new Event('input'));
        }
    },

    getCategoryByName(name) {
        return Object.values(Constants.MUSIC_CATEGORIES).find(
            category => category.name === name
        );
    },

    getAllCategories() {
        return Object.values(Constants.MUSIC_CATEGORIES);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Categories;
}
