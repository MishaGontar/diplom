export const SELECT_LOT_BET_BY_LOT_ID = `
    SELECT lb.id       AS bet_id,
           lb.lot_id,
           lb.user_id,
           lb.amount,
           lb.date_created,
           u.username,
           i.image_url AS user_img_url
    FROM lot_bet lb
             LEFT JOIN users u ON lb.user_id = u.id
             LEFT JOIN images i ON u.image_id = i.id
    WHERE lb.lot_id = $1
    ORDER BY lb.amount DESC;
`;


export const INSERT_LOT_BET = `
    INSERT INTO lot_bet (lot_id, user_id, amount)
    VALUES ($1, $2, $3)
    RETURNING id AS bet_id, lot_id, user_id, amount, date_created;
`

export const DELETE_LOT_BET_BY_ID_AND_LOT_BET_ID = `
    DELETE
    FROM lot_bet
    where id = $1
      and lot_id = $2
    returning *
`

export const SELECT_LOT_BETS_BY_USER_ID = `
    SELECT lb.id       AS bet_id,
           lb.lot_id,
           lb.amount,
           l.name      AS lot_name,
           lb.date_created,
           s.full_name AS seller_name,
           s.id        as seller_id
    FROM lot_bet lb
             JOIN
         lots l ON lb.lot_id = l.id
             JOIN
         sellers s ON l.seller_id = s.id
    WHERE lb.user_id = $1
      AND l.status_id != 3;
`

export const SELECT_WINNER_LOTS_BY_LOT_BET_ID = `
    SELECT *
    FROM lot_winner
    WHERE lot_bet_id = $1;
`;