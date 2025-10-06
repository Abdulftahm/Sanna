from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('description/<int:book_id>/', views.description, name='description'),
    path('listen/<int:book_id>/', views.listen, name='listen'),  # ربط الاستماع بكتاب
    path('main/', views.main_page, name='main_page'),
    path('my-account/', views.my_account, name='my_account'),
    path('MyLibrary/', views.MyLibrary, name='MyLibrary'),
    path('storycate/', views.story_categories, name='Storycate'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('add_favorite/<int:book_id>/<str:action>/', views.add_to_favorites_and_redirect, name='add_favorite'),

]
