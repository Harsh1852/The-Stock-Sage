import boto3
import bcrypt
import pandas as pd
from decimal import Decimal
from os import environ

AWS_ACCESS_KEY_ID=environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY=environ.get('AWS_SECRET_ACCESS_KEY')
AWS_REGION=environ.get('AWS_REGION')

# Specify your AWS credentials
aws_access_key_id = AWS_ACCESS_KEY_ID
aws_secret_access_key = AWS_SECRET_ACCESS_KEY

# Specify the AWS region
region = "ap-south-1" #AWS_REGION

# Creating a Boto3 session with the specified credentials and region
session = boto3.Session(
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region
)

# Create the DynamoDB resource using the session
dynamodb_resource = session.resource('dynamodb')

# Create a DynamoDB client using the session
dynamodb_client = session.client('dynamodb')

# Retrieve all items using the scan method

def scan_user_data():
    # Defining the table to use
    table = dynamodb_resource.Table('user_data')
    response = table.scan()
    for item in response['Items']:
        print(item)

def scan_transaction_data():
    # Defining the table to use
    table = dynamodb_resource.Table('transaction_data')
    response = table.scan()
    for item in response['Items']:
        print(item)

# generating the password hash

def generate_password_hash(string):
    hashed_bytes = bcrypt.hashpw(string.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')

# verifying the entered password

def verify_password(string, user_id):
    item = get_item_from_user_data(user_id)
    stored_hashed_password_str = item['password']['S']

    # Convert the string to a byte string
    stored_hashed_password_bytes = stored_hashed_password_str.encode('utf-8')
    password_entered_by_user = string
    if bcrypt.checkpw(password_entered_by_user.encode('utf-8'), stored_hashed_password_bytes):
        return True
    else:
        return False

# inserting the item if the primary key (user_id) does not exist

def insert_into_user_data(user_id, password, name, email, mobile):
    # Defining the table to use
    table = dynamodb_resource.Table('user_data')
    try:
        response = table.put_item(
            Item={
                'user_id': user_id,
                'password': generate_password_hash(password),
                'name': name,
                'email': email,
                'mobile': mobile

            },
            ConditionExpression='attribute_not_exists(user_id)'  # Ensures user id doesn't already exist
        )
        return True
    except Exception as e:
        print("Error:", e)
        return False

# returning the greatest sr_no for the user_id else -1

def g_sr_no(user_id):
    data = get_item_from_transaction_data(user_id)
    lt = []
    for i in data:
        lt.append(int(i['sr_no']['N']))
    if lt:
        return max(lt)
    else:
        return (-1)

# inserting item with sr_no automatically increasing if the primary key (sr_no) does not exist

def insert_into_transaction_data(user_id, date, action, price, quantity, stock_name):
    try:
        company = pd.read_csv("company_names.csv")
        company = company[company['Company Name'] == stock_name]
        stock_symbol = company['Symbol'].iloc[0]
        table = dynamodb_resource.Table('transaction_data')
        gsn = int(g_sr_no(user_id))+1
        response = table.put_item(
            Item={
                'sr_no': gsn,
                'user_id': user_id,
                'action': action,
                'quantity': quantity,
                'price': Decimal(str(price)),
                'stock_name': stock_name,
                'stock_symbol': stock_symbol,
                'date': date
            },
            ConditionExpression='attribute_not_exists(sr_no)'  # Ensures user id doesn't already exist
        )
        return True
    except Exception as e:
        print("Error:", e)
        return False


# Get the item

def get_item_from_user_data(user_id):
    response = dynamodb_client.get_item(
        TableName='user_data',
        Key={'user_id': {'S': f'{user_id}'}},
        ConsistentRead=True  # Set to True for strongly consistent read
    )

    item = response.get('Item', {})
    return item

def get_item_from_transaction_data(user_id):
    response = dynamodb_client.scan(
        TableName='transaction_data',
        FilterExpression='user_id = :user_id',
        ExpressionAttributeValues={
            ':user_id': {'S': user_id}
        },
        ConsistentRead=True  # Set to True for strongly consistent read
    )
    items = response.get('Items', [])
    return items


# Delete the item

def delete_from_user_data(user_id):
    response = dynamodb_client.delete_item(
        TableName='user_data',
        Key={'user_id': {'S': f'{user_id}'}}
    )
    print(f"Response: {response}")
    if response.get("ResponseMetadata").get("HTTPStatusCode") == 200:
        return True
    else:
        return False


def delete_from_transaction_data(sr_no, user_id):
    response = dynamodb_client.delete_item(
        TableName='transaction_data',
        Key={
            'sr_no': {'N': str(sr_no)},
            'user_id': {'S': user_id}
        }
    )
    print(f"Response: {response}")
    if response.get("ResponseMetadata").get("HTTPStatusCode") == 200:
        return True
    else:
        return False


# update the password
def update_password(user_id, old_password, new_password):
    if verify_password(old_password, user_id):
        response = dynamodb_client.update_item(
            TableName='user_data',
            Key={
                'user_id': {'S': user_id}
            },
            UpdateExpression='SET #password = :new_password',
            ExpressionAttributeNames={
                '#password': 'password'
            },
            ExpressionAttributeValues={
                ':new_password': {'S': generate_password_hash(new_password)}
            },
            ReturnValues='ALL_NEW'  # Change to 'UPDATED_NEW' if you only want the updated attributes
        )
        if response.get("ResponseMetadata").get("HTTPStatusCode") == 200:
            return True
        else:
            return False
    else:
        return False

def update_user_info(user_id, password, new_name, new_email, new_mobile):
    if verify_password(password, user_id):
        update_expression = 'SET #name = :new_name, #email = :new_email, #mobile = :new_mobile'
        expression_attribute_names = {
            '#name': 'name',
            '#email': 'email',
            '#mobile': 'mobile'
        }
        expression_attribute_values = {
            ':new_name': {'S': new_name},
            ':new_email': {'S': new_email},
            ':new_mobile': {'N': str(new_mobile)}
        }
        response = dynamodb_client.update_item(
            TableName='user_data',
            Key={
                'user_id': {'S': user_id}
            },
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues='ALL_NEW'  # Change to 'UPDATED_NEW' if you only want the updated attributes
        )
        if response.get("ResponseMetadata").get("HTTPStatusCode") == 200:
            return True
        else:
            return False
    else:
        return False

#this function is used to update password for forgot password page
def change_password(user_id, new_password):
    hashed_password = generate_password_hash(new_password)

    # Define the update expression and attribute values
    update_expression = 'SET #password = :new_password'
    expression_attribute_names = {
        '#password': 'password'
    }
    expression_attribute_values = {
        ':new_password': {'S': hashed_password}
    }
    # Perform the update operation
    response = dynamodb_client.update_item(
        TableName='user_data',
        Key={
            'user_id': {'S': user_id}
        },
        UpdateExpression=update_expression,
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values,
        ReturnValues='ALL_NEW'  # Change to 'UPDATED_NEW' if you only want the updated attributes
    )
    # Check if the update was successful
    if response.get("ResponseMetadata").get("HTTPStatusCode") == 200:
        return True
    else:
        return False