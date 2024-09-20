import random
import string
import smtplib
from email.message import EmailMessage
from os import environ

EMAIL_SENDER=environ.get('EMAIL_SENDER')
EMAIL_PASSWORD=environ.get('EMAIL_PASSWORD')

otp_database = {} # In-memory database to store OTP codes

def generate_otp(length=4):
  return ''.join(random.choices(string.digits, k=length))

def send_otp(email):
  otp = generate_otp()
  otp_database[email] = otp

  #logic for email sent

  # Define email sender and receiver
  email_sender = EMAIL_SENDER
  email_password = EMAIL_PASSWORD
  email_receiver = email

  # Define email subject and body
  subject = 'OTP for account Verification'
  body = str(otp)

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
    return True
  except Exception as e:
    server.quit()
    return False


def verify_otp(email, entered_otp):
  stored_otp = otp_database.get(email)
  if stored_otp and stored_otp == entered_otp:
    return True
  else:
    return False
