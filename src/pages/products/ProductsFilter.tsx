import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import React from "react";
import { getCategories, getTenants } from "../../http/api";
import { Category, Tenant } from "../../types";
import { useAuthStore } from "../../store";

type ProductsFilterProps = {
  children?: React.ReactNode;
};

const ProductsFilter = ({ children }: ProductsFilterProps) => {
  const { user } = useAuthStore();
  const { data: restaurants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants(`perPage=100&currentPage=1`).then((res) => res.data);
    },
  });

  console.log(restaurants);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getCategories();
    },
  });

  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item name="q">
                <Input.Search allowClear={true} placeholder="Search" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="categoryId">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select Category"
                >
                  {categories?.data.map((category: Category) => {
                    return (
                      <Select.Option value={category._id} key={category._id}>
                        {category.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            {user!.role === "admin" && (
              <Col span={6}>
                <Form.Item name="tenantId">
                  <Select
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select Tenant"
                  >
                    {restaurants?.data.map((restaurant: Tenant) => {
                      return (
                        <Select.Option
                          value={restaurant.id}
                          key={restaurant.id}
                        >
                          {restaurant.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            )}

            <Col span={6}>
              <Space>
                <Form.Item name="isPublish">
                  <Switch defaultChecked={false} onChange={() => {}} />
                </Form.Item>
                <Typography.Text style={{ marginBottom: 22, display: "block" }}>
                  Show only published
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductsFilter;
