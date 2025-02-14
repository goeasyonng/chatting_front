import {
  Card,
  Box,
  CardBody,
  Text,
  Heading,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import useUser from "../../hooks/useUser";
import { setWishLists } from "../../services/api";
import { getSaleContents } from "../../utils/getSaleContents";
import { RoomKindsToFront, SellKindsToFront } from "../../services/data";
import styles from "../../styles/HouseList.module.css";

function HouseCard({
  thumnail,
  room_kind,
  sell_kind,
  id,
  deposit,
  monthly_rent,
  sale,
  is_liked,
  title,
  gu,
  dong,
}) {
  const navigation = useNavigate();
  const toast = useToast();
  const { userLoading, isLoggedIn } = useUser();
  const [isLike, setIsLike] = useState(is_liked && is_liked);

  const likeMutation = useMutation(setWishLists, {
    onMutate: () => {
      console.log("like mutation");
    },
    onSuccess: () => {
      console.log(isLike ? `like house ${id}` : `like cancel house ${id}`);
    },
  });

  const onLike = (event) => {
    event.stopPropagation();
    setIsLike(!isLike);
    if (!userLoading && isLoggedIn && id > 0) {
      likeMutation.mutate(id);
    }
  };

  const onHouseDetail = () => {
    navigation(`house/${id}`);
  };

  return (
    <Card
      w="100%"
      boxShadow="0px"
      _hover={{ backgroundColor: "rgb(210,210,210,0.1)" }}
      display={"flex"}
      alignItems="center"
      justifyContent={"center"}
    >
      <CardBody
        display={"flex"}
        alignItems="center"
        justifyContent={"center"}
        w={"100%"}
        onClick={onHouseDetail}
        cursor="pointer"
      >
        <VStack w={"100%"} alignItems="flex-start" spacing={"5"}>
          <Box
            backgroundImage={thumnail}
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            backgroundPosition="center"
            width="100%"
            alt="house"
            borderRadius="lg"
            css={{
              aspectRatio: "1 / 1",
            }}
          >
            {!userLoading && isLoggedIn ? (
              <Box
                onClick={onLike}
                float="right"
                mt="4"
                mr="4"
                h="28px"
                w="28px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={isLike ? "red" : "transparent"}
                className={
                  isLike
                    ? styles.heart_animation
                    : styles.reverse_heart_animation
                }
              >
                <Box pos="absolute">
                  <svg
                    viewBox="0 0 32 32"
                    role="like"
                    style={{
                      display: isLike ? "none" : "block",
                      fill: "rgba(0, 0, 0, 0.5)",
                      height: "28px",
                      width: "28px",
                      stroke: "rgb(255,255,255,0.8)",
                      strokeWidth: 2,
                      overflow: "visible",
                    }}
                  >
                    <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path>
                  </svg>
                </Box>
                {isLike ? <FaHeart size={"25"} /> : ""}
              </Box>
            ) : (
              ""
            )}
          </Box>
          <VStack alignItems={"flex-start"} pl="3">
            <Heading
              size="sm"
              fontSize="1.5em"
              color="blackAlpha.800"
              noOfLines={1}
            >
              {title}
            </Heading>
            <Text h="auto" color="blackAlpha.800" fontSize="1rem" noOfLines={1}>
              서울 {gu} {dong.name}
            </Text>
            <VStack spacing={"0"} alignItems={"flex-start"}>
              <HStack alignItems="center">
                <Text color="blackAlpha.800" fontSize="1.1em" fontWeight="600">
                  {`${RoomKindsToFront[room_kind]} ${SellKindsToFront[sell_kind]}`}
                </Text>
              </HStack>
              <Text fontSize="1.1em" fontWeight="600" color={"#ff404c"}>
                {`${getSaleContents(sell_kind, deposit, monthly_rent, sale)}`}
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
export default HouseCard;
