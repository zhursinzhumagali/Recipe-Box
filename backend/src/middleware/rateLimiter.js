import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: { error: 'Too many requests, try again later' }
});

export default limiter;
