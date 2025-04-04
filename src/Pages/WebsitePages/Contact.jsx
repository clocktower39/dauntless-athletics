import React, { useState } from "react";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Button, Container, Divider, Grid, TextField, Typography } from "@mui/material";
import Footer from "../../Components/Footer";
import ContactBannerImg from "../../assets/ContactBannerImg.jpg";
import {
  ContactPhoneOutlined as ContactPhoneOutlinedIcon,
  Phone as PhoneIcon,
  EventAvailableOutlined as EventAvailableOutlinedIcon,
  EventBusyOutlined as EventBusyOutlinedIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";

const classes = {
  mainImgBox: {
    backgroundColor: `#F44336`,
    padding: "7.5px",
  },
  overlayText: {
    width: "100%",
    fontFamily: "montserrat",
    fontSize: "2.2em",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  contactFormTextField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgb(57, 64, 80)", // Outline color
      },
      "&:hover fieldset": {
        borderColor: "rgb(57, 64, 80)", // Outline color on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgb(57, 64, 80)", // Outline color when focused
      },
      backgroundColor: "rgb(24, 24, 40)", // Background color
      color: "white", // Font color
    },
    "& .MuiInputLabel-root": {
      color: "white", // Label color
    },
  },
};

const ContactFormInput = ({
  fieldProperty,
  label,
  value,
  error,
  multiline = false,
  minRows = null,
  helperText,
  type,
  setContactFormData,
}) => {
  return (
    <Grid container item xs={12} sx={{ ...classes.contactFormTextField }}>
      <TextField
        color="secondary"
        sx={classes.textField}
        fullWidth
        label={label}
        value={value}
        error={!!error}
        helperText={error ? helperText : null}
        multiline={multiline}
        minRows={minRows}
        type={type}
        onChange={(e) =>
          setContactFormData((prev) => ({
            ...prev,
            [fieldProperty]: {
              ...prev[fieldProperty],
              value: e.target.value,
              error: false,
              helperText: null,
            },
          }))
        }
        required
      />
    </Grid>
  );
};

