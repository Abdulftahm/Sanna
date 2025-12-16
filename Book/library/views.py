from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Book, Category, UserLibrary, CustomUser, SEOSettings


def get_user_favorites(user):
    """Helper function to get list of favorite book IDs for a user"""
    if user.is_authenticated:
        return list(UserLibrary.objects.filter(
            user=user,
            is_favorite=True
        ).values_list('book_id', flat=True))
    return []


def index(request):
    """Landing page with login/register forms"""
    # Redirect authenticated users to main page
    if request.user.is_authenticated:
        return redirect('main_page')
    return render(request, 'library/index.html')


def main_page(request):
    """Main homepage - available to all visitors"""
    books = Book.objects.all()
    seo = SEOSettings.objects.filter(page_name="mainPage").first()
    favorite_ids = get_user_favorites(request.user)
    return render(request, 'library/mainPage.html', {
        'books': books,
        'seo': seo,
        'favorite_ids': favorite_ids
    })


@login_required
def my_account(request):
    """User account page - requires login"""
    return render(request, 'library/MyAccount.html')


@login_required
def my_library(request):
    """User's saved books - requires login"""
    user_library_books = UserLibrary.objects.filter(user=request.user)
    return render(request, 'library/MyLibrary.html', {'user_library_books': user_library_books})


def story_categories(request):
    """Display all books - available to all visitors"""
    books = Book.objects.all().order_by('-created_at')
    categories = Category.objects.all()
    favorite_ids = get_user_favorites(request.user)
    return render(request, 'library/Storycate.html', {
        'books': books,
        'categories': categories,
        'favorite_ids': favorite_ids
    })


def description(request, book_id):
    """Book description page - available to all visitors"""
    book = get_object_or_404(Book, id=book_id)
    favorite_ids = get_user_favorites(request.user)
    is_favorite = book.id in favorite_ids
    return render(request, 'library/description.html', {
        'book': book,
        'is_favorite': is_favorite
    })


def listen(request, book_id):
    """Audio player page - available to all visitors"""
    book = get_object_or_404(Book, id=book_id)
    favorite_ids = get_user_favorites(request.user)
    is_favorite = book.id in favorite_ids
    return render(request, 'library/listen.html', {
        'book': book,
        'is_favorite': is_favorite
    })


@login_required
def toggle_favorite(request, book_id, action):
    """Toggle book favorite status - requires login"""
    book = get_object_or_404(Book, id=book_id)
    user_library, created = UserLibrary.objects.get_or_create(user=request.user, book=book)

    # Toggle favorite status
    user_library.is_favorite = not user_library.is_favorite
    user_library.save()

    if action == 'listen':
        return redirect('listen', book_id=book.id)
    elif action == 'storycate':
        return redirect('Storycate')
    elif action == 'main':
        return redirect('main_page')
    return redirect('description', book_id=book.id)


def login_view(request):
    """Handle user login via email"""
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user_obj = CustomUser.objects.get(email=email)
            username = user_obj.username
        except CustomUser.DoesNotExist:
            messages.error(request, "المستخدم غير موجود")
            return redirect('index')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('main_page')
        else:
            messages.error(request, "بيانات الدخول غير صحيحة")
            return redirect('index')
    return redirect('index')


def register_view(request):
    """Handle new user registration"""
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if CustomUser.objects.filter(email=email).exists():
            messages.error(request, "البريد الإلكتروني مسجل مسبقاً")
            return redirect('index')

        # Generate unique username from email prefix
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        while CustomUser.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=name
        )
        messages.success(request, "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن.")
        return redirect('index')
    return redirect('index')


@login_required
def logout_view(request):
    """Handle user logout"""
    logout(request)
    messages.success(request, "تم تسجيل الخروج بنجاح.")
    return redirect('main_page')
