export const SELECT_SELLER_BY_USER_ID = `
    SELECT s.id    AS seller_id,
           s.full_name,
           s.social_media,
           ss.name AS status_name,
           ss.id AS status_id,
           s.address,
           s.description,
           s.phone_number,
           u.id    AS user_id,
           u.username,
           u.email,
           u.is_activated,
           i.image_url
    FROM sellers s
             JOIN
         users u ON s.user_id = u.id
             LEFT JOIN
         images i ON u.image_id = i.id
             JOIN
         seller_status ss ON s.status_id = ss.id
    WHERE s.user_id = $1;
`;

export const SELECT_SELLER_BY_ID = `
    SELECT s.id AS seller_id,
           s.full_name,
           s.social_media,
           s.status_id,
           s.address,
           s.description,
           s.phone_number,
           i.image_url
    FROM sellers s
             JOIN
         users u ON s.user_id = u.id
             LEFT JOIN
         images i ON u.image_id = i.id
             JOIN
         seller_status ss ON s.status_id = ss.id
    WHERE s.id = $1;
`;

export const SELECT_SELLERS = `
    SELECT a.id    AS seller_id,
           a.full_name,
           a.social_media,
           ss.name AS seller_status,
           ss.id   AS seller_status_id,
           a.address,
           a.description,
           a.phone_number,
           u.id    AS user_id,
           u.username,
           u.email,
           u.is_activated,
           i.image_url
    FROM sellers a
             JOIN users u ON a.user_id = u.id
             JOIN seller_status ss ON a.status_id = ss.id
             JOIN images i ON u.image_id = i.id;
`;

export const INSERT_SELLER = `
    INSERT INTO sellers (user_id, full_name, social_media, address, phone_number, description)
    VALUES ($1, $2, $3, $4, $5, $6)
    returning *;
`

export const UPDATE_STATUS_ID = `
    UPDATE sellers
    SET status_id = $1
    WHERE id = $2
    returning *
`

export const SELECT_ALL_SELLER_STATUS = `
    SELECT *
    from seller_status
`