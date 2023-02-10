function caculateAmountOrRate(price, amount, rate, max_discount) {
  let calculatedPrice = price;
  let discountedPrice = 0;
  if (amount) {
    if (calculatedPrice > amount) {
      calculatedPrice = calculatedPrice - amount;
      discountedPrice = amount;
    } else {
      discountedPrice = calculatedPrice;
      calculatedPrice = 0;
    }
  } else if (rate) {
    discountedPrice = calculatedPrice * (rate / 100);
    if (max_discount && discountedPrice > max_discount) {
      discountedPrice = max_discount;
    }
    calculatedPrice = calculatedPrice - discountedPrice;
  }
  return { calculatedPrice, discountedPrice };
}

export function calculateCoupon(couponCode, productSum, deliverySum, totalSum) {
  const {
    discount_price,
    discount_rate,
    max_discount_price,
    scope,
    code,
  } = couponCode;
  let newProductSum = productSum;
  let newDeliverySum = deliverySum;
  let couponDiscounted = 0;
  let newTotalSum = productSum + newDeliverySum;
  if (code == 'DABIBETA') {
    const { calculatedPrice, discountedPrice } = caculateAmountOrRate(
      productSum,
      discount_price,
      discount_rate,
      max_discount_price,
    );
    couponDiscounted = discountedPrice + deliverySum;
    newTotalSum = calculatedPrice + newDeliverySum;
    return { newProductSum, newDeliverySum, couponDiscounted, newTotalSum };
  }
  switch (scope) {
    case 'shipping':
      const { calculatedPrice, discountedPrice } = caculateAmountOrRate(
        deliverySum,
        discount_price,
        discount_rate,
        max_discount_price,
      );
      couponDiscounted = discountedPrice;
      newTotalSum = newProductSum + Price;
      return { newProductSum, newDeliverySum, couponDiscounted, newTotalSum };
    default:
      return { newProductSum, newDeliverySum, couponDiscounted, newTotalSum };
  }
}

export function getPrice(product_option) {
  const { original_price, discount_price } = product_option;
  if (discount_price) {
    return discount_price;
  } else {
    return original_price;
  }
}
export function calculatePrice(orderList) {
  let productSum = 0;
  let deliverySum = 0;
  orderList.map(({ quantity, product_option }) => {
    const price = getPrice(product_option);
    const { shipping_price } = product_option;
    productSum += price * quantity;
    deliverySum += shipping_price;
  });
  let totalSum = productSum + deliverySum;
  return { productSum, deliverySum, totalSum };
}

export function getOptionString(color, size, extraOption) {
  const colorAndSizeString =
    (color ? color.toUpperCase() : '') +
    (size && color ? ' / ' : '') +
    (size ? size.toUpperCase() : '');
  const nameString = extraOption
    ? extraOption.toUpperCase()
    : colorAndSizeString;
  return nameString;
}

export function getUniqueListBy(arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}
