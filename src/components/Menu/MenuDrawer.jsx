import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  VStack,
  DrawerCloseButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Flex,
} from "@chakra-ui/react";
import OptionRangeSlider from "../Slider/RangeSlider";
import DataRadioCard from "../Radio/RadioCard";
import PricesMenu from "./PricesMenu";
import { options, optionsMenu } from "../../services/data";
import { IoIosArrowDown, IoMdMenu } from "react-icons/io";

export default function MenuDrawer({
  isOpen,
  onClose,
  activePrices,
  setPrices,
  setSelectedOpts,
  selectedOpts,
}) {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxW="240px">
        <DrawerCloseButton />
        <DrawerHeader>메뉴</DrawerHeader>
        <DrawerBody>
          <VStack align="stretch" spacing="20px">
            {optionsMenu.map((item, idx) => {
              if (idx < 5) {
                return (
                  <Menu key={idx}>
                    <MenuButton
                      as={Button}
                      colorScheme="red"
                      p="15px"
                      rightIcon={<IoIosArrowDown />}
                      w="100%"
                      textAlign="left"
                    >
                      {selectedOpts[idx] == "전체"
                        ? item.kor
                        : idx == 3
                        ? "화장실 " + selectedOpts[idx]
                        : idx == 4
                        ? "방 " + selectedOpts[idx]
                        : selectedOpts[idx]}
                    </MenuButton>
                    <MenuList
                      p="20px"
                      maxW={idx == 5 || idx == 1 ? "" : "460px"}
                    >
                      <Flex>
                        <DataRadioCard
                          name={item.kor}
                          valueName={item.eng}
                          data={options[item.eng]}
                          defaultData={options[item.eng][0]}
                          onUpdate={setSelectedOpts}
                        />
                      </Flex>
                      {idx == 1 ? (
                        <PricesMenu
                          activePrices={activePrices}
                          setPrices={setPrices}
                        />
                      ) : (
                        ""
                      )}
                    </MenuList>
                  </Menu>
                );
              } else if (idx == 5) {
                return (
                  <Menu key={idx}>
                    <MenuButton
                      as={Button}
                      colorScheme="red"
                      p="15px"
                      rightIcon={<IoIosArrowDown />}
                      w="100%"
                      textAlign="left"
                    >
                      {item.kor}
                    </MenuButton>
                    <MenuList py="20px" px="50px">
                      <OptionRangeSlider
                        idx={0}
                        names={item}
                        onUpdate={setPrices}
                      />
                    </MenuList>
                  </Menu>
                );
              }
            })}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
