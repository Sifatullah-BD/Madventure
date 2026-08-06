/**
 * Utility for formatting consistent API responses (Volume 23 Chapter 330)
 */

export const successResponse = (message, data = {}, meta = {}, status = 200) => {
  return new Response(JSON.stringify({
    success: true,
    message,
    data,
    meta
  }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const createdResponse = (message, data = {}) => {
  return successResponse(message, data, {}, 201);
};

export const errorResponse = (code, message, status = 400) => {
  return new Response(JSON.stringify({
    success: false,
    error: {
      code,
      message
    }
  }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};
