import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { getTenants } from "../../http/api";
import { useAuthStore } from "../../store";
import { Link, Navigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import TenantFilter from "./TenantsFilter";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

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

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

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
              <Button>Cancel</Button>
              <Button>Submit</Button>
            </Space>
          }
        >
          <p>Somecontent</p>
          <p>Somecontent</p>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
