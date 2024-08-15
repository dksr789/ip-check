app.use((req, res, next) => {
    // List of allowed IPs, normalized
    const allowedIps = ['127.0.0.2', '123.45.67.89', '106.221.232.249'].map(normalizeIp);

    // Get the client's IP address from x-forwarded-for or fall back to remoteAddress
    let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    
    // If x-forwarded-for contains multiple IPs, take the first one
    if (typeof clientIp === 'string' && clientIp.includes(',')) {
        clientIp = clientIp.split(',')[0].trim();
    }

    // Normalize the client's IP address
    const normalizedClientIp = normalizeIp(clientIp);

    // Log normalized client IP
    console.log('Client IP:', normalizedClientIp);

    // Check if the client's normalized IP is in the list of allowed IPs
    if (allowedIps.includes(normalizedClientIp)) {
        next(); // IP is allowed, proceed with the request
    } else {
        res.status(403).send('Access denied'); // IP is not allowed
    }
});
