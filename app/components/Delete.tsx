// /app/components/Delete.tsx

"use client";

import React, { useRef } from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { StudyData } from "../utils/studyData";

type Props = {
  learning: StudyData;
  loading: boolean;
  deleteDb: (id: string) => Promise<void>;
};

const Delete: React.FC<Props> = ({ learning, deleteDb, loading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const handleDelete = async () => {
    await deleteDb(learning.id as string); //undefinedの可能性があるので、stringとして型アサーション
    if (!loading) {
      onClose();
    }
  };

  return (
    <>
      {/*モーダル開閉ボタン*/}
      <Button variant="ghost" onClick={onOpen}>
        <MdDelete color="black" />
      </Button>

      {/*モーダル本体 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>データ削除</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              以下のデータを削除します。
              <br />
              学習内容：{learning.title}、学習時間:{learning.time}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button
              isLoading={loading}
              loadingText="Loading"
              spinnerPlacement="start"
              ref={initialRef}
              colorScheme="red"
              onClick={handleDelete}
            >
              削除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Delete;
