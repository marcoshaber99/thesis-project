import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/spinner";

const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
      <Skeleton className="h-4 w-[50%]" />
      <Spinner size="lg" />
      <Skeleton className="h-4 w-[40%]" />
    </div>
  );
};

export default Loading;
