// constants
import {
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
  LABELS_STATS,
  LABELS_TH,
  SELECTOR_USER_DETAILS,
  SORT_ORDER_ASCENDING,
  SORT_ORDER_DESCENDING,
  URL_COMPANIES,
  URL_ORDERS,
  URL_USERS,
} from './constants';

// functions
import {
  buildHtml,
  compareArray,
  compareValues,
  composePath,
  formatCardNumber,
  formatDate,
  formatUserName,
  mapData
} from './utils';

class Table {
  constructor() {
    this.container = document.getElementById(ID_APP_CONTAINER);
    this.tableHead = null;
    this.tableBody = null;
    this.data = {};
    this.filteredData = [];
    this.sortedData = [];
    this.stats = [];

    this.sortColumn = '';
    this.sortOrder = '';
    this.searchValue = '';

    this.cbSortData = this.cbSortData.bind(this);
    this.cbFilterData = this.cbFilterData.bind(this);
  }

  ////////////////////////////////////////////////////////////////////// D A T A

  calculateStatistics() {
    let ordersCount = this.sortedData.length;
    let ordersTotal = 0;
    let median = [];
    let medianValue = NaN;
    let count = {female: 0, male: 0};
    let total = {female: 0, male: 0};
    let stats = [];

    // calculate orders total
    for (let i = 0; i < this.sortedData.length; i++) {
      let amount = parseFloat(this.sortedData[i].total);

      ordersTotal += amount;

      median.push(amount);
    }

    // calculate female/male average
    for (let i = 0; i < this.sortedData.length; i++) {
      let {user_id} = this.sortedData[i];
      let gender = this.data.users[user_id].gender.toLowerCase();

      count[gender] += 1;
      total[gender] += parseFloat(this.sortedData[i].total);
    }

    // calculate median value
    median.sort((a, b) => a - b);

    if (median.length % 2 !== 0) {
      let middle = Math.floor(median.length / 2);

      medianValue = median[middle];
    }
    else if (median.length % 2 === 0) {
      let middle = median.length / 2;
      let next = middle + 1;

      medianValue = (median[middle] + median[next]) / 2;
    }

    stats.push(ordersCount);
    stats.push(Math.round(ordersTotal * 100) / 100);
    stats.push(Math.round(medianValue * 100) / 100);
    stats.push(Math.round(ordersTotal / ordersCount * 100) / 100);
    stats.push(Math.round(total.female / count.female * 100) / 100);
    stats.push(Math.round(total.male / count.male * 100) / 100);

    this.stats = stats;
  };

  fetchData(url) {
    return window.fetch(url)
      .then(response => {
        if (response.ok) return response.json();

        throw new Error(response.statusText);
      })
      .catch(error => console.log('error', error));
  }

  filterData() {
    if (!this.searchValue) this.filteredData = [...this.data.orders];

    else {
      this.filteredData = this.data.orders.filter(item => {
        let {first_name, last_name} = this.data.users[item.user_id];
        let date = formatDate(item.created_at).toLowerCase();

        const filterName = () => {
          let searchQueries = this.searchValue.split(' ').reduce((result, item) => {
            return item ? [...result, item] : result;
          }, []);

          return searchQueries.every(searchQuery => {
            return (
              first_name.toLowerCase().indexOf(searchQuery) > -1 ||
              last_name.toLowerCase().indexOf(searchQuery) > -1
            );
          });
        };

        return (
          item.transaction_id.indexOf(this.searchValue) > -1 ||
          item.card_type.indexOf(this.searchValue) > -1 ||
          item.total.indexOf(this.searchValue) > -1 ||
          item.order_country.toLowerCase().indexOf(this.searchValue) > -1 ||
          item.order_ip.indexOf(this.searchValue) > -1 ||
          filterName() ||
          date.indexOf(this.searchValue) > -1
        );
      });
    }

    this.sortData();

    this.calculateStatistics();
  };

  loadData() {
    Promise.all([
      this.fetchData(URL_ORDERS),
      this.fetchData(URL_USERS),
      this.fetchData(URL_COMPANIES)
    ])
      .then(response => this.cbHandleResponse(response))
      .catch(error => console.log('error', error));
  }

