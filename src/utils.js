const buildHtml = (targetNode, config) => {
  config.forEach(item => {
    let element = document.createElement(item.tag);

    if (item.attributes) {
      Object.keys(item.attributes).forEach(key => {
        element.setAttribute(key, item.attributes[key]);
      });
    }

    if (item.innerText) {
      element.innerText = item.innerText;
    }

    if (item.innerHtml) {
      buildHtml(element, item.innerHtml);
    }

    targetNode.appendChild(element);
  });

  return targetNode;
};

const compareArray = (a, b) => {
  for (let i = 0; i < a.length; i++) {
    if (i < a.length - 2 && a[i] - b[i] === 0) {
      continue;
    }

    return a[i] - b[i];
  }
};

const compareValues = (a, b) => {
  if (a < b) return -1;

  if (a > b) return 1;

  return 0;
};

const composePath = element => {

  var path = [];

  while (element) {

    path.push(element);

    if (element.tagName === 'HTML') {

      path.push(document);
      path.push(window);

      return path;
    }

    element = element.parentElement;
  }
};

const formatCardNumber = cardNumber => {
  let number = cardNumber.split('');

  let result = '';

  for (let i = 0; i < number.length; i++) {
    if (i < 2) result += number[i];

    else if (i > number.length - 5) result += number[i];

    else result += '*';
  }

  return result;
};

const formatDate = (dateUnix, isShort) => {
  let date = new Date(dateUnix * 1000);

  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  let year = date.getFullYear().toString();

  if (day.length === 1) day = `0${day}`;
  if (month.length === 1) month = `0${month}`;

  if (isShort) {
    return `${day}/${month}/${year}`;
  }

  let hours = date.getHours();
  let postFix = hours < 12 ? 'AM' : 'PM';
  let minutes = date.getMinutes().toString();
  let seconds = date.getSeconds().toString();

  if (hours.toString().length === 1) hours = `0${hours.toString()}`;
  if (minutes.length === 1) minutes = `0${minutes}`;
  if (seconds.length === 1) seconds = `0${seconds}`;

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${postFix}`;
};

const formatUserName = (gender, firstName, lastName) => {
  switch (gender.toLowerCase()) {
    case 'female':
      return `Mrs. ${firstName} ${lastName}`;
    case 'male':
      return `Mr. ${firstName} ${lastName}`;
    default:
      return `${firstName} ${lastName}`;
  }
};

const mapData = data => {
  let result = {};

  for (let i = 0; i < data.length; i++) {
    result[data[i].id] = data[i];
  }

  return result;

  // for-cycle is used for better performance
  // return data.reduce((result, item) => {
  //   return {...result, [item.id]: item}
  // }, {});
};

export {
  buildHtml,
  compareArray,
  compareValues,
  composePath,
  formatCardNumber,
  formatDate,
  formatUserName,
  mapData
};
