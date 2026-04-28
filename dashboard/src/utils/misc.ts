export function formatDate(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const days = date.getDate();
  const months = date.getMonth() + 1;
  const years = date.getFullYear();

  const hoursString = String(hours).padStart(2, "0");
  const minutesString = String(minutes).padStart(2, "0");
  const secondsString = String(seconds).padStart(2, "0");
  const daysString = String(days).padStart(2, "0");
  const monthsString = String(months).padStart(2, "0");
  const yearsString = String(years).padStart(4, "0");

  return `${hoursString}:${minutesString}:${secondsString} ${daysString}/${monthsString}/${yearsString}`;
}

export function formatFloat(value: number, decimalPlaces: number): string {
  return (Math.round(value * 10 ** decimalPlaces) / 10 ** decimalPlaces).toFixed(decimalPlaces);
}