export default function Contact() {
  const [contactFormData, setContactFormData] = useState({
    name: {
      label: "Name",
      value: "",
      error: null,
      helperText: null,
      type: "text",
    },
    email: {
      label: "Email",
      value: "",
      error: null,
      helperText: null,
      type: "email",
    },
    phoneNumber: {
      label: "Phone Number",
      value: "",
      error: null,
      helperText: null,
      type: "phone",
    },
    subject: {
      label: "Subject",
      value: "",
      error: null,
      helperText: null,
      type: "text",
    },
    message: {
      label: "Message",
      value: "",
      error: null,
      helperText: null,
      type: "text",
      multiline: true,
      minRows: 4,
    },
  });

  const [contactFormSubmissionStatus, setContactFormSubmissionStatus] = useState({
    status: "draft",
    error: false,
    errorMessage: "",
  });

  const [loading, setLoading] = useState(false);

  const fieldProperties = Object.keys(contactFormData);

  const setError = (fieldProperty, hasError, helperText) => {
    setContactFormData((prev) => ({
      ...prev,
      [fieldProperty]: {
        ...prev[fieldProperty],
        error: hasError,
        helperText: helperText,
      },
    }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setContactFormSubmissionStatus({
      status: "draft",
      error: false,
      errorMessage: "",
    });
    let formHasErrors = false;

    fieldProperties.forEach((fieldProperty) => {
      if (contactFormData[fieldProperty].value === "") {
        setError(fieldProperty, true, `${contactFormData[fieldProperty].label} is required.`);
        formHasErrors = true;
      } else {
        setError(fieldProperty, false, null);
      }
    });

    if (formHasErrors) {
      setContactFormSubmissionStatus({
        status: "draft",
        error: true,
        errorMessage: "Please correct the above errors before sending.",
      });
      setLoading(false);
    } else {
      setTimeout(() => {
        setContactFormSubmissionStatus({
          status: "error",
          error: true,
          errorMessage:
            "Error sending, please try again or directly email info@dauntlessathletics.com",
        });
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <WebsiteNavbar />
      <Box sx={classes.mainImgBox}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid container item xs={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                Contact Us
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent="flex-end" alignItems="center">
              <ContactPhoneOutlinedIcon
                sx={{
                  fontSize: "5em",
                  maxHeight: "5em",
                  maxWidth: "5em",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          backgroundColor: "#000",
          fontFamily: "source sans pro",
          fontSize: "24px",
          color: "#fff",
        }}
      >
        <Container maxWidth="lg">
          <Grid container sx={{ padding: "25px 0" }}>
            <Grid container item xs={12} md={3}>
              <Grid container item xs={12} justifyContent="center">
                <PhoneIcon sx={{ fontSize: "64px", padding: "25px 0" }} />
              </Grid>
              <Grid container item xs={12} justifyContent="center">
                <Typography textAlign="center" sx={{ fontFamily: "montserrat", fontSize: "36px" }}>
                  CONTACT
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                sx={{
                  padding: "15px 0",
                  flexGrow: 1,
                  minHeight: "150px",
                  alignContent: "flex-start",
                }}
              >
                <Grid container item xs={12} justifyContent="center">
                  <Typography
                    sx={{
                      fontFamily: "source sans pro",
                      fontSize: "16px",
                    }}
                  >
                    (480) 214-3908
                  </Typography>
                </Grid>
                <Grid container item xs={12} justifyContent="center">
                  <Typography
                    sx={{
                      fontFamily: "source sans pro",
                      fontSize: "16px",
                    }}
                  >
                    {" "}
                    info@dauntlessathletics.com
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid container item xs={12} md={3}>
              <Grid container item xs={12} justifyContent="center">
                <EventAvailableOutlinedIcon
                  sx={{ color: "rgb(76, 173, 201)", fontSize: "64px", padding: "25px 0" }}
                />
              </Grid>
              <Grid container item xs={12} justifyContent="center">
                <Typography textAlign="center" sx={{ fontFamily: "montserrat", fontSize: "36px" }}>
                  CLASS SCHEDULE
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                sx={{ padding: "15px 0", flexGrow: 1, minHeight: "150px" }}
              >
                <Typography
                  sx={{
                    fontFamily: "source sans pro",
                    fontSize: "16px",
                  }}
                >
                  See Class Schedule
                </Typography>
              </Grid>
            </Grid>

            <Grid container item xs={12} md={3}>
              <Grid container item xs={12} justifyContent="center">
                <EventBusyOutlinedIcon
                  sx={{ color: "rgb(117, 214, 156)", fontSize: "64px", padding: "25px 0" }}
                />
              </Grid>
              <Grid container item xs={12} justifyContent="center">
                <Typography textAlign="center" sx={{ fontFamily: "montserrat", fontSize: "36px" }}>
                  HOLIDAY SCHEDULE
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                sx={{ padding: "15px 0", flexGrow: 1, flexShrink: 0, minHeight: "150px" }}
              >
                <ul
                  style={{
                    fontFamily: "source sans pro",
                    fontSize: "16px",
                    paddingLeft: "0", // Remove default padding of the ul
                  }}
                >
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Apr 18th – Apr 20th:</span>
                    <span style={{ paddingLeft: "25px" }}>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>May 26th:</span>
                    <span>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Jun 29th – Jul 6th:</span>
                    <span>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Sept 1st:</span>
                    <span>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Oct 31st:</span>
                    <span>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Nov 26th – Nov 30th:</span>
                    <span>Closed</span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Dec 24th – Jan 4th:</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </Grid>
            </Grid>

            <Grid container item xs={12} md={3}>
              <Grid container item xs={12} justifyContent="center">
                <LocationOnIcon
                  sx={{ color: "rgb(244, 82, 77)", fontSize: "64px", padding: "25px 0" }}
                />
              </Grid>
              <Grid container item xs={12} justifyContent="center">
                <Typography textAlign="center" sx={{ fontFamily: "montserrat", fontSize: "36px" }}>
                  ADDRESS
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                sx={{ padding: "15px", flexGrow: 1, minHeight: "150px" }}
              >
                <Typography
                  textAlign="center"
                  sx={{
                    fontFamily: "source sans pro",
                    fontSize: "16px",
                  }}
                >
                  1501 E. Baseline Rd., Building 5, Suite 106 Gilbert, AZ 85233
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item justifyContent="center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3331.796753358821!2d-111.80131568449212!3d33.376371860489485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872ba8fa94329e07%3A0xf92b7042f9fabc0d!2sDauntless%20Athletics!5e0!3m2!1sen!2sus!4v1607308532613!5m2!1sen!2sus"
              width="100%"
              height="450"
              frameborder="0"
              style={{ border: 0 }}
              allowfullscreen=""
              aria-hidden="false"
              tabindex="0"
            ></iframe>
          </Grid>
          <Grid container spacing={3} sx={{ padding: "25px 0" }}>
            <Grid container item xs={12}>
              <Typography sx={{ fontFamily: "montserrat", fontSize: "36px" }}>
                CONTACT OUR TEAM
              </Typography>
            </Grid>

            {fieldProperties.map((fieldProperty) => (
              <ContactFormInput
                key={fieldProperty}
                fieldProperty={fieldProperty}
                label={contactFormData[fieldProperty].label}
                value={contactFormData[fieldProperty].value}
                error={contactFormData[fieldProperty].error}
                helperText={contactFormData[fieldProperty].helperText}
                type={contactFormData[fieldProperty].type || "text"}
                setContactFormData={setContactFormData}
                multiline={contactFormData[fieldProperty].multiline}
                minRows={contactFormData[fieldProperty].minRows}
              />
            ))}

            <Grid container item xs={12}>
              <Button
                variant="contained"
                onClick={handleContactSubmit}
                disabled={loading}
                sx={{
                  backgroundColor: loading ? "grey.500" : "primary.main",
                  color: "white",
                  "&.Mui-disabled": {
                    backgroundColor: "grey.700",
                    color: "grey.300",
                  },
                }}
              >
                Submit Message
              </Button>
            </Grid>
            {contactFormSubmissionStatus.error && (
              <Grid container item xs={12}>
                <Typography sx={{ fontFamily: "montserrat", fontSize: "16px", color: "#ff0000" }}>
                  {contactFormSubmissionStatus.errorMessage}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
