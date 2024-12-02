class Error404 extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.status = 404;
    }
}

export default Error404;