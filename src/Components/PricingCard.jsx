import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { KeyboardArrowRight } from "@mui/icons-material";
import PropTypes from "prop-types";

function PricingCard(props) {
  const {
    title,
    cost,
    duration,
    buttonText,
    buttonLink,
    backgroundColor,
    optionalTextList = [],
  } = props;

  const styles = {
    card: {
      width: 275,
      m: 1,
      textAlign: "center",
      backgroundColor,
      color: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    cardContent: {
      padding: "50px 0",
      position: "relative", // To position the pseudo-element correctly
      flexGrow: "1",
    },
    cardActions: {
      justifyContent: "center",
      p: 2,
      backgroundColor: "#fff",
      position: "relative",
      flexDirection: "column",
    },
    button: {
      backgroundColor: "rgb(57, 61, 80)",
      color: "#FFF",
      borderRadius: "25px",
    },
  };

  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.cardContent}>
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          sx={{ padding: "10px", fontFamily: "montserrat" }}
        >
          {title.toUpperCase()}
        </Typography>
        <Typography
          variant="h2"
          component="div"
          color="#ffffff"
          sx={{ fontFamily: "montserrat" }}
        >
          {cost}
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="#ffd54f">
          {duration}
        </Typography>
      </CardContent>

      <Box>
        <Button
          disabled
          sx={{
            width: "50%",
            backgroundColor: "white",
            borderRadius: "0 35px 0 0",
            height: "55px",
          }}
        ></Button>
        <Button
          disabled
          sx={{
            width: "50%",
            backgroundColor: "white",
            borderRadius: "35px 0 0 0",
            height: "55px",
          }}
        ></Button>
      </Box>

      <CardActions sx={styles.cardActions}>
        <Box sx={{ margin: '-25px 0 15px 0'}}>
          {optionalTextList.map((message, index, thisList) => {
            return (
              <>
                <Typography color="rgb(95, 114, 127)" sx={{ padding: '10px 0', }}>{message}</Typography>
                {index !== thisList.length - 1 && <Divider />}
              </>
            );
          })}
        </Box>
        <Button variant="contained" size="large" href={buttonLink} sx={styles.button}>
          <KeyboardArrowRight />
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
}

PricingCard.propTypes = {
  title: PropTypes.string.isRequired,
  cost: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonLink: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  optionalTextList: PropTypes.array,
};

export default PricingCard;
