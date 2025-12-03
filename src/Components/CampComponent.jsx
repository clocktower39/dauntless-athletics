import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function CampComponent({ camp, index }) {
  const today = dayjs.utc().add(-31, "hours").startOf("day");
  const [zoomImage, setZoomImage] = useState(false);

  const hasDatePast = (camp) => {
    return dayjs(camp.EndTime).utc().isAfter(today, "day");
  };

  return (
    hasDatePast(camp) && (
      <Grid size={{ xs: 12, sm: 6, md: 4, }} sx={{ margin: "50px 0" }}>
        <Grid container justifyContent="center">
          {camp.icon ? (
            <Box
              sx={{
                backgroundColor: "#5F6574",
                borderRadius: "50%",
              }}
            >
              <Box
                sx={{
                  backgroundColor: camp.color || "#000",
                  borderRadius: "50%",
                  margin: "5px",
                }}
              >
                {camp?.icon}
              </Box>
            </Box>
          ) : camp.poster ? (
            <Box
              sx={{
                height: '100%',
                margin: "5px",
              }}
              onClick={() => setZoomImage(true)}
            >
              <img src={camp?.poster} style={{ height: "100%", width: "250px", borderRadius: '5%', }} />
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                margin: "5px",
              }}
              onClick={() => setZoomImage(true)}
            >
              <video
                src={camp?.video}
                type="video/mp4"
                autoPlay muted loop playsInline webkit-playsinline="true"
                style={{ height: "100%", width: "250px", borderRadius: '5%', }}
              />
            </Box>
          )}
        </Grid>
        <Grid container justifyContent="center">
          <Typography
            color={camp.color || "#FFF"}
            variant="h5"
            textAlign="center"
            sx={{ fontFamily: "montserrat", padding: "15px 0", maxWidth: "250px" }}
          >
            {camp.Subject}
          </Typography>
        </Grid>
        <Grid container justifyContent="center">
          <Typography textAlign="center" sx={{ fontFamily: "source sans pro" }}>
            <strong>Date:</strong>{" "}{dayjs(camp.StartTime).format("dddd, MMMM Do")}
          </Typography>
        </Grid>
        <Grid container justifyContent="center">
          <Typography textAlign="center" sx={{ fontFamily: "source sans pro" }}>
            <strong>Time:</strong> {dayjs(camp.StartTime).format("h:mm")} - {dayjs(camp.EndTime).format("h:mm a")}
          </Typography>
        </Grid>
        <Grid container justifyContent="center">
          <Typography textAlign="center" sx={{ fontFamily: "source sans pro" }}>
            <strong>Place:</strong> {camp.place}
          </Typography>
        </Grid>
        <Grid container justifyContent="center">
          <Typography textAlign="center" sx={{ fontFamily: "source sans pro" }}>
            <strong>Cost:</strong>{" "}
            {camp.cost.week
              ? `$${camp.cost.day} per day OR $${camp.cost.week} a week`
              : `$${camp.cost}`}{" "}
            per athlete
          </Typography>
        </Grid>
        <Grid container justifyContent="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: "rgb(58, 58, 58)", margin: "25px 0", borderRadius: "25px" }}
            href={camp.link.href}
          >
            {camp.link.innerText}
          </Button>
        </Grid>

        {/* Fullscreen Dialog */}
        <Dialog
          open={zoomImage}
          onClose={() => setZoomImage(false)}
          maxWidth="xl"
          PaperProps={{
            sx: {
              backgroundColor: "rgba(0,0,0,0.9)",
              boxShadow: "none",
              overflow: "hidden",
            },
          }}
        >
          <DialogContent
            sx={{
              p: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              cursor: "zoom-out",
            }}
            onClick={() => setZoomImage(false)}
          >
            <Box
              component={camp.poster ? "img" : "video"}
              src={camp.poster ? camp.poster : camp.video}
              autoPlay muted loop playsInline webkit-playsinline="true"
              sx={{
                maxWidth: "95vw",
                maxHeight: "95vh",
                borderRadius: 2,
                boxShadow: 5,
              }}
            />
          </DialogContent>
        </Dialog>
      </Grid>
    )
  );
}
