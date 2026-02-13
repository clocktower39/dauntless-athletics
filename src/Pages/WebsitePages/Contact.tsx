import { useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import WebsiteNavbar from "./WebsiteNavbar";
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import HolidayClosure from "../../Components/HolidayClosure";
import Footer from "../../Components/Footer";
import {
  ContactPhoneOutlined as ContactPhoneOutlinedIcon,
  Phone as PhoneIcon,
  EventAvailableOutlined as EventAvailableOutlinedIcon,
  EventBusyOutlined as EventBusyOutlinedIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";

const classes = {
  mainImgBox: {
    backgroundColor: "var(--color-surface)",
    borderBottom: "1px solid var(--color-border)",
    padding: "18px 0",
  },
  overlayText: {
    width: "100%",
    fontFamily: "var(--font-display)",
    fontSize: "2.2em",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  contactFormTextField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "var(--color-border)",
      },
      "&:hover fieldset": {
        borderColor: "var(--color-accent)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--color-accent)",
      },
      backgroundColor: "var(--color-surface-2)",
      color: "var(--color-text)",
    },
    "& .MuiInputLabel-root": {
      color: "var(--color-muted)",
    },
    "& .MuiInputBase-input": {
      color: "var(--color-text)",
    },
  },
};

type ContactFieldKey = "name" | "email" | "phoneNumber"| "subject" | "message";

type ContactField = {
  label: string;
  value: string;
  error: boolean | null;
  helperText: string | null;
  type?: string;
  multiline?: boolean;
  minRows?: number;
};

type ContactFormData = Record<ContactFieldKey, ContactField>;

type ContactFormInputProps = {
  fieldProperty: ContactFieldKey;
  label: string;
  value: string;
  error: boolean | null;
  helperText: string | null;
  type?: string;
  multiline?: boolean;
  minRows?: number;
  setContactFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
}

