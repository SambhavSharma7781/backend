class ApiResponse {
    constructor(statusCode, message = "Request successful", data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}