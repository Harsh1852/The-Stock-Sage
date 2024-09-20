import pandas as pd
import yfinance as yf

def trend(symbol):
    sym = symbol+'.NS'
    data = yf.download(sym)
    specific_date = pd.to_datetime('2020-12-31')  # Replace 'YYYY-MM-DD' with the specific date
    data = data.loc[specific_date:]
    data = data.drop('Adj Close', axis = 1)
    ma100 = data['Close'].rolling(100).mean()
    ma200 = data['Close'].rolling(200).mean()

    def moving_average_trend(ma100, ma200):
        # Take the last 100 values of MA100 and MA200
        last_100_ma100 = ma100[-100:]
        last_100_ma200 = ma200[-100:]

        # Calculate the differences between MA100 and MA200
        differences = [ma100 - ma200 for ma100, ma200 in zip(last_100_ma100, last_100_ma200)]

        # Check if the trend is upward
        if all(diff > 0 for diff in differences) or \
           (ma100[-1] > ma200[-1] and ma100[-1] - ma200[-1] > ma100[-2] - ma200[-2]) or \
           (ma100[-1] > ma200[-1] and ma100[-2] <= ma200[-2]) or \
           (ma100[-1] > ma200[-1] and ma100[-2] < ma200[-2] and ma100[-1] - ma200[-1] > ma100[-2] - ma200[-2]):
            return 1

        # Check if the trend is downward
        elif all(diff < 0 for diff in differences) or \
             (ma100[-1] < ma200[-1] and ma100[-1] - ma200[-1] < ma100[-2] - ma200[-2]) or \
             (ma100[-1] < ma200[-1] and ma100[-2] >= ma200[-2]) or \
             (ma100[-1] < ma200[-1] and ma100[-2] > ma200[-2] and ma100[-1] - ma200[-1] < ma100[-2] - ma200[-2]):
            return -1

        else:
            return 0

    # Example usage:
    ptrend = moving_average_trend(ma100, ma200)

    return ptrend
