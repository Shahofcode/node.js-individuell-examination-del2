const createDeliveryTime = () => {
  const orderTime = Math.floor(Math.random() * (45 - 25 + 1) + 25);
  const currentDate = new Date();
  const hour = currentDate.getHours();
  const min = currentDate.getMinutes();

  let deliveryHour = hour;
  let deliveryMin = min + orderTime;

  if (deliveryMin >= 60) {
    deliveryHour += Math.floor(deliveryMin / 60);
    deliveryMin %= 60;
  }

  const deliveryTime = `${deliveryHour}:${
    deliveryMin < 10 ? "0" + deliveryMin : deliveryMin
  }`;

  return deliveryTime;
};

export default createDeliveryTime;
