import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import api from "../../components/utils/api";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import "./style.css";

const Panel = () => {
  const [userList, setUserList] = useState([]);
  const getUsers = async () => {
    try {
      const { data } = await api.get("/api/users/get_users");
      setUserList(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const isValidAction = (username) => {
    const currentUser = jwt_decode(
      JSON.parse(localStorage.getItem("logged")).accessToken
    );
    if (currentUser.role === "user")
      return {
        valid: false,
        msg: "YU here, peasant?",
      };
    if (username === currentUser.username)
      return {
        valid: false,
        msg: "You can't do shit to your own id, ask someone with a higher role",
      };
    const user_role = userList.find((u) => u.username === username)?.role;
    if (!user_role)
      return {
        valid: false,
        msg: "Cannot find target's role, 100% a bug on frontend",
      };
    if (user_role === "admin")
      return {
        valid: false,
        msg: "You dare do somethin up on the boss?",
      };
    if (user_role === "mod")
      if (currentUser.role === "admin")
        return {
          valid: true,
          msg: "Your wish my command, sir.",
        };
      else
        return {
          valid: false,
          msg: "U gay for tryin somethin on yo sibling",
        };
    if (user_role === "user")
      return {
        valid: true,
        msg: "Your wish my command, sir.",
      };
    return {
      valid: false,
      msg: "Unexpected shit be happenin in muh watch, damn",
    };
  };
  const updateUserRole = async (username, action) => {
    let validAction = isValidAction(username);
    alert(validAction.msg);
    if (!validAction.valid) return;
    try {
      const { data } = await api.patch("/api/users/alt_update_user", {
        username,
        action,
      });
      console.log(data);
      getUsers();
    } catch (err) {
      console.log(err);
    }
  };
  const deleteUser = async (username) => {
    let validAction = isValidAction(username);
    if (!validAction.valid) {
      alert(validAction.msg);
      return;
    }
    try {
      const { data } = await api.delete(
        `/api/users/delete_user?username=${username}`
      );
      console.log(data);
      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-dark font-medium">Admin Panel</h1>
      <p className="text-dark-2">
        You sure you admin or some shit? The backend will check yo role, so
        don't even try. You can update user roles via the arrow icons and remove
        a user using the delete button (yes this is obvious)
      </p>
      <div className="user-manager my-4">
        <table className="text-dark-2 text-sm w-full">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Username</th>
              <th className="text-left px-8 py-2">Role</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Branch</th>
              <th className="text-left px-4 py-2">Year</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.username}>
                <td className="px-4 py-2 text-dark">{user.username}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <div className={`user-tag text-sm text-center ${user.role}`}>
                    {user.role}
                  </div>
                  <RiArrowUpSLine
                    className="cursor-pointer"
                    onClick={() => updateUserRole(user.username, "promote")}
                  />
                  <RiArrowDownSLine
                    className="cursor-pointer"
                    onClick={() => updateUserRole(user.username, "demote")}
                  />
                </td>
                <td className="px-4 py-2 text-dark">{user.name || "-"}</td>
                <td className="px-4 py-2">{user.branch || "-"}</td>
                <td className="px-4 py-2">{user.year || "-"}</td>
                <td
                  className="text-red-500 cursor-pointer"
                  onClick={() => deleteUser(user.username)}
                >
                  Delete
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Panel;
