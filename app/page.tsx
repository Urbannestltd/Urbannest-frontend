import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Box className="flex justify-center items-center h-screen">
      <Link href={'/auth'}><Button bg={'red'} className="bg-red-700 text-purple-500">Login to Urbannest</Button></Link>
    </Box>
  );
}
