export const INSERT_LOT = `
    INSERT INTO lots (name, description, seller_id, auction_id, status_id, amount, bank_card_number, monobank_link)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
`

export const SELECT_AUCTION_LOTS = `
    SELECT *
    FROM lots
    WHERE auction_id = $1;
`

export const SELECT_LOT_BY_ID = `
    SELECT lots.id               AS lot_id,
           lots.name             AS lot_name,
           lots.description      AS lot_description,
           lots.amount           AS lot_amount,
           lots.bank_card_number AS lot_bank_card_number,
           lots.monobank_link    AS lot_monobank_link,
           lots.date_created     AS lot_date_created,
           lots.date_finished    AS lot_date_finished,
           sellers.id            AS seller_id,
           sellers.full_name     AS seller_full_name,
           auctions.id           AS auction_id,
           auctions.name         AS auction_name,
           auction_status.id     AS lot_status_id,
           auction_status.name   AS lot_status_name,
           ai.image_url          AS auction_img_path,
           si.image_url          AS seller_img_path
    FROM lots
             JOIN sellers ON lots.seller_id = sellers.id
             JOIN users ON sellers.user_id = users.id
             JOIN auctions ON lots.auction_id = auctions.id
             JOIN auction_status ON lots.status_id = auction_status.id
             LEFT JOIN images ai ON auctions.img_id = ai.id
             LEFT JOIN images si ON users.image_id = si.id
    WHERE lots.id = $1;
`;


export const SELECT_ALL_LOTS = `
    SELECT lots.id               AS lot_id,
           lots.name             AS lot_name,
           lots.description      AS lot_description,
           lots.amount           AS lot_amount,
           lots.bank_card_number AS lot_bank_card_number,
           lots.monobank_link    AS lot_monobank_link,
           lots.date_created     AS lot_date_created,
           sellers.id            AS seller_id,
           sellers.full_name     AS seller_full_name,
           auctions.id           AS auction_id,
           auctions.name         AS auction_name,
           auction_status.id     AS lot_status_id,
           auction_status.name   AS lot_status_name
    FROM lots
             JOIN sellers ON lots.seller_id = sellers.id
             JOIN users ON sellers.user_id = users.id
             JOIN auctions ON lots.auction_id = auctions.id
             JOIN auction_status ON lots.status_id = auction_status.id
             LEFT JOIN images ON auctions.img_id = images.id;
`

export const DELETE_LOT_BY_ID = `
    DELETE
    from lots
    where id = $1
    returning *
`
export const INSERT_LOT_IMAGE = `
    INSERT INTO lot_images (lot_id, img_id)
    VALUES ($1, $2)
    returning *
`

export const SELECT_LOT_IMAGES_BY_LOT_ID = `
    SELECT lot_images.id AS lot_image_id,
           lot_images.lot_id,
           lot_images.img_id,
           images.name   AS image_name,
           images.image_url
    FROM lot_images
             JOIN images ON lot_images.img_id = images.id
    WHERE lot_images.lot_id = $1;

`

export const DELETE_LOT_IMAGES_BY_LOT_ID = `
    DELETE
    FROM lot_images
    where lot_id = $1
    returning *
`

export const INSERT_WINNER_LOT = `
    INSERT INTO lot_winner (lot_id, lot_bet_id)
    VALUES ($1, $2)
    returning *
`

export const SELECT_WINNER_BY_LOT_ID = `
    SELECT u.id               as user_id,
           u.username,
           u.email,
           lw.lot_id          AS lot_id,
           lw.lot_bet_id      AS lot_bet_id,
           lb.amount          AS amount,
           lw.date_created    AS lot_winner_date_created,
           l.name             AS lot_name,
           l.bank_card_number AS lot_bank_card_number,
           l.monobank_link    AS lot_monobank_link
    FROM lot_winner lw
             LEFT JOIN
         lot_bet lb ON lw.lot_bet_id = lb.id
             LEFT JOIN
         users u ON lb.user_id = u.id
             LEFT JOIN
         lots l ON lw.lot_id = l.id
    WHERE lb.lot_id = $1;
`

export const UPDATE_LOT_STATUS = `
    UPDATE lots
    SET status_id     = $2,
        date_finished = CURRENT_TIMESTAMP
    WHERE id = $1;
`

export const UPDATE_LOT_BY_ID = `
    UPDATE lots
    SET name             = $2,
        description      = $3,
        status_id        = $4,
        monobank_link    = $5,
        bank_card_number = $6
    WHERE id = $1
    returning *
`