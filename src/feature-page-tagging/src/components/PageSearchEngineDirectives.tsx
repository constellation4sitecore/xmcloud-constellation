interface PageSearchEngineDirectiveProps {
  pageSearchEngineDirectives: string;
}

const PageSearchEngineDirectives = (props: PageSearchEngineDirectiveProps): JSX.Element => {
  const { pageSearchEngineDirectives } = props;

  return (
    <>
      <meta name="robots" content={pageSearchEngineDirectives} />
    </>
  );
};

export default PageSearchEngineDirectives;
