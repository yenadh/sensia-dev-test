import Navbar from "@/components/ui/customComponents/Navbar";
import { Heading, Stack, Container, Flex } from "@chakra-ui/react";
import CustomTable from "@/components/ui/customComponents/CustomTable";
import CustomButton from "@/components/ui/customComponents/CustomButton";
import { deleteUser, getPages, getUsers } from "@/endpoints/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDialog from "@/components/ui/customComponents/CustomDialog";
import UserAccess from "@/components/ui/customComponents/UserAccess";

export default function ListUser() {
  const [users, setUsers] = useState([]);
  const [pages, setPages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAccess, setIsOpenAccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const nav = useNavigate();

  const columns = [
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "is_staff" },
    { header: "Status", accessor: "is_active" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUsers();
        setUsers(user);
      } catch (error) {
        console.log("error");
      }
    };

    const fetchPages = async () => {
      try {
        const page = await getPages();
        setPages(page);
      } catch (error) {
        console.log("error");
      }
    };

    fetchUser();
    fetchPages();
  }, []);

  const confirmDelete = async () => {
    console.log("Deleting user", selectedUser);
    await deleteUser(selectedUser);
    setSelectedUser(null);
    window.location.reload();
  };

  const handleDelete = (id) => {
    setIsOpen(true);
    setSelectedUser(id);
  };

  const handleAccess = (id) => {
    setIsOpenAccess(true);
    setSelectedUser(id);
  };

  return (
    <div>
      <Navbar>
        <CustomDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onConfirm={confirmDelete}
          confirmLabel="Delete"
        />
        <UserAccess
          isOpen={isOpenAccess}
          pages={pages}
          user={selectedUser}
          setIsOpen={setIsOpenAccess}
          onConfirm={() => console.log("clicked")}
          confirmLabel="Save"
        />
        <Container mt="50px">
          <Stack>
            <Flex gap="4" justify="space-between">
              <Heading size="xl">User</Heading>
              <CustomButton width="100px" onClick={() => nav("/user/create")}>
                Create
              </CustomButton>
            </Flex>
            <CustomTable
              columns={columns}
              data={users}
              pageSize={5}
              onEdit={(user) => nav(`/user/update/${user.id}`)}
              onDelete={(user) => handleDelete(user.id)}
              accessAction={(user) => handleAccess(user.id)}
            />
          </Stack>
        </Container>
      </Navbar>
    </div>
  );
}