const ContactFormInput = ({
  fieldProperty,
  label,
  value,
  error,
  multiline = false,
  minRows = 1,
  helperText,
  type,
  setContactFormData,
}: ContactFormInputProps) => {
  return (
    <Grid container size={12} sx={{ ...classes.contactFormTextField }}>
      <TextField
        color="secondary"
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
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
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

  const fieldProperties = Object.keys(contactFormData) as ContactFieldKey[];

  const setError = (fieldProperty: ContactFieldKey, hasError: boolean, helperText: string | null) => {
    setContactFormData((prev) => ({
      ...prev,
      [fieldProperty]: {
        ...prev[fieldProperty],
        error: hasError,
        helperText: helperText,
      },
    }));
  };

  const handleContactSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
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
            <Grid container size={8} alignItems="center">
              <Typography sx={classes.overlayText} variant="h4">
                Contact Us
              </Typography>
            </Grid>
            <Grid container size={4} justifyContent="flex-end" alignItems="center">
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
          backgroundColor: "transparent",
          fontFamily: "var(--font-body)",
          fontSize: "24px",
          color: "var(--color-text)",
          padding: { xs: "30px 0", md: "50px 0" },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "28px",
            padding: { xs: "24px", md: "36px" },
            boxShadow: "0 28px 50px rgba(0,0,0,0.45)",
          }}
        >
          <Grid container spacing={1}>
            <Grid
              container
              size={{ xs: 12, sm:6, md: 3 }}
              sx={{
                backgroundColor: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              <Grid container size={12} justifyContent="center">
                <PhoneIcon sx={{ fontSize: "5em", padding: "25px 0", color: "var(--color-accent)" }} />
              </Grid>
              <Grid container size={12} justifyContent="center">
                <Typography textAlign="center" sx={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>
                  CONTACT
                </Typography>
              </Grid>
              <Grid
                container
                size={12}
                justifyContent="center"
                sx={{
                  padding: "15px 0",
                  flexGrow: 1,
                  minHeight: "150px",
                  alignContent: "flex-start",
                }}
              >
                <Grid container size={12} justifyContent="center">
                  <Typography
                    sx={{
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      color: "var(--color-muted)",
                    }}
                  >
                    <a href="tel:4802143908">(480) 214-3908</a>
                  </Typography>
                </Grid>
                <Grid container size={12} justifyContent="center">
                  <Typography
                    sx={{
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      color: "var(--color-muted)",
                    }}
                  >
                    {" "}
                    <a href="mailto:info@dauntlessathletics.com">info@dauntlessathletics.com</a>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              size={{ xs: 12, sm:6, md: 3 }}
              sx={{
                backgroundColor: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              <Grid container size={12} justifyContent="center">
                <EventAvailableOutlinedIcon
                  sx={{ color: "var(--color-accent)", fontSize: "5em", padding: "25px 0" }}
                />
              </Grid>
              <Grid container size={12} justifyContent="center">
                <Typography textAlign="center" sx={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>
                  CLASS SCHEDULE
                </Typography>
              </Grid>
              <Grid
                container
                size={12}
                justifyContent="center"
                sx={{ padding: "15px 0", flexGrow: 1, minHeight: "150px" }}
              >
                <Typography
                  component={Link}
                  to={"/class-schedule/#"}
                  sx={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    color: "var(--color-muted)",
                  }}
                >
                  See Class Schedule
                </Typography>
              </Grid>
            </Grid>

            <Grid
              container
              size={{ xs: 12, sm:6, md: 3 }}
              sx={{
                backgroundColor: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              <Grid container size={12} justifyContent="center">
                <EventBusyOutlinedIcon
                  sx={{ color: "var(--color-accent)", fontSize: "5em", padding: "25px 0" }}
                />
              </Grid>
              <Grid container size={12} justifyContent="center">
                <Typography textAlign="center" sx={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>
                  HOLIDAY SCHEDULE
                </Typography>
              </Grid>
              <Grid
                container
                size={12}
                justifyContent="center"
                sx={{ padding: "15px 0", flexGrow: 1, flexShrink: 0, minHeight: "150px" }}
              >
                <HolidayClosure />
              </Grid>
            </Grid>

            <Grid
              container
              size={{ xs: 12, sm:6, md: 3 }}
              sx={{
                backgroundColor: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              <Grid container size={12} justifyContent="center">
                <LocationOnIcon
                  sx={{ color: "var(--color-accent)", fontSize: "5em", padding: "25px 0" }}
                />
              </Grid>
              <Grid container size={12} justifyContent="center">
                <Typography textAlign="center" sx={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>
                  ADDRESS
                </Typography>
              </Grid>
              <Grid
                container
                size={12}
                justifyContent="center"
                sx={{ padding: "15px", flexGrow: 1, minHeight: "150px" }}
              >
                <Typography
                  textAlign="center"
                  sx={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    color: "var(--color-muted)",
                  }}
                >
                  1501 E. Baseline Rd., Building 5, Suite 106 Gilbert, AZ 85233
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Box
              sx={{
                width: "100%",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                boxShadow: "0 24px 40px rgba(0,0,0,0.35)",
                margin: '15px 0'
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3331.796753358821!2d-111.80131568449212!3d33.376371860489485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872ba8fa94329e07%3A0xf92b7042f9fabc0d!2sDauntless%20Athletics!5e0!3m2!1sen!2sus!4v1607308532613!5m2!1sen!2sus"
                width="100%"
                height="450"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
              ></iframe>
            </Box>
          </Grid>
          <Grid container spacing={3} sx={{ padding: "25px 0" }}>
            <Grid container size={12}>
              <Typography sx={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>
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

            <Grid container size={12}>
              <Button
                variant="contained"
                onClick={handleContactSubmit}
                disabled={loading}
                sx={{
                  backgroundColor: loading ? "rgba(255,255,255,0.2)" : "var(--color-accent)",
                  color: "var(--color-text)",
                  borderRadius: "999px",
                  padding: "10px 28px",
                  boxShadow: "0 16px 26px rgba(215, 38, 56, 0.35)",
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "var(--color-muted)",
                  },
                  "&:hover": {
                    backgroundColor: "var(--color-accent-2)",
                  },
                }}
              >
                Submit Message
              </Button>
            </Grid>
            {contactFormSubmissionStatus.error && (
              <Grid container size={12}>
                <Typography sx={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--color-accent)" }}>
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
