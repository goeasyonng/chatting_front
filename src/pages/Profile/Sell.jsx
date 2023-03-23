import { Center, Grid, GridItem, VStack } from "@chakra-ui/react";
import { getSellLists } from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import Pagination from "react-js-pagination";
import styled from "styled-components";
import { useState } from "react";
import MyHouseCard from "../../components/Card/MyHouseCard";

const SellListWrap = styled.div`
  height: 80vh;
  overflow-y: scroll;
`;

const PagenationBox = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 15px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  ul.pagination li {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #e2e2e2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
  }
  ul.pagination li:first-child {
    border-radius: 5px 0 0 5px;
  }
  ul.pagination li:last-child {
    border-radius: 0 5px 5px 0;
  }
  ul.pagination li a {
    text-decoration: none;
    color: #337ab7;
    font-size: 1rem;
  }
  ul.pagination li.active a {
    color: white;
  }
  ul.pagination li.active {
    background-color: #337ab7;
  }
  ul.pagination li a:hover,
  ul.pagination li a.active {
    color: blue;
  }
`;

export default function Sell() {
  const { error, data, isLoading } = useQuery(["sellHouse"], getSellLists);
  const [page, setPage] = useState(1);
  const pageChange = (page) => {
    setPage(page);
  };

  const startIdx = (page - 1) * 9;
  const endIdx = startIdx + 9;
  const currentPageData = data?.results?.slice(startIdx, endIdx);

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  if (!data) {
    return <div>로딩 중입니다.</div>;
  }

  return (
    <VStack pb="10">
      {!isLoading && currentPageData?.length < 1 ? (
        <Center h="100%" alignItems="center" fontWeight="600">
          비어있습니다.
        </Center>
      ) : (
        <>
          <Grid
            w={"80vw"}
            px="5vw"
            gridTemplateColumns={{
              sm: "1fr",
              md: "1fr 1fr",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            overflowY={"scroll"}
            h="70vh"
          >
            {currentPageData?.map((item, idx) => {
              return (
                <GridItem key={idx}>
                  <MyHouseCard key={idx} {...item} />
                </GridItem>
              );
            })}
          </Grid>
        </>
      )}
      <PagenationBox>
        {/* 데이터 배열의 길이를 totalItemsCount로 설정 */}
        <Pagination
          activePage={page}
          itemsCountPerPage={9}
          totalItemsCount={data?.length ?? 0}
          pageRangeDisplayed={5}
          prevPageText="<"
          nextPageText=">"
          onChange={pageChange}
        ></Pagination>
      </PagenationBox>
    </VStack>
  );
}