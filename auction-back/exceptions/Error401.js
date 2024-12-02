class Error401 extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.status = 401;
    }
}

export default Error401;