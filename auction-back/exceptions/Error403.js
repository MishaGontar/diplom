class Error403 extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.status = 403;
    }
}

export default Error403;