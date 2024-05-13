import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import ConfirmationModal from "../CommonLayout/ConfirmationModal";
import { toast } from "react-toastify";

const AllAdmins = () => {
  const [Admins, setAllAdmins] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [adminIdToDelete, setAdminIdToDelete] = useState(null);

  useEffect(() => {
    function getAllCourses() {
      const userData = JSON.parse(localStorage.getItem("auth"));
      const token = userData.token;
      console.log(token);
      axios
        .get("http://localhost:8090/v1/users/all-admins", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setAllAdmins(res.data.admins);
        })
        .catch((err) => {
          console.error("Error : " + err.message);
        });
    }
    getAllCourses();
  }, []);
  const deleteAdmin = async (id) => {
    setShowConfirmationModal(true);
    setAdminIdToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("auth"));
      const token = userData.token;
      const { data } = await axios.delete(
        `http://localhost:8090/v1/users/${adminIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data?.success) {
        toast.success("Admin deleted successfully.");
        setAllAdmins(Admins.filter((admin) => admin._id !== adminIdToDelete));
        setShowConfirmationModal(false);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while deleting the Admin.");
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#1d93bc",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold mb-8">All Admins</h1>
      </div>
      <input
        type="search"
        id="default-search"
        onChange={(e) => setSearchKey(e.target.value)}
        className="block w-full mt-3 p-4 pl-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search"
      />

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Full Name</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Contact No</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Admins.filter((key) => {
              const fullName = (key.fullName || "").toLowerCase();
              const email = (key.email || "").toLowerCase();
              const contact = (key.contact || "").toString().toLowerCase();
              return (
                fullName.includes(searchKey.toLowerCase()) ||
                email.includes(searchKey.toLowerCase()) ||
                contact.includes(searchKey.toLowerCase())
              );
            }).map((Admin) => (
              <StyledTableRow key={Admin._id}>
                {" "}
                <StyledTableCell>{Admin.fullName}</StyledTableCell>
                <StyledTableCell align="right">{Admin.email}</StyledTableCell>
                <StyledTableCell align="right">{Admin.contact}</StyledTableCell>
                <StyledTableCell align="right">
                  <button
                    onClick={() => deleteAdmin(Admin._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this admin? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default AllAdmins;
