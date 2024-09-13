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
