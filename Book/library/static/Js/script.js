document.getElementById('searchIcon').addEventListener('click', function() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('active');
    
    // وضع التركيز على حقل البحث عند ظهوره
    if (searchBar.classList.contains('active')) {
        searchBar.focus();
    }
});
// وظيفة لتطبيق الوضع المظلم على جميع العناصر
function applyDarkMode() {
    const elements = document.querySelectorAll('[data-dark-mode]');
    elements.forEach(el => {
        if (localStorage.getItem('darkMode') === 'light') {
            el.classList.add('light-mode');
        } else {
            el.classList.remove('light-mode');
        }
    });
}

// تطبيق الوضع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    applyDarkMode();
    
    // يمكنك إضافة المزيد من الأكواد هنا
    // مثلاً: أحداث النقر على القصص، البحث، إلخ.
    
    // مثال: إضافة حدث للنقر على بطاقات القصص
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach(card => {
        card.addEventListener('click', function() {
            // تنفيذ أي عمل عند النقر على بطاقة القصة
            console.log('تم النقر على قصة: ', this.querySelector('.story-title').textContent);
        });
    });
});