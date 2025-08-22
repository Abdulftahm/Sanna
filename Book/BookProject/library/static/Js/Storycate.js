document.addEventListener('DOMContentLoaded', function() {
    // تبديل قائمة الهاتف
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // تحويل الأشرطة إلى X
        const bars = this.querySelectorAll('.bar');
        if (this.classList.contains('active')) {
            bars[0].style.transform = 'translateY(9px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-9px) rotate(-45deg)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                
                const bars = hamburger.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });
    
    // تبديل شريط البحث
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', function() {
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        }
    });
    
    // إغلاق البحث عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!searchBtn.contains(e.target) && !searchInput.contains(e.target)) {
            searchInput.classList.remove('active');
        }
    });
    
    // تبديل الوضع المظلم/الفاتح
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // التنقل السلس للروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    // تكرار بطاقات القصص لإنشاء تأثير التمرير اللانهائي
function duplicateStoriesForScroll() {
    const container = document.querySelector('.stories-scroll-container');
    if (!container) return;

    const originalCards = Array.from(container.children);
    const containerWidth = container.offsetWidth;
    let totalWidth = 0;

    // حساب عرض البطاقات مجتمعة
    originalCards.forEach(card => {
        totalWidth += card.offsetWidth + 20; // 20 هو الفجوة بين البطاقات
    });

    // عدد التكرارات المطلوبة لتغطية الشاشة مرتين
    const neededCopies = Math.ceil((window.innerWidth * 2) / totalWidth);

    for (let i = 0; i < neededCopies; i++) {
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            container.appendChild(clone);
        });
    }
}

// تشغيل الوظيفة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', duplicateStoriesForScroll);
    
    // إعادة تحميل الصفحة عند تغيير حجم الشاشة لتجنب مشاكل القائمة
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            
            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
});