import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Form, Space, Table } from "antd";
import { createTenant, getTenants } from "../../http/api";
import { useAuthStore } from "../../store";
import { Link, Navigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import TenantFilter from "./TenantsFilter";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import TenantForm from "./form/TenantForm";
import { CreateTenantData } from "../../types";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const Tenants = () => {
  const { user } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const {
    data: tenants,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((res) => res.data);
    },
  });

  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["tenant"],
    mutationFn: async (data: CreateTenantData) =>
      createTenant(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  const onHandleSubmit = async () => {
    await form.validateFields();

    console.log(form.getFieldsValue());
    await tenantMutate(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Tenants" },
          ]}
        />
        {isFetching && <div>Loading ...</div>}
        {isError && <div>{error.message}</div>}
        <TenantFilter>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Tenant
          </Button>
        </TenantFilter>
        <Table columns={columns} dataSource={tenants} rowKey={"id"} />
        <Drawer
          title="Create Tenant"
          open={drawerOpen}
          width={720}
          destroyOnClose={true}
          onClose={() => {
            setDrawerOpen(false);
            console.log("Closing user drawer");
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={onHandleSubmit}>Submit</Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
