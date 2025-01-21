// /app/user/register/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/utils/firebase";

const Register = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    passwordConf: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // input入力値変更時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //登録するボタンクリック時処理
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (formState.password !== formState.passwordConf) {
      toast({
        title: "パスワードが一致しません",
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (formState.password.length < 6) {
      toast({
        title: "パスワードは6文字以上にしてください",
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formState.email,
        formState.password
      );
      console.log("User Signuped:", userCredential);
      toast({
        title: "ユーザー登録が完了しました。",
        position: "top",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      router.push("/");
    } catch (error: unknown) {
      toast({
        title: "サインアップに失敗しました",
        description: `${error}`,
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex justifyContent="center" boxSize="fit-content" mx="auto" p={5}>
        <Card size={{ base: "sm", md: "lg" }} p={4}>
          <Heading size="md" textAlign="center">
            ユーザ登録
          </Heading>
          <CardBody>
            <form onSubmit={handleSignup}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaUserCheck color="gray" />
                </InputLeftElement>
                <Input
                  autoFocus
                  type="email"
                  placeholder="メールアドレスを入力"
                  name="email"
                  value={formState.email}
                  required
                  mb={2}
                  onChange={handleInputChange}
                />
              </InputGroup>
              <Text fontSize="12px" color="gray">
                パスワードは6文字以上
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <RiLockPasswordFill color="gray" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="パスワードを入力"
                  name="password"
                  value={formState.password}
                  required
                  mb={2}
                  onChange={handleInputChange}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <RiLockPasswordFill color="gray" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="パスワードを入力(確認)"
                  name="passwordConf"
                  value={formState.passwordConf}
                  required
                  mb={2}
                  onChange={handleInputChange}
                />
              </InputGroup>
              <Box mt={4} mb={2} textAlign="center">
                <Button
                  isLoading={loading}
                  loadingText="Loading"
                  spinnerPlacement="start"
                  type="submit"
                  colorScheme="green"
                  width="100%"
                  mb={2}
                >
                  登録する
                </Button>
                <Button
                  colorScheme="gray"
                  onClick={() => router.back()}
                  width="100%"
                >
                  戻る
                </Button>
              </Box>
            </form>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};
export default Register;
