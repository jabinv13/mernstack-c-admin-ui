import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import { useState } from "react";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  // {
  //   title: "Restaurant",
  //   dataIndex: "tenant",
  //   key: "tenant",
  //   render: (_text: string, record: User) => {
  //     return <div>{record.tenant?.name}</div>;
  //   },
  // },
];

const Users = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => res.data);
    },
  });

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[{ title: <Link to="/">Dashboard</Link> }, { title: "users" }]}
        />

        {isLoading && <div>Loading ...</div>}
        {isError && <div>{error.message}</div>}
        <UsersFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add User
          </Button>
        </UsersFilter>
        <Table columns={columns} dataSource={users} rowKey={"id"} />

        <Drawer
          title="Create User"
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

export default Users;
