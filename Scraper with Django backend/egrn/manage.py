#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import logging
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'egrn.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

    User = get_user_model()
    try:
        User.objects.get(username=os.getenv("SUPERUSER"))
        print('superuser is already exist')
    except ObjectDoesNotExist:
        password = os.getenv("SUPERUSER_PASSWORD")
        User.objects.create_superuser(os.getenv("SUPERUSER"), "alex@cherishdev.com", password)


if __name__ == '__main__':
    main()
