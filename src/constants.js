// identifiers
const ID_APP_CONTAINER = 'app';
const ID_INPUT_SEARCH = 'search';
const ID_TH_CARD_NUMBER = 'ID_TH_CARD_NUMBER';
const ID_TH_CARD_TYPE = 'ID_TH_CARD_TYPE';
const ID_TH_LOCATION = 'ID_TH_LOCATION';
const ID_TH_ORDER_AMOUNT = 'ID_TH_ORDER_AMOUNT';
const ID_TH_ORDER_DATE = 'ID_TH_ORDER_DATE';
const ID_TH_TRANSACTION_ID = 'ID_TH_TRANSACTION_ID';
const ID_TH_USER_INFO = 'ID_TH_USER_INFO';
const ID_TR_TABLE_HEADERS = 'ID_TR_TABLE_HEADERS';

// configs
const CONFIG_TABLE_HEADER = [
  {
    attributes: {
      style: 'background-color: beige;'
    },
    innerHtml: [
      {
        attributes: {
          style: 'padding: 6px;'
        },
        innerText: 'Search:',
        tag: 'th'
      },
      {
        attributes: {
          colspan: '6',
          style: 'padding: 6px;'
        },
        innerHtml: [
          {
            attributes: {
              id: ID_INPUT_SEARCH,
              type: 'text'
            },
            tag: 'input'
          }
        ],
        tag: 'th'
      }
    ],
    tag: 'tr'
  },
  {
    attributes: {
      style: 'background-color: beige; cursor: pointer;',
      id: ID_TR_TABLE_HEADERS
    },
    innerHtml: [
      {
        attributes: {
          id: ID_TH_TRANSACTION_ID,
          style: 'padding: 6px;'
        },
        innerText: 'Transaction ID',
        tag: 'th'
      },
      {
        attributes: {
          id: ID_TH_USER_INFO,
          style: 'padding: 6px;'
        },
        innerText: 'User Info',
        tag: 'th'
      },
      {
        attributes: {
          id: ID_TH_ORDER_DATE,
          style: 'padding: 6px;'
        },
        innerText: 'Order Date',
        tag: 'th'
      },
      {
        attributes: {
          id: ID_TH_ORDER_AMOUNT,
          style: 'padding: 6px;'
        },
        innerText: 'Order Amount',
        tag: 'th'
      },
      {
        attributes: {
          id: ID_TH_CARD_NUMBER,
          style: 'cursor: default; padding: 6px;'
        },
        innerText: 'Card Number',
        tag: 'th'
      },
      {
        attributes: {
          id: ID_TH_CARD_TYPE,
          style: 'padding: 6px;'
        },
        innerText: 'Card Type',
        tag: 'th'
      },
      {
        attributes: {
          id: ID_TH_LOCATION,
          style: 'padding: 6px;'
        },
        innerText: 'Location',
        tag: 'th'
      }
    ],
    tag: 'tr'
  }
];

// labels
const LABELS_STATS = [
  'Orders Count',
  'Orders Total',
  'Median Value',
  'Average Check',
  'Average Check (Female)',
  'Average Check (Male)'
];
const LABELS_TH = {
  ID_TH_CARD_NUMBER: 'Card Number',
  ID_TH_CARD_TYPE: 'Card Type',
  ID_TH_LOCATION: 'Location',
  ID_TH_ORDER_AMOUNT: 'Order Amount',
  ID_TH_ORDER_DATE: 'Order Date',
  ID_TH_TRANSACTION_ID: 'Transaction ID',
  ID_TH_USER_INFO: 'User Info'
};

// selectors
const SELECTOR_USER_DETAILS = '.user-details';

// sorting rules
const SORT_ORDER_ASCENDING = 'SORT_ORDER_ASCENDING';
const SORT_ORDER_DESCENDING = 'SORT_ORDER_DESCENDING';

// urls
const URL_COMPANIES = 'http://localhost:9000/api/companies.json';
const URL_ORDERS = 'http://localhost:9000/api/orders.json';
const URL_USERS = 'http://localhost:9000/api/users.json';


export {
  CONFIG_TABLE_HEADER,
  ID_APP_CONTAINER,
  ID_INPUT_SEARCH,
  ID_TH_CARD_NUMBER,
  ID_TH_CARD_TYPE,
  ID_TH_LOCATION,
  ID_TH_ORDER_AMOUNT,
  ID_TH_ORDER_DATE,
  ID_TH_TRANSACTION_ID,
  ID_TH_USER_INFO,
  ID_TR_TABLE_HEADERS,
  LABELS_STATS,
  LABELS_TH,
  SELECTOR_USER_DETAILS,
  SORT_ORDER_ASCENDING,
  SORT_ORDER_DESCENDING,
  URL_COMPANIES,
  URL_ORDERS,
  URL_USERS
};
