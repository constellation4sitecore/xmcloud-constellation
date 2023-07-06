import { PageMetadataType } from '../models/PageMetadata';

interface PageMetadataProps {
  pageMetadata: PageMetadataType;
}

const PageMetadata = (props: PageMetadataProps): JSX.Element => {
  const { pageMetadata } = props;

  return (
    <>
      {pageMetadata && pageMetadata.keywords.value !== '' && (
        <meta name="keywords" content={pageMetadata.keywords.value} />
      )}
      {pageMetadata && pageMetadata.metaDescription.value !== '' && (
        <meta name="description" content={pageMetadata.metaDescription.value} />
      )}
      {pageMetadata && pageMetadata.hasValidPublisher && (
        <meta name="publisher" content={pageMetadata.metaPublisher.value} />
      )}
      {pageMetadata && pageMetadata.hasValidAuthor && (
        <meta name="author" content={pageMetadata.metaAuthor.value} />
      )}
    </>
  );
};

export default PageMetadata;
