/**
 * from 0 to 23
 */
export const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString());

/**
 * from 0 to 55 by 5
 */
export const minuteOptions = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString()
);

/**
 * from 0:00 to 23:55 by 5 minutes
 */
const formattedHours = hourOptions.map((hour) =>
  hour.toString().padStart(2, "0")
);
const formattedMinutes = minuteOptions.map((minute) =>
  minute.toString().padStart(2, "0")
);
const _timeOptions = [];
for (let hour = 0; hour < formattedHours.length; hour++) {
  const formattedHour = formattedHours[hour];
  for (let minute = 0; minute < formattedMinutes.length; minute++) {
    _timeOptions.push(`${formattedHour}:${formattedMinutes[minute]}`);
  }
}
export const timeOptions = _timeOptions;
