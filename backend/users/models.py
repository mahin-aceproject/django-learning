from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from .managers import UserManager

class UserModel(AbstractUser):
    def __str__(self):
        return "<UserModel object> = " + self.email
    
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    email = models.EmailField(unique=True, max_length=255, default='')
    username = None
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [ 'password' ]
    
    objects = UserManager()
    
    class Meta:
        db_table = "Users"
        verbose_name = "User"
        verbose_name_plural = "Users"
    