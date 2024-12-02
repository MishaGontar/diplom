class Error400 extends Error {

    constructor(message) {
        const msg = message ?? 'Missing required fields'
        super(msg);
        this.message = msg;
        this.status = 400;
    }
}

export default Error400;