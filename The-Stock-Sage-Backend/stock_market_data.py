from urllib.request import urlopen, Request
from bs4 import BeautifulSoup
import yfinance as yf
from datetime import datetime, timedelta
import numpy as np


# Fetch SENSEX data

def sensex():
    today = datetime.today()
    last7d = today - timedelta(days=7)
    last7d = last7d.strftime("%Y-%m-%d")
    sensex_data = yf.download('^BSESN', start=last7d)
    sensex = float(sensex_data.Close.iloc[-1])
    return sensex


# Fetch NIFTY 50 data

def nifty():
    today = datetime.today()
    last7d = today - timedelta(days=7)
    last7d = last7d.strftime("%Y-%m-%d")
    nifty_data = yf.download('^NSEI', start=last7d)
    nifty = float(nifty_data.Close.iloc[-1])
    return nifty


# Web-scraping the symbols

url = "https://www.moneycontrol.com/"
req = Request(url=url, headers={'user-agent': 'my-app'})
response = urlopen(req)
html = BeautifulSoup(response, 'html.parser')
data = html.find_all('tbody')


# Most Active
def mostActive():
    # Assuming most_active[x] is a bs4.element.Tag object
    most_active = str(data[2])
    soup = BeautifulSoup(most_active, 'html.parser')
    td_tags = soup.find_all('td')
    ma = []
    for td_tag in td_tags:
        ma.append(td_tag.text)
    for idx, item in enumerate(ma):
        if idx % 4 == 0:
            ma[idx] = item.replace("\n", "")

    ma_name = ma[::4]
    ma_vol = ma[3::4]
    ma_price = ma[1::4]
    ma_dd = {
        "data": []
    }
    for i, (a, b, c) in enumerate(zip(ma_name, ma_price, ma_vol), 1):
        stock_data = {'name': a, 'price': b, 'volume': c}
        ma_dd["data"].append(stock_data)
    return ma_dd


# Top Gainers
def topGainer():
    # Assuming most_active[x] is a bs4.element.Tag object
    top_gainers = str(data[4])
    soup = BeautifulSoup(top_gainers, 'html.parser')
    td_tags = soup.find_all('td')
    tg = []
    for td_tag in td_tags:
        tg.append(td_tag.text)
    for idx, item in enumerate(tg):
        if idx % 4 == 0:
            tg[idx] = item.replace("\n", "")

    tg_name = tg[::4]
    tg_vol = tg[3::4]
    tg_price = tg[1::4]
    tg_dd = {
        "data": []
    }
    for i, (a, b, c) in enumerate(zip(tg_name, tg_price, tg_vol), 1):
        stock_data = {'name': a, 'price': b, 'percent': c}
        tg_dd["data"].append(stock_data)
    return tg_dd


# Top Losers
def topLoser():
    # Assuming most_active[x] is a bs4.element.Tag object
    top_losers = str(data[6])
    soup = BeautifulSoup(top_losers, 'html.parser')
    td_tags = soup.find_all('td')
    tl = []
    for td_tag in td_tags:
        tl.append(td_tag.text)
    for idx, item in enumerate(tl):
        if idx % 4 == 0:
            tl[idx] = item.replace("\n", "")

    tl_name = tl[::4]
    tl_vol = tl[3::4]
    tl_price = tl[1::4]
    tl_dd = {
        "data": []
    }
    for i, (a, b, c) in enumerate(zip(tl_name, tl_price, tl_vol), 1):
        stock_data = {'name': a, 'price': b, 'percent': c}
        tl_dd["data"].append(stock_data)
    return tl_dd

def shorten_sumary(longBusinessSummary):
    substrings = longBusinessSummary.split('.')
    shortened_sumary = '.'.join(substrings[:2]) + '.'
    return shortened_sumary

def get_stock_data(stock_symbol):
    symbol = stock_symbol + ".NS"
    stock_data = yf.Ticker(symbol)

    name = stock_data.info.get('longName')
    sector = stock_data.info.get('sector')
    industry = stock_data.info.get('industry')
    website = stock_data.info.get('website')
    longBusinessSummary = stock_data.info.get('longBusinessSummary')
    longBusinessSummary = shorten_sumary(longBusinessSummary)

    fifty_two_week_low = stock_data.info.get('fiftyTwoWeekLow')
    fifty_two_week_high = stock_data.info.get('fiftyTwoWeekHigh')
    previous_close = stock_data.info.get('previousClose')
    opening_price = stock_data.info.get('open')
    current_price = stock_data.info.get('currentPrice')
    percent_change = ((current_price - previous_close)/previous_close)*100
    percent_change = round(percent_change or 0, 2)
    day_low = stock_data.info.get('dayLow')
    day_high = stock_data.info.get('dayHigh')

    priceToBook = round(stock_data.info.get('priceToBook') or 0, 2)
    dividendYield = stock_data.info.get('dividendYield')*100
    trailingPE = round(stock_data.info.get('trailingPE') or 0, 2)
    marketCap = stock_data.info.get('marketCap')
    trailingEps = round(stock_data.info.get('trailingEps') or 0, 2)
    returnOnEquity = round(stock_data.info.get('returnOnEquity') or 0, 2)
    debtToEquity = round(stock_data.info.get('debtToEquity') or 0, 2)

    news = stock_data.news

    dividends_df = stock_data.dividends
    dividend_list = []
    for date, value in zip(dividends_df.index, dividends_df.values):
        date = date.strftime("%d-%m-%Y")
        dividend_list.append({'date': date, 'dividend': value})
    
    income_statement = stock_data.income_stmt
    latest_year_data = income_statement.iloc[:, 0]
    income_list = []
    for field, value in zip(latest_year_data.index, latest_year_data.values):
        intval = 0
        if np.isnan(value):
            intval = 0
        else:
            intval = value
        income_list.append({'field': field, 'data': intval})

    response = {
        "name": name,
        "symbol": stock_symbol,
        "sector": sector,
        "industry": industry,
        "website": website,
        "businessSummary": longBusinessSummary,
        "52Low": fifty_two_week_low,
        "52High": fifty_two_week_high,
        "previousClose": previous_close,
        "openingPrice": opening_price,
        "percentChange": percent_change,
        "dayLow": day_low,
        "dayHigh": day_high,
        "currentPrice": current_price,
        "marketCap": marketCap,
        "keyRatio": {
            "PBratio": priceToBook,
            "dividendYield": dividendYield,
            "trailingPEratio": trailingPE,
            "earningsPerShare": trailingEps,
            "returnOnEquity": returnOnEquity,
            "debtToEquityRatio": debtToEquity,
        },
        "news": news,
        "dividends": dividend_list,
        "incomeStatement": income_list,
    }
    return response