import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChatRoom } from "../../services/api";

export default function ListChat({
  id,
  users,
  unread_messages,
  updated_at,
  lastMessage,
  house,
}) {
  const navigate = useNavigate();
  const { user } = useUser();
  const handleChatClick = (id) => {
    navigate(`/chatlist/${id}`);
  };
  const queryClient = useQueryClient();
  const mutation = useMutation(deleteChatRoom, {
    onSuccess: () => queryClient.refetchQueries(["chatRoomList"]),
  });
  const { chatRoomPk } = useParams();
  const onDelete = (event) => {
    event.stopPropagation();
    mutation.mutate(id);
  };
  return (
    <HStack
      p="5"
      borderRadius={"md"}
      borderWidth="1px"
      borderColor={chatRoomPk != id ? "gray.200" : "blue.200"}
      onClick={() => handleChatClick(id)}
      justifyContent="space-between"
      alignItems={"flex-end"}
      w="100%"
    >
      <HStack spacing={"8"} p={2} w="100%">
        <Avatar name={users[0]?.name} src={users[0]?.avatar} />
        <VStack alignItems={"flex-start"} w="100%">
          <HStack
            justifyContent={"space-between"}
            h={"5"}
            alignItems={"flex-start"}
          >
            <Heading size="sm">
              {users[0]?.username} 님과의 채팅방
              {unread_messages !== 0 ? (
                <Text ml={"3"} as={"span"} color="red.300">
                  {" "}
                  + {unread_messages}
                </Text>
              ) : null}
            </Heading>
          </HStack>
          <Text fontSize="sm" color="gray.800">
            {lastMessage}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {updated_at.split(".")[0].split("T")[0]}
          </Text>
        </VStack>
      </HStack>
      <VStack w="lg" alignItems={"flex-end"}>
        <Text>{house.title}</Text>
        <Button onClick={onDelete}>삭제하기</Button>
      </VStack>
    </HStack>
  );
}
