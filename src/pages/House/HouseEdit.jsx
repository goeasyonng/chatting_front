import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  VStack,
  Center,
  HStack,
  Divider,
  Flex,
  Text,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getHouse, putHouse } from "../../services/api";

import SingleForm from "../../components/Form/SingleForm";
import AddressSelectForm from "../../components/Form/AddressSelectForm";
import KindSelectForm from "../../components/Form/KindSelectForm";
import TripleForm from "../../components/Form/TripleForm";
import PriceForm from "../../components/Form/PriceForm";
import SingleTextAreaForm from "../../components/Form/SingleTextAreaForm";

const HouseEdit = () => {
  const { id } = useParams();
  const house = useQuery(["house", id], getHouse);

  const [initHouse, setInitHouse] = useState(true);
  const [sellKind, setSellKind] = useState("");
  const [images, setImages] = useState([]);
  const [updatedHouse, setUpdatedHouse] = useState({});

  const { mutate } = useMutation(putHouse, {
    onSuccess: () => {
      console.log("update house!");
    },
    onError: () => {
      console.log("don't update house!");
    },
  });

  const onSubmit = () => {
    console.log(updatedHouse);
    mutate(updatedHouse);
  };

  useEffect(() => {
    if (house.data && initHouse) {
      console.log("init", house);
      setSellKind(house.data?.sell_kind);
      setUpdatedHouse(house.data);
      setInitHouse(false);
    }
  }, [house]);

  useEffect(() => {
    console.log("house", updatedHouse);
  }, [updatedHouse]);

  return (
    <VStack
      pt="30vh"
      pb="5vh"
      borderWidth="1px"
      borderRadius="lg"
      overflowY="scroll"
      overflowX="hidden"
      maxHeight="85vh"
      justifyContent="center"
    >
      <Center>
        <VStack>
          <Text fontWeight="600" fontSize="23px" mt="50px" w="60vw">
            기본
          </Text>
          <SingleForm
            setUpdatedHouse={setUpdatedHouse}
            value={updatedHouse?.title}
            name="title"
            label="제목"
          />
          <Divider borderWidth="1.2px" my="5" borderColor="blackAlpha.400" />
          <AddressSelectForm
            setUpdatedHouse={setUpdatedHouse}
            savedGu={updatedHouse?.gu}
            savedDong={updatedHouse?.dong}
          />
          <SingleForm
            setUpdatedHouse={setUpdatedHouse}
            value={updatedHouse?.address}
            name="address"
            label="상세주소"
          />
          <Divider borderWidth="1.2px" my="5" borderColor="blackAlpha.400" />
          <KindSelectForm
            setUpdatedHouse={setUpdatedHouse}
            setSellKind={setSellKind}
            sellKind={updatedHouse?.sell_kind}
            roomKind={updatedHouse?.room_kind}
          />
          <TripleForm
            setUpdatedHouse={setUpdatedHouse}
            values={[
              updatedHouse?.room,
              updatedHouse?.toilet,
              updatedHouse?.pyeongsu,
            ]}
            names={["room", "toilet", "pyeongsu"]}
            labeles={["방 개수", "화장실 개수", "평수"]}
          />
          <Divider borderWidth="1.2px" my="5" borderColor="blackAlpha.400" />
          <PriceForm
            setUpdatedHouse={setUpdatedHouse}
            sellKind={sellKind}
            values={[
              updatedHouse?.sale,
              updatedHouse?.deposit,
              updatedHouse?.monthly_rent,
              updatedHouse?.maintenance_cost,
            ]}
            names={["sale", "deposit", "monthly_rent", "maintenance_cost"]}
            labeles={["매매가", "보증금", "월세", "관리비"]}
          />
          <Divider borderWidth="1.2px" my="5" borderColor="blackAlpha.400" />

          <SingleTextAreaForm
            setUpdatedHouse={setUpdatedHouse}
            value={updatedHouse?.description}
            name="description"
            label="설명"
          />
          <Divider borderWidth="1.2px" my="5" borderColor="blackAlpha.400" />
          <Text fontWeight="600" fontSize="23px" mb="20" w="60vw">
            옵션
          </Text>
          <SingleForm
            setUpdatedHouse={setUpdatedHouse}
            value={updatedHouse?.distance_to_station}
            name="distance_to_station"
            label="역까지 거리"
          />

          <Flex justifyContent="flex-end">
            <Button
              my="5"
              isLoading={mutate.isLoading}
              colorScheme="green"
              size="lg"
              position={"fixed"}
              bottom={5}
              right={20}
              onClick={onSubmit}
            >
              등록하기
            </Button>
          </Flex>
        </VStack>
      </Center>
    </VStack>
  );
};

export default HouseEdit;
