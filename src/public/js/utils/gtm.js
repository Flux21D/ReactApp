import extend from "lodash/extend";

export const customPageView = (dimentions) => {
  dataLayer.push(extend({
    'event': 'CustomPageView',
    'Custom':{'cdj': dimentions.custom.cdj,'btc':dimentions.custom.btc}
  }, dimentions));    
};

export const customClick = (data) => {
  dataLayer.push(extend({
    'event': 'test-trigger'
  }, data));
};
