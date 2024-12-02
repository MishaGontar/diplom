export const INSERT_AUCTION = `
    INSERT INTO auctions (name, description, seller_id, status_id, img_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
`

export const SELECT_ALL_AUCTION_STATUS = `
    SELECT *
    from auction_status
    where name != 'продано'
`

export const SELECT_AUCTION_BY_SELLER_ID = `
    SELECT a.id          AS auction_id,
           a.name        AS auction_name,
           a.description AS auction_description,
           a.date_created,
           a.date_finished,
           rs.name       AS auction_status,
           rs.id         AS auction_status_id,
           i.image_url   AS auction_img_path,
           a.seller_id   AS seller_id,
           s.full_name   AS seller_name
    FROM auctions a
             JOIN
         auction_status rs ON a.status_id = rs.id
             LEFT JOIN
         images i ON a.img_id = i.id
             JOIN
         sellers s ON a.seller_id = s.id
    WHERE a.seller_id = $1
    ORDER BY date_created DESC;
`

export const SELECT_AUCTION_BY_ID = `
    SELECT a.id          AS auction_id,
           a.name        AS auction_name,
           a.description AS auction_description,
           a.date_finished,
           rs.name       AS auction_status,
           rs.id         AS auction_status_id,
           ai.image_url  AS auction_img_path,
           a.seller_id   AS seller_id,
           s.full_name   AS seller_name,
           si.image_url  AS seller_img_path
    FROM auctions a
             JOIN auction_status rs ON a.status_id = rs.id
             LEFT JOIN images ai ON a.img_id = ai.id
             JOIN sellers s ON a.seller_id = s.id
             JOIN users u ON s.user_id = u.id
             LEFT JOIN images si ON u.image_id = si.id
    WHERE a.id = $1;
`;
export const SELECT_ALL_AUCTION = `
    SELECT a.id          AS auction_id,
           a.name        AS auction_name,
           a.description AS auction_description,
           a.date_created,
           a.date_finished,
           rs.name       AS auction_status,
           rs.id         AS auction_status_id,
           i.image_url   AS auction_img_path,
           a.seller_id   AS seller_id,
           s.full_name   AS seller_name
    FROM auctions a
             JOIN
         auction_status rs ON a.status_id = rs.id
             LEFT JOIN
         images i ON a.img_id = i.id
             JOIN
         sellers s ON a.seller_id = s.id ;
`
export const UPDATE_AUCTION_BY_ID = `
    UPDATE auctions
    SET name        = $1,
        description = $2,
        status_id   = $3,
        img_id      = $4,
        date_finished = null
    WHERE id = $5
    returning *
`

export const UPDATE_FINISHED_AUCTION = `
    UPDATE auctions
    SET date_finished = CURRENT_TIMESTAMP
    WHERE id = $1
    returning *
`
export const UPDATE_AUCTION_BY_ID_WITHOUT_IMG = `
    UPDATE auctions
    SET name        = $1,
        description = $2,
        status_id   = $3,
        date_finished = null
    WHERE id = $4
    returning *
`
export const DELETE_AUCTION_BY_ID = `
    DELETE
    FROM auctions
    where id = $1
    returning *
`
export const SELECT_ONLY_AUCTION_CREATE_STATUS = `
    SELECT *
    from auction_status
    WHERE name != 'продано'
      and name != 'завершений'
`