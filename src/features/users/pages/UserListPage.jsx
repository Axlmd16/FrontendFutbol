import React from "react";
import UserTable from "../components/UserTable";

const UserListPage = () => {
  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Lista de usuarios del sistema
        </h1>
        <p className="mt-4 text-sm text-gray-600">
          Gestiona los usuarios registrados en la plataforma desde esta sección.
        </p>
      </div>
      <UserTable />
    </div>
  );
};

export default UserListPage;
