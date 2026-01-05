import React, { Fragment } from "react";
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
      backgroundColor: backgroundColor || "var(--color-surface)",
      color: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "1px solid var(--color-border)",
      borderRadius: "20px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.35)",
      overflow: "hidden",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0 26px 50px rgba(0, 0, 0, 0.45)",
      },
    },
    cardContent: {
      padding: "50px 0",
      position: "relative",
      flexGrow: "1",
    },
    cardActions: {
      justifyContent: "center",
      p: 2,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      position: "relative",
      flexDirection: "column",
    },
    button: {
      backgroundColor: "var(--color-accent)",
      color: "#FFF",
      borderRadius: "999px",
      padding: "10px 24px",
      "&:hover": {
        backgroundColor: "var(--color-accent-2)",
      },
    },
  };

  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.cardContent}>
        <Typography variant="h5" component="div" gutterBottom sx={{ padding: "10px" }}>
          {title.toUpperCase()}
        </Typography>
        <Typography variant="h2" component="div" color="#ffffff">
          {cost}
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="rgba(255,255,255,0.7)">
          {duration}
        </Typography>
      </CardContent>

      <Divider sx={{ borderColor: "var(--color-border)" }} />

      <CardActions sx={styles.cardActions}>
        <Box sx={{ margin: "-25px 0 15px 0" }}>
          {optionalTextList.map((message, index, thisList) => {
            return (
              <Fragment key={index}>
                <Typography color="var(--color-muted)" sx={{ padding: "10px 0" }}>
                  {message}
                </Typography>
                {index !== thisList.length - 1 && <Divider />}
              </Fragment>
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
