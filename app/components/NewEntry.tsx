// /app/components/NewEntry.tsx

"use client";

import { useRef, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { StudyData } from "../utils/studyData";

type Props = {
  learnings: StudyData[];
  loading: boolean;
  updateDb: (data: StudyData) => void;
  entryDb: (data: StudyData) => void;
};

const NewEntry: React.FC<Props> = ({
  learnings,
  updateDb,
  loading,
  entryDb,
}) => {
  const [entryLearning, SetEntryLearning] = useState<StudyData>({
    id: "",
    title: "",
    time: 0,
    email: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const toast = useToast();

  //input入力時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //eは、操作イベントの事。型は、React.ChangeEvent<HTMLInputElement>と定義される。
    const { name, value } = e.target; //イベントオブジェクトのtarget内に存在する、name と value を定数としてセット
    SetEntryLearning({
      //セット関数でentryLearningの値を更新
      ...entryLearning, //entryLearningに対して
      [name]: name === "time" ? Number(value) : value,
      //3項演算子で処理。inputフィールドのnameがtimeの場合は、valueは、number型の値として扱い、そうではない場合は、valueは、string型の値として扱う
    });
  };

  //登録ボタンクリック時の処理
  const handleEntry = async () => {
    if (learnings.some((l) => l.title === entryLearning.title)) {
      const existingLearning = learnings.find(
        (l) => l.title === entryLearning.title
      );
      if (existingLearning) {
        existingLearning.time += entryLearning.time;
        await updateDb(existingLearning);
      }
    } else {
      await entryDb(entryLearning);
    }
    SetEntryLearning({ id: "", title: "", time: 0, email: "" });
    if (!loading) {
      //ローディングが解除されていれば
      onClose(); //モーダルクローズ
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <Button colorScheme="green" variant="outline" onClick={onOpen}>
          新規データ登録
        </Button>
      </Stack>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>新規データ登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>学習内容</FormLabel>
              <Input
                ref={initialRef}
                name="title"
                placeholder="学習内容"
                value={entryLearning.title}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>学習時間</FormLabel>
              <Input
                type="number"
                name="time"
                placeholder="学習時間"
                value={entryLearning.time}
                onChange={handleInputChange}
              />
            </FormControl>
            <div>入力されている学習内容：{entryLearning.title}</div>
            <div>入力されている学習時間：{entryLearning.time}</div>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              loadingText="Loading"
              spinnerPlacement="start"
              colorScheme="green"
              mr={3}
              onClick={() => {
                if (entryLearning.title !== "" && entryLearning.time > 0) {
                  handleEntry();
                } else {
                  toast({
                    title: "学習内容と時間を入力してください",
                    position: "top",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                  });
                }
              }}
            >
              登録
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default NewEntry;
