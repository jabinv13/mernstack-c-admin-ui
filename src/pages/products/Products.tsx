import { Breadcrumb, Flex, Space, Spin, Typography } from "antd";
import { RightOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Products = () => {
  const isFetching = false;
  const isError = false;
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
      </Space>
    </>
  );
};

export default Products;
