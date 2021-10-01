from django.core.cache import cache
import string
import random
from django.core.mail import send_mail
import re

def deleteCache(prefix=None, key=None):
    if prefix:
        cache.clear()
    if key:
        cache.delete(key)

def generate_code(size=6, chars=string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def send_email(subject, message, recipient):
    send_mail(subject = subject, message = message, recipient_list=recipient)


def standard_string(s):
    s = s.strip()
    return re.sub(' +', ' ', s)





