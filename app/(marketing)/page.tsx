import Heading from "./_components/heading";
import Breadcrumb from "./_components/breadcrumb";
import GridBackground from "./_components/grid-background";
import Footer from "./_components/footer";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col relative">
      <GridBackground />
      <div className="flex flex-col items-center md:justify-start text-center gap-y-5 flex-1 px-6 ph-10 z-10">
        <Breadcrumb />
        <Heading />
      </div>
      <Footer className="z-20" />
    </div>
  );
};

export default MarketingPage;
