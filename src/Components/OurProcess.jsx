import { Box, Container, Grid, Typography } from "@mui/material";

const classes = {
    overlayText: {
        width: "100%",
        fontFamily: "montserrat",
        fontSize: "2.2em",
        fontWeight: 500,
        textTransform: "uppercase",
    },
    image: {
        display: "none",
        width: "auto",
        height: "100%",
        maxHeight: "900px",
    },
    stepImgBox: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
    },
    stepImage: {
        height: "144px",
        width: "144px",
    },
    stepOverlayText: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        textAlign: "center",
        width: "100%",
        fontFamily: "montserrat",
        fontSize: "1.5em",
        textTransform: "uppercase",
    },
};

function OurProcess() {
    return (
        <Box sx={{ backgroundColor: "#E9E9E9" }}>
            <Container maxWidth="sm">
                <Typography
                    textAlign="center"
                    color="rgb(76, 88, 103)"
                    variant="h5"
                    sx={{ fontFamily: "montserrat", padding: "50px 0" }}
                >
                    Our Process
                </Typography>
                <Typography
                    textAlign="center"
                    color="#4c5867"
                    variant="h6"
                    sx={{ fontWeight: 200, fontFamily: "source sans pro", paddingBottom: "50px" }}
                >
                    Our process incorporates 4 key steps starting from establishing which skills need to be
                    worked on, providing body control, and then getting the skill.
                </Typography>
            </Container>
            <Container maxWidth="lg">
                <Grid container spacing={5} sx={{ padding: "25px" }}>
                    <Grid container size={{ xs: 12, md: 3 }} justifyContent="center">
                        <Box>
                            <Box sx={classes.stepImgBox}>
                                <img src="/images/components/OurProcess/Step-1-Evaluate.png" alt="Step 1" style={classes.stepImage} />
                                <Typography sx={classes.stepOverlayText} variant="h4">
                                    Evaluate
                                </Typography>
                            </Box>
                            <Typography textAlign="center" color="rgb(95, 114, 127)">
                                Evaluate the athlete to determine which skills to focus on and next steps.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid container size={{ xs: 12, md: 3 }} justifyContent="center">
                        <Box>
                            <Box sx={classes.stepImgBox}>
                                <img src="/images/components/OurProcess/Step-2-Breakdown.png" alt="Step 2" style={classes.stepImage} />
                                <Typography sx={classes.stepOverlayText} variant="h4">
                                    Breakdown
                                </Typography>
                            </Box>
                            <Typography textAlign="center" color="rgb(95, 114, 127)">
                                Perform a detailed breakdown and guidance of the skill.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid container size={{ xs: 12, md: 3 }} justifyContent="center">
                        <Box>
                            <Box sx={classes.stepImgBox}>
                                <img src="/images/components/OurProcess/Step-3-Spot-It.png" alt="Step 3" style={classes.stepImage} />
                                <Typography sx={classes.stepOverlayText} variant="h4">
                                    Spot It
                                </Typography>
                            </Box>
                            <Typography textAlign="center" color="rgb(95, 114, 127)">
                                Spot the skill being worked on to help provide control and correct movements.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid container size={{ xs: 12, md: 3 }} justifyContent="center">
                        <Box>
                            <Box sx={classes.stepImgBox}>
                                <img src="/images/components/OurProcess/Step-4-Get-It.png" alt="Step 4" style={classes.stepImage} />
                                <Typography sx={classes.stepOverlayText} variant="h4">
                                    Get It
                                </Typography>
                            </Box>
                            <Typography textAlign="center" color="rgb(95, 114, 127)">
                                Get the skill minimizing the spot and correction needed.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default OurProcess