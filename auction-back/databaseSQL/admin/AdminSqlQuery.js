export const SELECT_ADMIN_BY_LOGIN = `
    SELECT admins.id       AS admin_id,
           admins.login,
           admins.password AS admin_password,
           admins.secure_code,
           users.id        AS user_id,
           users.username,
           users.password  AS user_password,
           users.email,
           users.is_activated,
           images.id       AS image_id,
           images.name     AS image_name,
           images.image_url
    FROM admins
             INNER JOIN users ON admins.user_id = users.id
             LEFT JOIN images ON users.image_id = images.id
    WHERE admins.login = $1;
`;

export const SELECT_ADMIN_BY_USER_ID = `
    SELECT *
    from admins
    WHERE admins.user_id = $1`;
