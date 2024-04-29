import { Footer } from "./_components/footer";
import Heading from "./_components/heading";
import Breadcrumb from "./_components/breadcrumb";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center md:justify-start text-center gap-y-5 flex-1 px-6 ph-10">
        <Breadcrumb />
        <Heading />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingPage;
