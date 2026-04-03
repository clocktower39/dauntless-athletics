import dayjs from "dayjs";

const formatClosureRange = (startDate: Date, endDateExclusive: Date) => {
  const endDateInclusive = new Date(endDateExclusive);
  endDateInclusive.setDate(endDateInclusive.getDate() - 1);

  return `${dayjs.utc(startDate).format("dddd, MMMM Do")} through ${dayjs
    .utc(endDateInclusive)
    .format("dddd, MMMM Do")}`;
};

export const holidayScheduleEvents = [
  {
    Id: 20260329,
    Subject: "10 Years of Dauntless Athletics",
    StartTime: new Date(2026, 2, 29, 14, 0),
    EndTime: new Date(2026, 2, 29, 18, 0),
    IsAllDay: false,
    zIndex: 1,
    description: "Come help us celebrate 10 years of Dauntless Athletics on Sunday March 29, 2026 from 2:00 pm - 6:00 pm. Thank you for being part of this incredible journey over the 10 years.",
  },
  {
    Id: 20250418,
    Subject: "Closed",
    StartTime: new Date(2026, 3, 3, 0, 0),
    EndTime: new Date(2026, 3, 6, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
    description: `We are closed for all classes from ${formatClosureRange(
      new Date(2026, 3, 3, 0, 0),
      new Date(2026, 3, 6, 0, 0),
    )}. Happy Easter!`,
  },
  {
    Id: 20250526,
    Subject: "Closed",
    StartTime: new Date(2026, 4, 25, 0, 0),
    EndTime: new Date(2026, 4, 26, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
    description: `We are closed for all classes from ${formatClosureRange(
      new Date(2026, 4, 25, 0, 0),
      new Date(2026, 4, 26, 0, 0),
    )}. Happy Memorial Day!`,
  },
  {
    Id: 20251031,
    Subject: "Closed",
    StartTime: new Date(2026, 5, 28, 0, 0),
    EndTime: new Date(2026, 6, 6, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
    description: `We are closed for all classes from ${formatClosureRange(
      new Date(2026, 5, 28, 0, 0),
      new Date(2026, 6, 6, 0, 0),
    )}. Enjoy the holiday break!`,
  },
  {
    Id: 20251031,
    Subject: "Closed",
    StartTime: new Date(2026, 8, 7, 0, 0),
    EndTime: new Date(2026, 8, 8, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
    description: `We are closed for all classes from ${formatClosureRange(
      new Date(2026, 8, 7, 0, 0),
      new Date(2026, 8, 8, 0, 0),
    )}. Happy Labor Day!`,
  },
  {
    Id: 20251126,
    Subject: "Closed",
    StartTime: new Date(2026, 10, 25, 0, 0),
    EndTime: new Date(2026, 10, 30, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
    description: `We are closed for all classes from ${formatClosureRange(
      new Date(2026, 10, 25, 0, 0),
      new Date(2026, 10, 30, 0, 0),
    )}. Happy Thanksgiving!`,
  },
  {
    Id: 20251224,
    Subject: "Closed",
    StartTime: new Date(2026, 11, 24, 0, 0),
    EndTime: new Date(2027, 0, 4, 0, 0),
    IsAllDay: true,
    IsBlock: true,
    zIndex: 1,
    description: `We are closed for all classes from ${formatClosureRange(
      new Date(2026, 11, 24, 0, 0),
      new Date(2027, 0, 4, 0, 0),
    )}. Happy Holidays!`,
  },
];
