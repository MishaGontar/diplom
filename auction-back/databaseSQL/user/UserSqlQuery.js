export const SELECT_USER_BY_USERNAME_OR_EMAIL = `
    SELECT u.id AS user_id,
           u.username,
           u.email,
           u.password,
           u.is_activated,
           i.image_url
    FROM users u
             JOIN images i ON u.image_id = i.id
    WHERE u.username = $1
       OR u.email = $1
`;

export const SELECT_ALL_USERS = `
    SELECT u.id AS user_id,
           u.username,
           u.email,
           u.is_activated,
           i.image_url,
           s.id AS seller_id
    FROM users u
             JOIN images i ON u.image_id = i.id
             LEFT JOIN sellers s ON u.id = s.user_id
    WHERE u.id NOT IN (SELECT user_id FROM admins);
`

export const SELECT_USER_BY_USERNAME_OR_EMAIL_WITH_EMAIL = `
    SELECT u.id AS user_id,
           u.username,
           u.email,
           u.password,
           u.is_activated,
           i.image_url
    FROM users u
             JOIN images i ON u.image_id = i.id
    WHERE u.username = $1
       OR u.email = $2
`;

export const INSERT_NEW_USER = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id as user_id, username, email
`;


export const UPDATE_USER_ACTIVATION_STATUS = `
    UPDATE users AS u
    SET is_activated = $1
    FROM images AS i
    WHERE u.id = $2
      AND u.image_id = i.id
    RETURNING u.id as user_id, u.username, u.email, u.is_activated, i.image_url
`;
export const SELECT_USER_BY_ID = `
    SELECT *
    from users
    where id = $1
`
export const UPDATE_USER_PHOTO = `
    UPDATE users AS u
    SET image_id = $1
    FROM images AS i
    WHERE u.id = $2
      AND u.image_id = i.id
    RETURNING u.id as user_id, u.username, u.email, u.is_activated, i.image_url
`

export const DELETE_USER_BY_ID = `
    DELETE
    from users
    where id = $1
    returning *
`

export const BLOCK_USER_BY_ID = `
    INSERT INTO blocked_users (user_id)
    VALUES ($1)
    returning *
`

export const SELECT_BLOCK_USERS = `
    SELECT u.id, u.username, u.email, u.image_id, u.is_activated, i.image_url
    FROM users u
             JOIN blocked_users b ON u.id = b.user_id
             JOIN images i ON u.image_id = i.id;
`

export const SELECT_BLOCK_USER_BY_ID = `
    SELECT *
    FROM blocked_users
    where user_id = $1
`

export const UNBLOCK_USER_BY_ID = `
    DELETE
    FROM blocked_users
    where user_id = $1
    returning *`

export const BLOCK_USER_FOR_SELLER_BY_ID = `
    INSERT INTO blocked_seller_users (seller_id, user_id)
    VALUES ($1, $2)
    returning *;
`

export const SELECT_BLOCK_SELLER_USERS = `
    SELECT bsu.user_id, u.username, i.image_url, bsu.date_created
    FROM users u
             JOIN blocked_seller_users bsu ON u.id = bsu.user_id
             JOIN sellers s ON bsu.seller_id = s.id
             JOIN images i ON u.image_id = i.id;
`

export const SELECT_BLOCK_SELLER_USERS_BY_SELLER_ID = `
    SELECT *
    from blocked_seller_users
    where user_id = $1
      and seller_id = $2
`
export const UNBLOCK_USER_FOR_SELLER_BY_ID = `
    DELETE
    FROM blocked_seller_users
    where seller_id = $1
      and user_id = $2
    returning *
`

export const DELETE_INACTIVE_OR_MARKED_USERS=`
    DELETE
    FROM users
    WHERE username LIKE '%delete_me%'
       OR is_activated = false;
`