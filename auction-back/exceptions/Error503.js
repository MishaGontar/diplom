class Error503 extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.status = 503;
    }
}

export default Error503;