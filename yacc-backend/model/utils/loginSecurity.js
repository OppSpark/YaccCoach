module.exports.auditLog = async (userId, action) => {
    const connection = await mysqlDB.getConnection();
    await connection.query(
        `INSERT INTO audit_log 
        (user_id, action, ip_address, user_agent) 
        VALUES (?, ?, ?, ?)`,
        [userId, action, req.ip, req.get("User-Agent")]
    );
    connection.release();
};
