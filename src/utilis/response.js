export function getTraceId(c) {
  return c.get('trace_id') || crypto.randomUUID()
}

export function buildErrorPayload(c, code, message, details = []) {
  return {
    error: {
      code,
      message,
      details,
      trace_id: getTraceId(c),
    },
  }
}

export function sendError(c, status, code, message, details = []) {
  return c.json(buildErrorPayload(c, code, message, details), status)
}
