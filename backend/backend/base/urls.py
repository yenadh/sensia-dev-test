from django.urls import path

from .views import (
    CustomTokenObtainPairView, 
    CustomTokenRefreshView, 
    logout, is_logged_in, 
    users, 
    get_user_by_id,
    update_user, 
    soft_delete_user, 
    pages,
    get_user_page_permission, 
    list_user_access,
    assign_page_permission,
    list_all_access, 
    send_verification_email, 
    verify_otp, reset_password,
    get_user_page_permission_by_id,
    create_comment, edit_comment, delete_comment, list_comments) 

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout),
    path('authenticated/', is_logged_in),

    path('verify/send-otp/', send_verification_email, name='send_otp'),
    path('verify/confirm-otp/', verify_otp, name='confirm_otp'),
    path('verify/reset-password/', reset_password),

    path('users/', users, name='users'),
    path('users/<int:user_id>', get_user_by_id, name='users'),
    path('users/<int:user_id>/update/', update_user, name='update_user'),
    path('users/<int:user_id>/delete/', soft_delete_user, name='soft_delete_user'),

    path('pages/', pages, name='pages'),
    path('user-page-permission/', get_user_page_permission, name='user-page-permission'),  # POST view
    path('user-page-permission/by-user/', get_user_page_permission_by_id, name='user_page_permission_by_id'),  # GET view
    path('access/', assign_page_permission, name='assign-page-access'),
    path('access/all/', list_all_access, name='list-all-access'),

    path('access/list/', list_user_access, name='list_user_access'),

     path('comments/', list_comments, name='list_comments'),
    path('comments/create/', create_comment, name='create_comment'),
    path('comments/<int:comment_id>/edit/', edit_comment, name='edit_comment'),
    path('comments/<int:comment_id>/delete/', delete_comment, name='delete_comment'),
]