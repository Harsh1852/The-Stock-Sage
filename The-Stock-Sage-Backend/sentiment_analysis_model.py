import pandas as pd
from urllib.request import urlopen, Request
from bs4 import BeautifulSoup
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from stock_trends import trend
def sentiment(symbol):

    trending = trend(symbol)

    symbol = symbol.upper()
    # Data From Google NEWS
    company = pd.read_csv("company_names.csv")
    company = company[company['Symbol'] == symbol]
    companyname = company['Company Name'].iloc[0]
    companyname = companyname.replace(" ","+")
    url = f"https://news.google.com/search?for={companyname}&hl=en-IN&gl=IN&ceid=IN%3Aen"
    req = Request(url = url, headers={'user-agent':'my-app'})
    response = urlopen(req)
    html = BeautifulSoup(response,'html.parser')

    parsed_data = []

    for text, element in zip(html.find_all(class_="JtKRv"), html.find_all(class_="hvbAAd")):
        title = text.get_text()
        title = title.replace(","," ")
        dt = element['datetime']
        date = dt.split("T")[0]
        time = dt.split("T")[1].split("Z")[0]
        parsed_data.append([title, date, time])

    #converting the data (list) into a dataframe format

    parsed_data = pd.DataFrame(parsed_data, columns=['title','date','time'])

    # Stripping leading and trailing whitespace from the 'time' column for proper concatenation

    parsed_data['time'] = parsed_data['time'].str.strip()

    combined_data = parsed_data

    # Running the SA Sentiment_Intensity_Analyzer

    analyzer = SentimentIntensityAnalyzer()

    sa = lambda title: analyzer.polarity_scores(title)['compound']

    for title in combined_data['title']:
        combined_data['compound'] = combined_data['title'].apply(sa)

    mean_sentiment = combined_data['compound'].mean()

    mean_sentiment = (mean_sentiment + 1)*(5)/(2) #convert to range 0 to 5
    mean_sentiment = round(mean_sentiment, 1) #round of to 1 decimal point

    trend_movement_msg = ""
    if trending == 1:
        trend_movement_msg="It is expected to show an upward movement in the market"
    elif trending == -1:
        trend_movement_msg="It is expected to show a downward movement in the market but may recover in time"
    elif trending == 0:
        trend_movement_msg="It is uncertain to tell any movement due to the volatility in its price over the past few months"

    rating_message = ""
    if 0 <= mean_sentiment < 1:
        rating_message = "Extremely Negative: The sentiment towards the stock is extremely pessimistic, indicating significant concerns and potential downward pressure on its value."
    elif 1 <= mean_sentiment < 2:
        rating_message = "Negative: The sentiment towards the stock is negative, suggesting prevailing skepticism or pessimism among investors."
    elif 2 <= mean_sentiment < 3:
        rating_message = "Neutral: The sentiment towards the stock is neutral, indicating a lack of strong positive or negative bias, often associated with stability or uncertainty in the market."
    elif 3 <= mean_sentiment < 4:
        rating_message = "Positive: The sentiment towards the stock is positive, suggesting optimism or confidence among investors, potentially leading to upward movement in its value."
    else:
        rating_message = "Extremely Positive: The sentiment towards the stock is extremely positive, indicating strong confidence and optimism among investors, often associated with significant upward momentum."
    
    return {"rating": mean_sentiment, "message": rating_message, "movement": trend_movement_msg}
