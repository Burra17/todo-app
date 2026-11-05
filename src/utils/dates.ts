export const secondsFromNow = (seconds: number) =>
  new Date(Date.now() + seconds * 1000);

export const tomorrowAt = (hour: number) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hour, 0, 0, 0);
  return date;
};

// Today at the given hour, or tomorrow if that time has already passed
export const nextAt = (hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  if (date.getTime() <= Date.now()) {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

// "idag 18:00", "imorgon 09:00" or "7 nov. 18:00"
export const formatReminder = (isoDate: string) => {
  const date = new Date(isoDate);
  const time = date.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return `idag ${time}`;
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return `imorgon ${time}`;
  }
  const day = date.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  });
  return `${day} ${time}`;
};
