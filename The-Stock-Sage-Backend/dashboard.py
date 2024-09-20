import pandas as pd
import yfinance as yf
from database import get_item_from_transaction_data

def dashboardData(user_id):
    data = get_item_from_transaction_data(user_id)
    
    if len(data) == 0:
        return {}
    
    data = [{'quantity': int(d['quantity']['N']) if 'N' in d['quantity'] else int(d['quantity']['S']), 'stock_name': d['stock_name']['S'], 'date': d['date']['S'], 'action': d['action']['S'], 'user_id': d['user_id']['S'], 'stock_symbol': d['stock_symbol']['S'], 'price': float(d['price']['N']) if 'N' in d['price'] else float(d['price']['S']), 'sr_no': int(d['sr_no']['N'])} for d in data]
    df = pd.DataFrame(data)

    df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d')

    buy_transactions = df[df.get('action') == 'buy']
    aggregated_data = buy_transactions.groupby(['user_id', 'stock_name', 'stock_symbol']).agg(
        quantity=('quantity', 'sum'),
        average_price=('price', 'mean')
    ).reset_index()

    sell_transactions = df[df.get('action') == 'sell']
    for index, row in sell_transactions.iterrows():
        mask = (aggregated_data.get('user_id') == row.get('user_id')) & (aggregated_data.get('stock_symbol') == row.get('stock_symbol'))
        if not mask.any():
            continue
        aggregated_data.loc[mask, 'quantity'] -= row.get('quantity')

    remaining_stocks = aggregated_data[aggregated_data.get('quantity') > 0]

    for index, row in remaining_stocks.iterrows():
        current_price = yf.Ticker(row.get('stock_symbol') + '.NS').info.get('currentPrice')
        if pd.isna(current_price):
            current_price = 0
        investment = row.get('average_price') * row.get('quantity')
        valuation = current_price * row.get('quantity')
        pl = ((valuation / investment) - 1) * 100

        remaining_stocks.at[index, 'current_price'] = current_price
        remaining_stocks.at[index, 'investment'] = investment
        remaining_stocks.at[index, 'valuation'] = valuation
        remaining_stocks.at[index, 'p/l'] = pl

    total_investment = (remaining_stocks.get('investment').sum()).round(2)
    total_valuation = (remaining_stocks.get('valuation').sum()).round(2)
    unrealised_pl = (total_valuation - total_investment).round(2)
    top_gainer = remaining_stocks.loc[remaining_stocks.get('p/l').idxmax()].get('stock_symbol')
    total_stocks = len(remaining_stocks)
    percentage_pl = (((total_valuation / total_investment) - 1) * 100).round(2)
    stocks_in_profit = 0
    stocks_in_loss = 0
    for index, row in remaining_stocks.iterrows():
        if row.get('p/l') > 0:
            stocks_in_profit += 1
        else:
            stocks_in_loss += 1

    remaining_stocks.drop('user_id', axis=1, inplace=True)
    remaining_stocks.drop('stock_name', axis=1, inplace=True)
    remaining_stocks.drop('investment', axis=1, inplace=True)
    remaining_stocks['current_price'] = remaining_stocks.get('current_price').round(2)
    remaining_stocks['average_price'] = remaining_stocks.get('average_price').round(2)
    remaining_stocks['valuation'] = remaining_stocks.get('valuation').round(2)
    remaining_stocks['p/l'] = remaining_stocks.get('p/l').round(2)
    remaining_stocks = remaining_stocks.rename(columns={'quantity': 'Quantity', 'stock_symbol': 'Symbol', 'current_price': 'current_price', 'average_price': 'average_price', 'valuation': 'Valuation', 'p/l': 'profit_loss'})

    table_data = remaining_stocks.to_dict('records')

    return {"table_data":table_data, "total_valuation":total_valuation, "total_investment":total_investment, "unrealised_pl":unrealised_pl, "top_gainer":top_gainer, "total_stocks":total_stocks, "percentage_pl":percentage_pl, "stocks_in_profit":stocks_in_profit, "stocks_in_loss":stocks_in_loss}
