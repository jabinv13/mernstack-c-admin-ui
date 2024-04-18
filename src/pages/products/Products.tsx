import {
  Breadcrumb,
  Button,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  RightOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";

import { Link } from "react-router-dom";
import ProductsFilter from "./ProductsFilter";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PER_PAGE } from "../../constants";
import { getProducts } from "../../http/api";
import { Product } from "../../types";

const Products = () => {
  const isFetching = false;
  const isError = false;
  const [filterForm] = Form.useForm();

  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (_text: string, record: Product) => {
        return (
          <div>
            <Space>
              <Image width={40} src={record.image} preview={false} />
              <Typography.Text>{record.name}</Typography.Text>
            </Space>
          </div>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "isPublish",
      key: "isPublish",
      render: (_: boolean, record: Product) => {
        return (
          <>
            {record.isPublish ? (
              <Tag color="green">Published</Tag>
            ) : (
              <Tag color="red">Draft</Tag>
            )}
          </>
        );
      },
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => {
        return (
          <Typography.Text>
            {format(new Date(text), "dd/MM/yyyy HH:mm")}
          </Typography.Text>
        );
      },
    },
  ];

  const { data: products } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  console.log(products);
  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "products" },
            ]}
          />

          {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {isError && <Typography.Text type="danger">error</Typography.Text>}
        </Flex>
        <Form form={filterForm} onFieldsChange={() => {}}>
          <ProductsFilter>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Product
            </Button>
          </ProductsFilter>
        </Form>
        <Table
          columns={[
            ...columns,
            {
              title: "Actions",
              render: () => {
                return (
                  <Space>
                    <Button onClick={() => {}} type="link">
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={products?.data}
          rowKey={"id"}
          pagination={{
            total: products?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              console.log(total, range);
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />
      </Space>
    </>
  );
};

export default Products;
