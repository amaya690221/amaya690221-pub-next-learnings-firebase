// /app/components/Records.tsx

"use client";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { StudyData } from "../utils/studyData";
import { useRouter } from "next/navigation";
import { auth } from "../utils/firebase";
import Edit from "./Edit";
import Delete from "./Delete";
import NewEntry from "./NewEntry";

const Records = () => {
  const [email, setEmail] = useState("");
  const [learnings, setLearnings] = useState<StudyData[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const toast = useToast();

  /** ユーザがセッション中か否かの判定処理 **/
  useEffect(() => {
    const authUser = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setEmail(user.email as string);
      } else {
        router.push("/user/login"); //userがセッション中でなければ/loginに移動
      }
    });
    return () => {
      authUser();
    };
  }, []);

  /** Firestoreデータ取得 **/
  const fetchDb = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/records/read?email=${email}`);
      const data = await res.json();

      if (res.ok && data.success) {
        console.log("fetchStudies:", email, data);
        setLearnings(data.data);
      } else {
        console.error("fetchStudiesError", email, data);
        throw new Error(data.error || "Failed to fetch studies.");
      }
    } catch (err: unknown) {
      console.error("Error in fetchStudies:", err);
      toast({
        title: "データ取得に失敗しました",
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /** Firestoreデータ新規登録 **/
  const entryDb = async (study: StudyData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/records/create", {
        method: "POST",
        body: JSON.stringify({
          title: study.title,
          time: study.time,
          email: email,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        fetchDb(email); // リロード
        toast({
          title: "データ登録が完了しました",
          position: "top",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      toast({
        title: "データ登録に失敗しました",
        description: `${err}`,
        position: "top",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /** Firestoreデータ更新 **/
  const updateDb = async (learnings: StudyData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/records/update", {
        method: "PUT",
        body: JSON.stringify(learnings),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        fetchDb(email); // リロード
        toast({
          title: "データ更新が完了しました",
          position: "top",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      toast({
        title: "データ更新に失敗しました",
        description: `${err}`,
        position: "top",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /** Firestoreデータ削除 **/
  const deleteDb = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/records/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        fetchDb(email); // リロード
        toast({
          title: "データを削除しました",
          position: "top",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      toast({
        title: "デー削除に失敗しました",
        description: `${err}`,
        position: "top",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /** Firestore確認 **/
  useEffect(() => {
    if (email) {
      fetchDb(email);
      console.log("useEffectFirestore:", email, user);
    }
  }, [user]);

  /**ログアウト処理 **/
  const handleLogout = async () => {
    setLoading(true);
    try {
      const usertLogout = await auth.signOut();
      console.log("User Logout:", usertLogout);
      toast({
        title: "ログアウトしました",
        position: "top",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      router.push("/user/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "ログアウトに失敗しました",
        description: `${error}`,
        position: "top",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /** 学習時間合計 **/
  const calculateTotalTime = () => {
    return learnings.reduce((total, learning) => total + learning.time, 0);
  };

  return (
    <>
      <Flex alignItems="center" justify="center" p={5}>
        <Card size={{ base: "sm", md: "lg" }}>
          <Box textAlign="center" mb={2} mt={10}>
            ようこそ！{email} さん
          </Box>
          <Heading size="md" textAlign="center">
            Learning Records
          </Heading>
          <CardBody>
            {/*学習記録表示 */}
            <Box textAlign="center">
              学習記録
              {loading && (
                <Box p={10}>
                  <Spinner />
                </Box>
              )}
              <TableContainer>
                <Table variant="simple" size={{ base: "sm", md: "lg" }}>
                  <Thead>
                    <Tr>
                      <Th>学習内容</Th>
                      <Th>時間(分)</Th>
                      <Th></Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {learnings.map((learning, index) => (
                      <Tr key={index}>
                        <Td>{learning.title}</Td>
                        <Td>{learning.time}</Td>
                        <Td>
                          <Edit
                            learning={learning}
                            updateDb={updateDb}
                            loading={loading}
                          />
                        </Td>
                        <Td>
                          <Delete
                            learning={learning}
                            deleteDb={deleteDb}
                            loading={loading}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
            {!loading && (
              <Box p={5}>
                <div>合計学習時間：{calculateTotalTime()}分</div>
              </Box>
            )}

            {/*データ新規登録*/}
            <Box p={25}>
              <NewEntry
                learnings={learnings}
                loading={loading}
                updateDb={updateDb}
                entryDb={entryDb}
              />
            </Box>

            {/* ログアウト*/}
            <Box px={25} mb={4}>
              <Stack spacing={3}>
                <Button width="100%" variant="outline" onClick={onOpen}>
                  ログアウト
                </Button>
                <AlertDialog
                  motionPreset="slideInBottom"
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                  isOpen={isOpen}
                  isCentered
                >
                  <AlertDialogOverlay />
                  <AlertDialogContent>
                    <AlertDialogHeader>ログアウト</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>ログアウトしますか?</AlertDialogBody>
                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        isLoading={loading}
                        loadingText="Loading"
                        spinnerPlacement="start"
                        colorScheme="red"
                        ml={3}
                        onClick={handleLogout}
                      >
                        ログアウト
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Stack>
            </Box>

            {/*パスワード更新 */}
            <Box px={25} mb={4}>
              <Stack spacing={3}>
                <Button
                  width="100%"
                  variant="outline"
                  onClick={() => router.push("/user/updatePass")}
                >
                  パスワード更新
                </Button>
              </Stack>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};

export default Records;
