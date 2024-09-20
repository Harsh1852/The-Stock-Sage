from database import insert_into_user_data, insert_into_transaction_data, get_item_from_user_data, get_item_from_transaction_data, delete_from_user_data, delete_from_transaction_data, update_user_info, verify_password, update_password, g_sr_no
#from stock_market_data import topLoser, topGainer, mostActive, get_stock_data
from sentiment_analysis_model import sentiment
from otp_verification import send_otp, verify_otp
from datetime import timedelta
from change_password import update_user_password
from dashboard import dashboardData

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity

from os import environ

SECRET_KEY=environ.get('SECRET_KEY')
CORS_ALLOWED_ORIGIN_LOCAL=environ.get('CORS_ALLOWED_ORIGIN_LOCAL')
CORS_ALLOWED_ORIGIN_PRODUCTION=environ.get('CORS_ALLOWED_ORIGIN_PRODUCTION')
JWT_ACCESS_TOKEN_EXPIRES_TIME=int(environ.get('JWT_ACCESS_TOKEN_EXPIRES_TIME', 7))

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [CORS_ALLOWED_ORIGIN_LOCAL, CORS_ALLOWED_ORIGIN_PRODUCTION]}})

app.config['SECRET_KEY'] = SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=JWT_ACCESS_TOKEN_EXPIRES_TIME)

jwt= JWTManager(app)

@app.route('/api/user/login', methods=['POST', 'GET'])
def user_login():
    if request.method == 'POST':
        credentials = request.json

        username= credentials['userInput']
        password= credentials['password']
        if_user_exist = get_item_from_user_data(username)
        if if_user_exist=={}:
            return jsonify({"message": "User doesn't exist."}), 400
        user = verify_password(password, username)

        if user==True :
            access_token = create_access_token(identity=username)
            return jsonify({"accessToken": access_token, "status":200}), 200
        return jsonify({"message": "Invalid credentials"}), 401
    else:
        return jsonify({"error": "Method Not Allowed"})

@app.route('/api/user/signup', methods=['POST', 'GET'])
def user_signup():
    if request.method == 'POST':
        userData = request.get_json()
        username = userData['username']
        password = userData['password']
        name = userData['name']
        email = userData['email']
        mobile = userData['mobileNumber']
        
        res = insert_into_user_data(username,password,name,email,mobile)
        if res == True :
            access_token = create_access_token(identity=username)
            return jsonify({"accessToken": access_token, "status":200}), 200
        else:
            return jsonify({"status":400})
    else:
        return jsonify({"error": "Method Not Allowed"}), 405


@app.route('/api/user/signup/send-otp', methods=['POST', 'GET'])
def signup_send_otp():
    if request.method == 'POST':
        request_body = request.get_json()
        email = request_body['email']
        username = request_body['username']
        item = get_item_from_user_data(username)
        user_id=item.get("user_id")
        email_test=item.get("email")
        if (user_id and user_id.get("S")==username) or (email_test and email_test.get("S")==email):
            return jsonify({"message": "User already exists."}), 200
        response = send_otp(email)
        if response == True:
            return jsonify(True), 200
        else:
            return jsonify({"message": "There was an error sending otp."}), 400
    else:
        return jsonify({"error": "Method Not Allowed"}), 405
    

@app.route('/api/user/signup/verify-otp', methods=['POST', 'GET'])
def signup_verify_otp():
    if request.method == 'POST':
        request_body = request.get_json()
        entered_otp = request_body['otp']
        email = request_body['email']

        auth_otp = verify_otp(email, entered_otp)
        
        return jsonify(auth_otp), 200
    else:
        return jsonify({"error": "Method Not Allowed"}), 405


@app.route('/api/user/forgot-password', methods=['POST', 'GET'])
def forgot_password():
    if request.method == 'POST':
        request_body = request.get_json()
        user_id=request_body.get('username')
        user_data = get_item_from_user_data(user_id)
        email = user_data.get("email").get("S")
        mail_response = update_user_password(user_id, email)
        if mail_response == True :
            return jsonify(True), 200
        else:
            return jsonify(False)
    else:
        return jsonify({"error": "Method Not Allowed"}), 405


@app.route('/api/user/profile', methods=['POST', 'GET'])
@jwt_required()
def user_profile():
    if request.method == 'POST':
        current_user = get_jwt_identity()
        user = get_item_from_user_data(current_user)

        response = {
            "name": user['name']['S'],
            "email": user['email']['S'],
            "username": user['user_id']['S'],
            "mobileNumber": user['mobile']['S'] if 'S' in user['mobile'] else user['mobile']['N'],
        }
        return jsonify(response), 200
    else:
        return jsonify({"error": "Method Not Allowed"}), 405
    

