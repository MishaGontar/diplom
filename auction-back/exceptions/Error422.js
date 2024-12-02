class Error422 extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.status = 422;
    }
}

export default Error422;