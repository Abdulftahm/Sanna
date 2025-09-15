from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Book, Category, UserLibrary

# صفحات ثابتة
def index(request):
    return render(request, 'library/index.html')

# الصفحة الرئيسية - متاحة للجميع
def main_page(request):
    books = Book.objects.all()
    seo = None
    try:
        from .models import SEOSettings
        seo = SEOSettings.objects.filter(page_name="mainPage").first()
    except ImportError:
        pass
    return render(request, 'library/mainPage.html', {'books': books, 'seo': seo})

# حسابي - يحتاج تسجيل دخول
@login_required
def my_account(request):
    return render(request, 'library/MyAccount.html')

# مكتبتي - تحتاج تسجيل دخول
@login_required
def MyLibrary(request):
    user_library_books = UserLibrary.objects.filter(user=request.user)
    return render(request, 'library/MyLibrary.html', {'user_library_books': user_library_books})

# عرض جميع الكتب من قاعدة البيانات - متاح للجميع
def Storycate(request):
    books = Book.objects.all().order_by('-created_at')
    return render(request, 'library/Storycate.html', {'books': books})

# صفحة وصف الكتاب - متاحة للجميع
def description(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    return render(request, 'library/description.html', {'book': book})

# صفحة الاستماع - متاحة للجميع
def listen(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    return render(request, 'library/listen.html', {'book': book})

# عرض القصص بالفئات - متاح للجميع
def story_categories(request):
    books = Book.objects.all().order_by('-created_at')
    return render(request, 'library/Storycate.html', {'books': books})

# إضافة للمفضلة وإعادة التوجيه - يحتاج تسجيل دخول
@login_required
def add_to_favorites_and_redirect(request, book_id, action):
    book = get_object_or_404(Book, id=book_id)
    user = request.user

    user_library, created = UserLibrary.objects.get_or_create(user=user, book=book)
    user_library.is_favorite = True
    user_library.save()

    if action == 'listen':
        return redirect('listen', book_id=book.id)
    else:
        return redirect('description', book_id=book.id)

# تسجيل الدخول
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            messages.error(request, "المستخدم غير موجود")
            return redirect('index')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('main_page')
        else:
            messages.error(request, "بيانات الدخول غير صحيحة")
            return redirect('index')
    else:
        return redirect('index')

# إنشاء حساب جديد
def register_view(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if User.objects.filter(email=email).exists():
            messages.error(request, "البريد الإلكتروني مسجل مسبقاً")
            return redirect('index')

        username = email.split('@')[0]
        user = User.objects.create_user(username=username, email=email, password=password, first_name=name)
        user.save()
        messages.success(request, "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن.")
        return redirect('index')
    else:
        return redirect('index')

# تسجيل الخروج
@login_required
def logout_view(request):
    logout(request)
    messages.success(request, "تم تسجيل الخروج بنجاح.")
    return redirect('main_page')