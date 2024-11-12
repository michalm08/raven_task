const calculateFee = (parkingInputData) => {
  const { startTime, endTime, areas, selectedArea, parkingDate } =
    parkingInputData;
  if (!startTime || !endTime || !selectedArea || !parkingDate)
    return {
      totalTime: '',
      totalPrice: '',
    };

  const filteredArea = areas.find((area) => area.id === selectedArea);
  const price1 = filteredArea.rate1;
  const price2 = filteredArea.rate2;
  const discount = filteredArea.discount;

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const minutesInDay = 1440;

  let firstDayDuration = 0;
  let secondDayDuration = 0;

  if (endMinutes < startMinutes) {
    firstDayDuration = minutesInDay - startMinutes;
    secondDayDuration = endMinutes;
  } else {
    firstDayDuration = endMinutes - startMinutes;
  }

  const totalMinutes = firstDayDuration + secondDayDuration;

  const totalPrice =
    ((firstDayDuration * (isWeekend(parkingDate) ? price2 : price1) +
      secondDayDuration * (isNextDayWeekend(parkingDate) ? price2 : price1)) /
      60) *
    (1 - discount / 100);

  return {
    totalTime: totalMinutes,
    totalPrice: totalPrice.toFixed(2),
  };
};

const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
};

const isNextDayWeekend = (date) => {
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + 1);
  const nextDay = currentDate.getDay();
  return nextDay === 0 || nextDay === 6;
};

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

module.exports = { calculateFee };