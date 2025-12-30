import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Box className="flex justify-center items-center h-screen">
        <Link href={'/auth'}><Button bg={'red'} className="bg-red-700 text-purple-500">Login to Urbannest</Button></Link>
      </Box>
      <p className="satoshi-bold"> Hello in Satoshi</p>
    </div>
  );
}
