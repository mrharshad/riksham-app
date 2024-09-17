import jwt from "jsonwebtoken";
function verifyRole(token, roleName) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_CODE);
    if (!roleName) {
      return decoded;
    } else {
      return decoded.role.includes(roleName);
    }
  } catch {
    return null;
  }
}

export { verifyRole };