  sortData() {
    let orders = [...this.filteredData];

    if (!this.sortOrder) return this.sortedData = orders;

    this.sortedData = orders.sort((a, b) => {
      switch (this.sortColumn) {
        case ID_TH_TRANSACTION_ID:
          return compareValues(a.transaction_id, b.transaction_id);
        case ID_TH_USER_INFO:
          let user_a = this.data.users[a.user_id];
          let user_b = this.data.users[b.user_id];

          let {first_name: first_a, last_name: last_a} = user_a;
          let {first_name: first_b, last_name: last_b} = user_b;

          let firstNameCompareResult = compareValues(first_a, first_b);

          if (firstNameCompareResult === 0) {
            return compareValues(last_a, last_b);
          }

          return firstNameCompareResult;
        case ID_TH_ORDER_DATE:
          return compareValues(a.created_at, b.created_at);
        case ID_TH_ORDER_AMOUNT:
          return compareValues(parseFloat(a.total), parseFloat(b.total));
        case ID_TH_CARD_TYPE:
          return compareValues(a.card_type, b.card_type);
        case ID_TH_LOCATION:
          let {order_country: country_a, order_ip: ip_a} = a;
          let {order_country: country_b, order_ip: ip_b} = b;

          let countryCompareResult = compareValues(country_a, country_b);

          if (countryCompareResult === 0) {
            ip_a = ip_a.split('.').map(item => parseInt(item));
            ip_b = ip_b.split('.').map(item => parseInt(item));

            return compareArray(ip_a, ip_b);
          }

          return countryCompareResult;
      }
    });

    if (this.sortOrder === SORT_ORDER_DESCENDING) this.sortedData.reverse();
  }

  //////////////////////////////////////////////////////////// C A L L B A C K S

  cbFilterData(event) {
    if (this.searchValue === event.target.value) {
      return;
    }

    this.searchValue = event.target.value;

    this.filterData();

    this.updateBody();
  }

  cbHandleResponse(response) {
    for (let i = 0; i < response.length; i++) {
      if (response[i] instanceof Error) {
        throw new Error(response[i].message);
      }
    }

    this.data = {
      orders: response[0],
      users: mapData(response[1]),
      companies: mapData(response[2])
    };

    this.filteredData = [...this.data.orders];
    this.sortedData = this.filteredData;

    this.calculateStatistics();

    this.container.appendChild(this.buildTable());
  }

  cbSortData(event) {
    let {id} = event.target;

    if (!id || id === ID_TH_CARD_NUMBER || id === ID_INPUT_SEARCH) return;

    this.updateHead();

    let element = document.getElementById(id);

    if (this.sortColumn === id) {
      switch (this.sortOrder) {
        case SORT_ORDER_ASCENDING:
          this.sortOrder = SORT_ORDER_DESCENDING;
          element.innerHTML = `${LABELS_TH[id]} ${'<span>&#8595;</span>'}`;
          break;
        case SORT_ORDER_DESCENDING:
          this.sortOrder = '';
          element.innerHTML = `${LABELS_TH[id]}`;
          break;
        default:
          this.sortOrder = SORT_ORDER_ASCENDING;
          element.innerHTML = `${LABELS_TH[id]} ${'<span>&#8593;</span>'}`;
      }
    }
    else {
      this.sortOrder = SORT_ORDER_ASCENDING;
      element.innerHTML = `${LABELS_TH[id]} ${'<span>&#8593;</span>'}`;
    }

    this.sortColumn = id;

    this.sortData();

    this.updateBody();
  }

  static cbToggleUserDetails(event) {
    if (event.target.tagName === 'A' && event.target.dataset.link === 'false') {
      event.preventDefault();

      let path = composePath(event.target);

      for (let i = 0; i < path.length; i++) {
        if (path[i].className === 'user-data') {
          let userDetails = path[i].querySelector(SELECTOR_USER_DETAILS);

          let display = userDetails.style.display;

          userDetails.style.display = display === 'none' ? 'block' : 'none';
        }
      }
    }
  }

  ////////////////////////////////////////////////////////// B U I L D   H T M L

  buildBody() {
    let body = document.createElement('tbody');
    body.setAttribute('style', 'vertical-align: top');
    body.addEventListener('click', Table.cbToggleUserDetails, false);

    for (let i = 0; i < this.sortedData.length; i++) {
      let row = this.buildRow(this.sortedData[i]);

      body.appendChild(row);
    }

    return body;
  }

  buildCell(data, attributes) {
    let tableCell = document.createElement('td');

    if (attributes) {
      Object.keys(attributes).forEach(key => {
        tableCell.setAttribute(key, attributes[key]);
      });
    }

    if (Array.isArray(data)) data.forEach(item => tableCell.appendChild(item));

    else tableCell.innerText = data;

    tableCell.style.border = '1px solid';
    tableCell.style.padding = '6px';

    return tableCell;
  }