@app.route('/api/user/update-profile', methods=['POST', 'GET'])
@jwt_required()
def update_user_profile():
    if request.method == 'POST':
        current_user = get_jwt_identity()
        profile_data = request.get_json()
        response = update_user_info(current_user, profile_data["password"], profile_data["name"], profile_data["email"], profile_data["mobileNumber"])

        if response == True :
            return jsonify({"status": 200, "message": "Updated profile details successfully"}), 200
        else:
            return jsonify({"status": 400, "message": "Incorrect password"})
    else:
        return jsonify({"message": "Method Not Allowed", "status": 405}), 500


@app.route('/api/user/update-password', methods=['POST', 'GET'])
@jwt_required()
def update_user_password_fun():
    if request.method == 'POST':
        current_user = get_jwt_identity()
        request_body = request.get_json()
        response = update_password(current_user, request_body["oldPassword"], request_body["newPassword"])
        if response == True :
            return jsonify({"status": 200, "message": "Password updated successfully"}), 200
        else:
            return jsonify({"status": 400, "message": "Incorrect old password"})
    else:
        return jsonify({"message": "Method Not Allowed", "status": 405}), 500


@app.route('/api/user/delete-account', methods=['POST', 'GET'])
@jwt_required()
def delete_user_account():
    if request.method == 'POST':
        current_user = get_jwt_identity()
        request_body = request.get_json()

        if not verify_password(request_body["password"], current_user):
            return jsonify({"status": 400, "message": "Incorrect password"})
        response = delete_from_user_data(current_user)
        g_sr = g_sr_no(current_user)
        response2 = delete_from_transaction_data(g_sr, current_user)
        if response == True and response2 == True :
            return jsonify({"status": 200, "message": "Account deleted successfully"}), 200
        else:
            return jsonify({"status": 400, "message": "Something went wrong"})
    else:
        return jsonify({"message": "Method Not Allowed", "status": 405}), 500


@app.route('/api/user/addstock', methods=['POST', 'GET'])
@jwt_required()
def addStock():
    if request.method == 'POST':
        current_user = get_jwt_identity()
        transactionData = request.json
        date = transactionData['transDate']
        action = transactionData['transType']
        price = transactionData['stockPrice']
        quantity = transactionData['quantity']
        stock_name = transactionData['stockName']
        response = insert_into_transaction_data(current_user, date, action, price, quantity, stock_name)
        return jsonify(response)
    else:
        return jsonify({"error": "Method Not Allowed"})


@app.route('/api/user/holdings', methods=['GET'])
@jwt_required()
def get_stocks_data():
    current_user = get_jwt_identity()
    stocks_data = get_item_from_transaction_data(current_user)
    stocks_list = []
    for stock in stocks_data:
        individual_stock = {
            "quantity": "",
            "stockName": "",
            "date": "",
            "action": "",
            "stockSymbol": "",
            "price": "",
        }
        for key, value in stock.items() :
            if key=="stock_name" :
                individual_stock["stockName"] = value['S']
            elif key=="date" :
                individual_stock["date"] = value['S']
            elif key=="action" :
                individual_stock["action"] = value['S']
            elif key=="stock_symbol" :
                individual_stock["stockSymbol"] = value['S']
            elif key=="price" :
                individual_stock["price"] = value['S'] if 'S' in value else value['N']
            elif key=="quantity" :
                individual_stock["quantity"] = value['S'] if 'S' in value else value['N']

        stocks_list.append(individual_stock)
    return jsonify(stocks_list), 200

@app.route('/api/user/dashboard', methods=['GET'])
@jwt_required()
def get_user_dashboard():
    current_user = get_jwt_identity()
    dashboard_data = dashboardData(current_user)
    return jsonify(dashboard_data), 200


@app.route('/api/user/insight/<stock_symbol>', methods=['GET'])
def insight(stock_symbol):
    mean_sentiment_output = sentiment(stock_symbol)
    return jsonify(mean_sentiment_output)


@app.route('/api/stocks/<stock_symbol>', methods=['GET'])
def stock_data(stock_symbol):
    stock_data = "get_stock_data(stock_symbol)"
    return jsonify(stock_data), 200


@app.route('/api/home/top_loser', methods=['GET'])
def top_loser():
    tl_dd = "topLoser()"
    dd = jsonify(tl_dd)
    return dd


@app.route('/api/home/most_active', methods=['GET'])
def most_active():
    ma_dd = "mostActive()"
    dd = jsonify(ma_dd)
    return dd


@app.route('/api/home/top_gainer', methods=['GET'])
def top_gainer():
    tg_dd = "topGainer()"
    dd = jsonify(tg_dd)
    return dd


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)