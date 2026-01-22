import React from 'react'
import { Grid, } from '@mui/material';

const holidaySchedule = [
    "Apr 3rd – Apr 5th",
    "May 25th",
    "Jun 28th – Jul 5th",
    "Sept 7th",
    "Nov 25th – Nov 29th",
    "Dec 24th – Jan 3rd",
];

const HolidayClosure = () => {
    return (
        holidaySchedule.map((range) => (
            <Grid container size={12} sx={{
                color: "var(--color-muted)",
                fontFamily: "var(--font-body)",
                fontSize: "16px",
            }}>
                <Grid container size={8}>
                    {range}:
                </Grid>
                <Grid container size={4} justifyContent="flex-end">
                    Closed
                </Grid>
            </Grid>
        ))
    );
};

export default HolidayClosure