  buildHead() {
    let thead = document.createElement('thead');
    this.tableHead = thead;

    thead.addEventListener('click', this.cbSortData, false);
    thead.addEventListener('keyup', this.cbFilterData, false);
    thead.addEventListener('paste', this.cbFilterData, false);
    thead.addEventListener('change', this.cbFilterData, false);
    thead.addEventListener('cut', this.cbFilterData, false);

    return buildHtml(thead, CONFIG_TABLE_HEADER);
  }

  buildRow(data, isEmpty) {
    let row = document.createElement('tr');

    if (isEmpty) row.appendChild(this.buildCell(data, {colspan: '7'}));

    else {
      let {order_country, order_ip} = data;

      row.setAttribute('id', `order_${data.id}`);

      row.appendChild(this.buildCell(data.transaction_id));
      row.appendChild(this.buildUser(data.user_id));
      row.appendChild(this.buildCell(formatDate(data.created_at)));
      row.appendChild(this.buildCell(`$${data.total}`, {style: 'text-align: right;'}));
      row.appendChild(this.buildCell(formatCardNumber(data.card_number)));
      row.appendChild(this.buildCell(data.card_type));
      row.appendChild(this.buildCell(`${order_country} (${order_ip})`));
    }

    return row;
  }

  buildStatistics() {
    for (let i = 0; i < this.stats.length; i++) {
      let label = this.buildCell(LABELS_STATS[i]);
      let value = this.stats[i] ? this.stats[i] : 'n/a';

      if (i > 0 && this.stats[i]) value = `$ ${value}`;

      let row = document.createElement('tr');
      row.appendChild(label);
      row.appendChild(this.buildCell(value, {colspan: '6'}));

      this.tableBody.appendChild(row);
    }
  };

  buildTable() {
    let table = document.createElement('table');
    let head = this.buildHead();
    let body = this.buildBody();
    this.tableBody = body;

    this.buildStatistics();

    table.setAttribute('width', '100%;');
    table.setAttribute('style', 'border-collapse: collapse; text-align: left;');

    table.appendChild(head);
    table.appendChild(body);

    return table;
  }

  buildUser(id) {
    let user = this.data.users[id];
    let {avatar, birthday, company_id, gender, first_name, last_name} = user;

    let result = [];

    let userName = document.createElement('a');
    userName.setAttribute('href', '#');
    userName.setAttribute('data-link', 'false');
    userName.innerText = formatUserName(gender, first_name, last_name);

    result.push(userName);
    result.push(this.buildUserDetails(avatar, birthday, company_id));

    return this.buildCell(result, {class: 'user-data'});
  }

  buildUserDetails(avatar, birthday, companyId) {
    let userDetails = document.createElement('div');
    userDetails.classList.add('user-details');
    userDetails.setAttribute('style', 'display: none;');

    // birthday
    if (birthday) {
      let userBirthDay = document.createElement('p');
      userBirthDay.innerText = formatDate(birthday, true);

      userDetails.appendChild(userBirthDay);
    }

    // avatar
    if (avatar) {
      let userAvatar = document.createElement('p');
      let img = document.createElement('img');
      img.setAttribute('src', avatar);
      img.setAttribute('width', '100px');

      userAvatar.appendChild(img);
    }

    if (companyId) {
      let {industry, sector, title, url} = this.data.companies[companyId];

      // title
      let companyTitle = document.createElement('p');

      if (url) {
        let span = document.createElement('span');
        span.innerText = `Company: `;

        let a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('target', '_blank');
        a.innerText = title;

        companyTitle.appendChild(span);
        companyTitle.appendChild(a);
      }
      else {
        companyTitle.innerText = `Company: ${title}`;
      }

      // industry
      let companyIndustry = document.createElement('p');
      companyIndustry.innerText = `Industry: ${industry} / ${sector}`;

      userDetails.appendChild(companyTitle);
      userDetails.appendChild(companyIndustry);
    }

    return userDetails;
  }


  ////////////////////////////////////////////////////////////////// U P D A T E

  updateBody() {
    this.tableBody.innerHTML = '';

    if (!this.sortedData.length) {
      let row = this.buildRow('Nothing found', true);

      this.tableBody.appendChild(row);
    }

    else {
      for (let i = 0; i < this.sortedData.length; i++) {
        let row = this.buildRow(this.sortedData[i]);

        this.tableBody.appendChild(row);
      }
    }

    this.buildStatistics();
  }

  updateHead() {
    this.tableHead.innerHTML = '';

    buildHtml(this.tableHead, CONFIG_TABLE_HEADER);
  }
}

export {Table};
