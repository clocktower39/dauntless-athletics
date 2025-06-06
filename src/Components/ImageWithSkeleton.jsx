import React, { useState } from "react";
import { Skeleton, Box } from "@mui/material";

const ImageWithSkeleton = ({ src, alt = "", style = {}, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <Skeleton
          variant="rectangular"
          sx={{
            ...style,
            height: 450,
            display: "inline-block",
            bgcolor: "grey.900",
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          ...style,
          display: loaded ? "inline" : "none",
        }}
        {...props}
      />
    </>
  );
};

export default ImageWithSkeleton;
