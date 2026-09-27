/**
 * The SDK's fetch, reading the whole body before the SDK sees the response. SDK 0.6.0 clones each
 * response and reads the copy; when its timeout aborts that read mid-body, the fetch bundled with
 * Node 22 and some Node 24 and 25 releases throws an AbortError that no caller can catch, and the
 * process exits (https://github.com/typesafe-ai/typesafe-sdk-js/issues/2). Here the timeout ends
 * this read as an ordinary rejection, and the SDK receives a body already in memory.
 */
export async function fetchWholeBody(url, init) {
  const response = await fetch(url, init);
  const body = await response.arrayBuffer();
  return new Response([204, 205, 304].includes(response.status) ? null : body, {
    status: response.status, statusText: response.statusText, headers: response.headers,
  });
}
