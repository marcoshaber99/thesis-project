import Heading from "./_components/heading";
import Breadcrumb from "./_components/breadcrumb";
import GridBackground from "./_components/grid-background";
import Footer from "./_components/footer";
import Pricing from "./_components/pricing";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col relative">
      <GridBackground />
      <div className="flex flex-col items-center md:justify-start text-center gap-y-5 flex-1 px-6 ph-10 z-10">
        <Breadcrumb />
        <Heading />
        <Pricing />
      </div>
      <Footer className="z-20 dark:text-gray-400" />
    </div>
  );
};

export default MarketingPage;
