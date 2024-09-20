import random
import string
from database import change_password
import smtplib
from email.message import EmailMessage
from os import environ

EMAIL_SENDER=environ.get('EMAIL_SENDER')
EMAIL_PASSWORD=environ.get('EMAIL_PASSWORD')

def generate_password(length=10):
  return ''.join(random.choices(string.digits, k=length))

def update_user_password(user_id, email):
    new_password = generate_password()

    # Define email sender and receiver
    email_sender = EMAIL_SENDER
    email_password = EMAIL_PASSWORD
    email_receiver = email

    # Define email subject and body
    subject = 'New Password'
    body = f'Your new password is: {str(new_password)}'

    # Create the email message
    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = email_receiver
    em['Subject'] = subject
    em.set_content(body)

    # Set up the server
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()

    try:
        # Login to the email server
        server.login(email_sender, email_password)
        # Send the email
        server.send_message(em)
        server.quit()

        # updating the password in the database
        res = change_password(user_id,new_password)

        if res==True :
          return True
        else:
           return False
    except Exception as e:
        server.quit()
        print(f'Failed to send email: {e}')
        return False