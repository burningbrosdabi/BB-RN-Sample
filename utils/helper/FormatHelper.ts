import moment from 'moment';

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function calculateDiscountRate(original_price, discount_price) {
  return Math.round((1 - discount_price / original_price) * 100);
}

export function toPriceFormat(price, displayUnit = true) {
  return (
    parseFloat(price)
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + (displayUnit ? ' đ' : '')
  );
}

export function hexToRGBA(hex, opacity = 1) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    var rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
  }
  return rgba ?? null;
}

export function toAddress(data) {
  const { additional_address, city, district, ward } = data;
  return additional_address + ', ' + ward + ',\n' + district + ', ' + city;
}

export function toVietDateFormat(date, displayTime = false) {
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  const formateDate = day + '/' + month + '/' + year;
  if (displayTime) {
    const hour = date.slice(11, 13);
    const min = date.slice(14, 16);
    const formatTime = ' ' + hour + ':' + min;
    return formateDate + formatTime;
  }
  return formateDate;
}

export function getToday() {
  const date = new Date().getDate(); //Current Date
  const month = new Date().getMonth() + 1; //Current Month
  const year = new Date().getFullYear(); //Current Year
  return date + '/' + month + '/' + year;
}

export function dateTimeDiff(fromDate: string) {
  const timeDiff = Math.max(moment(moment()).diff(moment(fromDate), 'hours'), 0);
  const dateDiff = Math.max(moment(moment()).diff(moment(fromDate), 'days'), 0);

  if (timeDiff > 24) {
    return `${dateDiff} ngày`;
  } else if (timeDiff <= 0) {
    return 0;
  } else {
    return `${timeDiff} giờ`;
  }
}

function msToTime(s) {
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  s = (s - mins) / 60;
  const hrs = s % 24;
  const days = (s - hrs) / 24;
  return days + '일 ' + hrs + '시간 ' + mins + '분 ' + secs + '초 남음';
}

export const generateRandomNumber = length => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLength = characters.length;
  let randomPassword = '';
  for (let i = 0; i < length; i++) {
    randomPassword += characters.charAt(Math.floor(Math.random() * charLength));
  }
  return randomPassword;
};

export const phoneNumberReformat = (
  phone: string,
): {
  value: string;
  errorMsg: string | null;
  displayedValue: string;
} => {
  const validLength = /^0/g.test(phone) ? 10 : 9;
  let _phone = phone.replace(/^(\+84)|\D/g, '');
  _phone = _phone.substring(0, validLength);

  if (_phone.length === validLength) {
    _phone = _phone.replace(/^0/g, '');

    return {
      displayedValue: maskingPhoneNumber(_phone),
      errorMsg: null,
      value: `+84${_phone}`,
    };
  }

  return {
    displayedValue: _phone,
    value: _phone,
    errorMsg: `Sđt phải bao gồm ${validLength} chữ số`,
  };
};

const maskingPhoneNumber = (value: string) => {
  let i = 0;
  const v = value.toString();

  return 'xxx xxx xxx'.replace(/x/g, _ => v[i++]);
};

export const numberWithDots = (x: number) => {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
};

export const secondsToMinute = (e: number) => {
  var m = Math.floor(e / 60)
    .toString()
    .padStart(2, '0');
  var s = Math.floor(e % 60)
    .toString()
    .padStart(2, '0');

  return `${m}:${s}`;
};

export const stringTruncate = (text: string, length: number) => {
  if (text.length > length) {
    return `${text.substring(0, length)}...`;
  }
  return text;
};

export const hashtagRegex =
  /[#][^(!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|`|-|{|}|\||\\|\s|\n)]+/g;

export function validURL(str: string) {
  var pattern = new RegExp('^(https?:\\/\\/)' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}
