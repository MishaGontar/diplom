
export const SELECT_VERIFICATION_CODE = `
    SELECT code
    FROM users_codes
    WHERE user_id = $1
      and code = $2`;

export const DELETE_VERIFICATION_CODE = `
    DELETE
    FROM users_codes
    WHERE user_id = $1
      and code = $2`;

export const INSERT_VERIFICATION_CODE = `
    INSERT INTO users_codes (code, user_id)
    VALUES ($1, $2)
    RETURNING *
`;