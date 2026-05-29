const z = require('zod');
const AppError = require('../utils/AppError');

/**
 * Middleware factory for request body validation using Zod.
 * Usage: router.post('/route', validateRequest(myZodSchema), controller)
 *
 * On success: sets req.body to the parsed (type-safe) data and calls next().
 * On failure: passes a 400 AppError to the global error handler.
 */
const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // Flatten Zod errors into readable field-by-field messages
        const fieldErrors = result.error.flatten().fieldErrors;
        const firstError = Object.values(fieldErrors).flat()[0];
        return next(new AppError(firstError || 'Validation failed', 400));
    }

    // Replace req.body with the sanitized, type-safe Zod output
    req.body = result.data;
    next();
};

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

const registerSchema = z.object({
    userName: z.string().min(2, 'Username must be at least 2 characters').max(50),
    emailId: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

const loginSchema = z.object({
    emailId: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// ─── Event Schemas ────────────────────────────────────────────────────────────

const VALID_CATEGORIES = ['Music', 'Technology', 'Business', 'Sports', 'Arts', 'Education', 'Food', 'Other'];

const createEventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(50),
    description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
    content: z.string().min(10, 'Content must be at least 10 characters').max(2000),
    category: z.enum(VALID_CATEGORIES, { errorMap: () => ({ message: 'Invalid category' }) }),
    venue: z.string().min(3, 'Venue must be at least 3 characters'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    price: z.coerce.number().min(0, 'Price cannot be negative').default(0),
    isFree: z.boolean().default(false),
    lat: z.coerce.number({ invalid_type_error: 'Latitude is required' }),
    lng: z.coerce.number({ invalid_type_error: 'Longitude is required' }),
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
});

// Update is a partial — all fields are optional, only validates what's provided
const updateEventSchema = z.object({
    title: z.string().min(3).max(50).optional(),
    description: z.string().min(10).max(2000).optional(),
    content: z.string().min(10).max(2000).optional(),
    category: z.enum(VALID_CATEGORIES).optional(),
    venue: z.string().min(3).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    isFree: z.boolean().optional(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    isCancelled: z.boolean().optional(),
    isCompleted: z.boolean().optional(),
});

module.exports = {
    validateRequest,
    registerSchema,
    loginSchema,
    createEventSchema,
    updateEventSchema,
};
