import Image from "next/image";
import Link from "next/link";

export default {
  logo: (
    <span className="flex gap-1">
      <Image src="/logo.svg" height="40" width="40" alt="Logo" />
    </span>
  ),
  project: {
    link: "https://github.com/shuding/nextra",
  },
  // ... other theme options
};
