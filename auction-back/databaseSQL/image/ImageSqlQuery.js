export const INSERT_IMAGE = `
    INSERT INTO images (name, image_url, photo_data)
    VALUES ($1, $2, $3)
    returning *
`

export const GET_IMAGE_BY_FILENAME = `
    SELECT *
    FROM images
    WHERE name = $1
`

export const DELETE_IMAGE_BY_ID = `
    DELETE
    FROM images
    WHERE id = $1
    RETURNING *
`;

export const DELETE_IMAGE_BY_URL = `
    DELETE
    FROM images
    WHERE image_url = $1
    RETURNING *
`;