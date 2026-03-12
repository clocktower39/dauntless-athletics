import { Helmet } from "react-helmet-async";

const BASE_URL = "https://dauntlessathletics.com";
const DEFAULT_IMAGE = `${BASE_URL}/dauntless_athletics_logo.png`;

export default function SEO({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  const canonical = path ? `${BASE_URL}${path}` : BASE_URL;
  const pageTitle = title ? `${title} | Dauntless Athletics` : "Dauntless Athletics";
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content="index,follow" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Dauntless Athletics" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
