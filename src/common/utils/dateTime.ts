function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function formatDateTimeStr(date: Date): string {
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  const datePart = `${date.getFullYear()}-${month}-${day}`;
  const timePart = `${hour}:${minute}:${second}`;
  const timeZone = -date.getTimezoneOffset() / 60;
  const timeZoneStr = timeZone >= 0 ? `+${timeZone}` : timeZone;
  return `${datePart}:${timePart}${timeZoneStr}`;
}
