// 把tv的报文专为便于理解的格式
/*
{
  symbol: "MANTAUSDT.P",
  positionSide: "LONG",
  side: "CLOSE",
  action: "SELL",
  quantity: "433.171",
  price: "2.6576",
  comment: "浮亏大于40U平仓",
} */
export const tvTag = (data: any) => {
  const _data = data;
  if (
    !_data.ticker ||
    !_data.market_position ||
    !_data.action ||
    !_data.market_position_size ||
    !_data.contracts ||
    !_data.price ||
    !_data.comment ||
    !_data.prev_market_position ||
    !_data.market_position_size
  ) {
    throw new Error('Invalid request');
  }
  const _result = {
    symbol: _data.ticker,
    positionSide: _data.market_position.toUpperCase(),
    side: 'OPEN|CLOSE|INCR|DECR|TURNUP|TURNDOWN',
    action: _data.action.toUpperCase(),
    marketSize: _data.market_position_size, //市值
    quantity: _data.contracts, //数量
    price: _data.price, //价格
    comment: _data.comment,
  };
  if (_data.market_position === 'flat') {
    _result.side = 'CLOSE';
    _result.positionSide = _data.prev_market_position.toUpperCase();
    _result.action = _result.positionSide == 'LONG' ? 'SELL' : 'BUY';
  } else if (_data.prev_market_position === 'flat') {
    _result.side = 'OPEN';
    _result.action = _result.positionSide == 'LONG' ? 'BUY' : 'SELL';
  } else if (_data.market_position === _data.prev_market_position) {
    if ((_data.market_position === 'long' && _data.action === 'buy') || (_data.market_position === 'short' && _data.action === 'sell')) {
      _result.side = 'INCR';
      _result.action = _result.positionSide == 'LONG' ? 'BUY' : 'SELL';
    } else {
      _result.side = 'DECR';
      _result.action = _result.positionSide == 'LONG' ? 'SELL' : 'BUY';
    }
  } else if (_data.market_position !== _data.prev_market_position) {
    if (_data.market_position === 'long' && _data.prev_market_position === 'short') {
      _result.side = 'TURNUP';
      _result.action = _result.positionSide == 'LONG' ? 'BUY' : 'SELL';
    } else {
      _result.side = 'TURNDOWN';
      _result.action = _result.positionSide == 'LONG' ? 'SELL' : 'BUY';
    }
  }

  return _result;
};
