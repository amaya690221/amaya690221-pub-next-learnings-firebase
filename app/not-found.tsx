// /app/not-found.tsx

"use client";

import { Box, Button, Card, CardBody, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  return (
    <Flex justifyContent="center" boxSize="fit-content" mx="auto" p={5}>
      <Card size={{ base: "sm", md: "lg" }} p={4}>
        <Heading size="md" textAlign="center" mt={8}>
          404 - ページが見つかりません
        </Heading>
        <CardBody>
          アクセスしようとしたページは存在しません。
          <br />
          URLをご確認の上、再度アクセスしてください。
          <Box mt={4} textAlign="center">
            <Button
              colorScheme="green"
              width="100%"
              variant="link"
              onClick={() => router.back()}
            >
              前に戻る
            </Button>
          </Box>
        </CardBody>
      </Card>
    </Flex>
  );
};
export default NotFound;
