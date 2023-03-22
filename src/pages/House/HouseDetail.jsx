import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSaleContents } from "../../utils/getSaleContents";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getHouse,
  getWishLists,
  makeChatRoom,
  setWishLists,
} from "../../services/api";

import { faHeart } from "@fortawesome/free-regular-svg-icons";
import * as Solid from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Button,
  Grid,
  GridItem,
  Center,
  HStack,
  useToast,
  Skeleton,
  ButtonGroup,
} from "@chakra-ui/react";
import { SellKindsToFront, RoomKindsToFront } from "../../services/data";
import useUser from "../../hooks/useUser";
import { useDidMountEffect } from "../../hooks/useDidMoutEffect";

function House() {
  const params = useParams();
  const id = params.houseId;

  const toast = useToast();
  const navigate = useNavigate();

  const [isLikeInit, setIsLikeInit] = useState(true);
  const [isLike, setIsLike] = useState(false);
  const { data, isLoading } = useQuery(["house", id], getHouse);
  const wishlists = useQuery(["wish"], getWishLists);

  const user = useUser();
  const mutation = useMutation(makeChatRoom, {
    onSuccess: () => {
      navigate("/chatlist");
    },
  });

  const likeMutation = useMutation(setWishLists, {
    onMutate: () => {
      console.log("like mutation");
    },
    onSuccess: () => {
      console.log(isLike ? `like house ${id}` : `like cancel house ${id}`);
    },
  });

  const goChat = () => {
    if (!user.userLoading && user.isLoggedIn) {
      mutation.mutate(id);
    } else {
      toast({
        title: "로그인을 해야 사용가능합니다.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const onEdit = () => {
    setTimeout(() => {
      navigate(`/edit/${id}`);
    }, 0);
  };
  const onDel = () => {
    console.log("Delete House");
  };
  const onSoldOut = () => {
    console.log("SoldOut House");
  };

  const onLike = () => {
    if (isLike) {
      toast({
        title: "좋아요 -1",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "좋아요 +1",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
    setIsLike(!isLike);
    console.log("detail", !user.userLoading && user.isLoggedIn, id);
    if (!user.userLoading && user.isLoggedIn && id > 0) {
      likeMutation.mutate(id);
    }
  };

  useEffect(() => {
    if (isLikeInit && wishlists.data !== undefined) {
      console.log(isLikeInit, wishlists);
      const savedLike = wishlists.data?.find((item) => {
        if (item.house === Number(id)) {
          return true;
        }
      });
      setIsLike(savedLike);
      setIsLikeInit(false);
    }
  }, [wishlists]);

  return (
    <>
      <Box
        overflowY="scroll"
        overflowX="hidden"
        h="90vh"
        scrollbarWidth="thin"
        display="flex"
        flexDirection="column"
        px="5vw"
      >
        <Center>
          <Grid
            mt="3vh"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(5, 1fr)"
            gap={2}
          >
            {data?.Image.map((item, idx) => {
              return (
                <GridItem
                  key={idx}
                  rowSpan={idx == 0 ? 2 : 1}
                  colSpan={idx == 0 ? 0 : 2}
                >
                  <Box
                    w={idx > 0 ? "20vw" : "50vw"}
                    h={idx > 0 ? "25vh" : "50vh"}
                    backgroundImage={`url(${item.url})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    borderLeftRadius={idx == 0 ? "20px" : "0px"}
                    borderTopRightRadius={
                      (idx > 0) & (idx == 2) ? "20px" : "0px"
                    }
                    borderBottomRightRadius={
                      (idx > 0) & (idx == 4) ? "20px" : "0px"
                    }
                    boxShadow="0px 4px 4px -3px black"
                    border="2px solid white"
                  />
                </GridItem>
              );
            })}
          </Grid>
        </Center>

        <Center>
          <Box w="100%" h="100px" mt="40px">
            <Heading
              as="h1"
              fontSize="3xl"
              mb="4"
              display="flex"
              alignItems="center"
            >
              <HStack w={"100vw"}>
                <Text>{`${data?.address} ${data?.title}`}</Text>
                {!user.userLoading && user.isLoggedIn ? (
                  <FontAwesomeIcon
                    size="sm"
                    color="red"
                    icon={isLike ? Solid.faHeart : faHeart}
                    onClick={onLike}
                    cursor="pointer"
                  />
                ) : (
                  ""
                )}
                <Text fontSize="21" px="5vw">
                  방문자수 {data?.visited}
                </Text>
              </HStack>{" "}
            </Heading>
            <Text mb="6" fontSize="22">
              {`${getSaleContents(
                data?.sell_kind,
                data?.deposit,
                data?.monthly_rent,
                data?.sale
              )}`}
              {" / "}
              관리비 월 {data?.maintenance_cost / 10000}만
            </Text>
            <Text fontSize="22" mb="20px">
              {data?.description}
            </Text>
            <Heading as="h1" fontSize="3xl" mb="4">
              상세정보
            </Heading>
            <List mb="4" fontSize="17">
              <ListItem>판매 : {SellKindsToFront[data?.sell_kind]}</ListItem>
              <ListItem>동네 : {data?.dong.name}</ListItem>
              <ListItem>방종류 : {RoomKindsToFront[data?.room_kind]}</ListItem>
              <ListItem>전용면적 : {data?.pyeongsu} 평</ListItem>
              <ListItem>방 수 : {data?.room}개 </ListItem>
              <ListItem> 화장실 수 : {data?.toilet}개</ListItem>
            </List>

            <Heading as="h1" fontSize="3xl" mb="4">
              옵션
            </Heading>
            <List mb="4" fontSize="17" spacing={5}>
              <ListItem>에어컨 / 세탁기 / 옷장 / 냉장고 / 인덕션</ListItem>
            </List>

            <Heading as="h1" fontSize="3xl" mb="4">
              보안/안전시설
            </Heading>
            <List mb="4" fontSize="17">
              <ListItem>
                비디오폰 / 공동현관 / CCTV / 카드키 / 화재경보기
              </ListItem>
            </List>
            {data?.is_host ? (
              <ButtonGroup position={"fixed"} bottom={10} right={10} gap={5}>
                <Button colorScheme="orange" size="lg" onClick={onSoldOut}>
                  판매완료
                </Button>
                <Button colorScheme="blackAlpha" size="lg" onClick={onEdit}>
                  수정하기
                </Button>
                <Button colorScheme="green" size="lg" onClick={onDel}>
                  삭제하기
                </Button>
              </ButtonGroup>
            ) : (
              <Button
                colorScheme="red"
                size="lg"
                position={"fixed"}
                bottom={10}
                right={10}
                onClick={goChat}
              >
                채팅하기
              </Button>
            )}
          </Box>
        </Center>
      </Box>
    </>
  );
}

export default House;
