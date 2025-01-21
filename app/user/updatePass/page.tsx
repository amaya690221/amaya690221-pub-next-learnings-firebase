// /app/user/updatepass/page.tsx

"use client";

import { useEffect, useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  reauthenticateWithCredential,
  updatePassword,
  User,
} from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { auth } from "@/app/utils/firebase";

const UpdatePass = () => {
  const [formState, setFormState] = useState({
    password: "",
    passwordConf: "",
    currentPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const toast = useToast();

  //ユーザがセッション中か否かの判定処理
  useEffect(() => {
    const authUser = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => {
      authUser();
    };
  }, []);

  // input入力値変更時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //パスワードを更新するボタンをクリックした時の処理
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
      //パスワードの更新はユーザの再認証が必要
      setLoading(true);
      if (user) {
        // 再認証のために、ユーザーの認証情報を取得
        const credential = EmailAuthProvider.credential(
          user.email!,
          formState.currentPassword // 現在のパスワードを入力
        );
        console.log("パスワード更新", user);

        // 再認証処理
        await reauthenticateWithCredential(user, credential);

        // パスワードの更新処理
        await updatePassword(user, formState.password);
        toast({
          title: "パスワード更新が完了しました",
          position: "top",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        router.push("/"); // updatePasswordが成功した場合にのみページ遷移
      }
    } catch (error: unknown) {
      console.error("Error during password reset:", error);
      toast({
        title: "パスワード更新に失敗しました",
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
            パスワード更新
          </Heading>
          <CardBody>
            <form onSubmit={handleUpdatePassword}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <RiLockPasswordFill color="gray" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="現在のパスワードを入力"
                  name="currentPassword"
                  value={formState.currentPassword}
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
                  placeholder="新パスワードを入力"
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
                  placeholder="新パスワードを入力(確認)"
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
                >
                  パスワードを更新する
                </Button>
                <Button colorScheme="gray" onClick={() => router.back()} mx={2}>
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
export default UpdatePass;
