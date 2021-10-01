from celery import task
from django.core.mail import send_mail
# from app.celery import app as celery_app


@task
def send_email(subject, message, recipient_list):
    print("sending")
    mail_send = send_mail(subject, message, from_email="", recipient_list=recipient_list)
    print("send")
    return mail_send
