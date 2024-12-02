import {SOMETHING_WENT_WRONG} from "./TextConstant.js";
import fs from "node:fs";
import Error404 from "./exceptions/Error404.js";

export function generateRandomString(minLength) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    while (randomString.length < minLength) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

export function generateCode() {
    return generateRandomString(12)
}

export function getErrorResponse(res, error) {
    let status = 500;
    let message = SOMETHING_WENT_WRONG;
    switch (error.status) {
        case 400:
        case 401:
        case 403:
        case 404:
        case 422:
        case 503:
            status = error.status;
            message = error.message;
            break;
        default:
            console.log("Unhandled error: ", error);
    }
    return res.status(status).send({message: message})
}

export function deleteTokenExpiredKeys(arr) {
    delete arr.iat;
    delete arr.exp;
}

export function getUserFromRequest(req) {
    const formData = req.body;
    const {user} = req;
    formData.user_id = user.user_id;
    return {user, formData}
}

// Function to generate secure code for admin
// example Fq9-G853Bw-xHebyr-G4SYd-uki4N-UJymo-08xb1
export function generateSecureCode() {
    const part1 = generateRandomString(2);
    const part2 = generateRandomString(6);
    const part3 = generateRandomString(6);
    const part4 = generateRandomString(5);
    const part5 = generateRandomString(5);
    const part6 = generateRandomString(5);
    const part7 = generateRandomString(5);

    return `${part1}-${part2}-${part3}-${part4}-${part5}-${part6}-${part7}`;
}

export function deleteFileByPath(filepath) {
    fs.unlink(filepath, (err) => {
        if (err) {
            console.error('Can`t delete file:', err);
        } else {
            console.log('File delete:', filepath);
        }
    });
}

export function deleteRequestFiles(req) {
    try {
        const files = req.file || req.files;
        files.forEach((file) => deleteFileByPath(file.path));
    } catch (e) {
        console.log("Can't delete file: ", e)
    }
}

export function checkFormDataWithFile(req) {
    const data = req.body;
    const files = req.file || req.files;
    if (!data || !files) {
        throw new Error404("Not found data")
    }
}

export function getRowsOrThrowException(result, msg) {
    const rows = result.rows
    if (rows.length === 0) {
        throw new Error404(msg)
    }
    return rows
}