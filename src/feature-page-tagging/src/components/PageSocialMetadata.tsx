import { PageSocialMetadataType } from '../models/PageSocialMetadata';

interface PageMetadataProps {
  pageSocialMetadata: PageSocialMetadataType;
}

const PageSocialMetadata = (props: PageMetadataProps) => {
  const { pageSocialMetadata } = props;

  return (
    <>
      {(!(
        !pageSocialMetadata.twitterCreator.value || !pageSocialMetadata.twitterCreator.value.trim()
      ) ||
        !(!pageSocialMetadata.twitterSite || !pageSocialMetadata.twitterSite.value.trim())) && (
        <>
          <meta name="twitter:card" content={pageSocialMetadata.twitterCardType.value} />
          {!(
            !pageSocialMetadata.twitterCreator.value ||
            !pageSocialMetadata.twitterCreator.value.trim()
          ) && <meta name="twitter:creator" content={pageSocialMetadata.twitterCreator.value} />}
          {!(!pageSocialMetadata.twitterSite || !pageSocialMetadata.twitterSite.value.trim()) && (
            <meta name="twitter:site" content={pageSocialMetadata.twitterSite.value} />
          )}
        </>
      )}
      {!(
        pageSocialMetadata.metaDescription.value && pageSocialMetadata.metaDescription.value !== ''
      ) && <meta property="og:description" content={pageSocialMetadata.metaDescription.value} />}
      {!(
        pageSocialMetadata.socialThumbnail.value && pageSocialMetadata.socialThumbnail.value !== ''
      ) && <meta property="og:image" content={pageSocialMetadata.socialThumbnail.value} />}
      <meta property="og:title" content={pageSocialMetadata.browserTitle.value} />
      <meta property="og:url" content={pageSocialMetadata.siteUrl} />
    </>
  );
};

export default PageSocialMetadata;
