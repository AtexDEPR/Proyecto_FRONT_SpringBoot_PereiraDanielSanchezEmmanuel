const UserRoleBadge = ({ role }) => {
  const roleConfig = {
    ADMINISTRADOR: { color: "from-red-500 to-pink-500", text: "Administrador" },
    OPERADOR: { color: "from-blue-500 to-cyan-500", text: "Operador" },
    CLIENTE: { color: "from-green-500 to-emerald-500", text: "Cliente" },
  }

  const config = roleConfig[role] || roleConfig.CLIENTE

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${config.color}`}
    >
      {config.text}
    </span>
  )
}

export default UserRoleBadge
