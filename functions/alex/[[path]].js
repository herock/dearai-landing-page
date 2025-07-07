export async function onRequest(context) {
    const { env, params } = context;
    const bucket = env.ARTICLES_BUCKET;
  
    // 1. 安全地处理路径参数
    // 如果 params.path 是 undefined (对应 /alex/ 的情况), 我们提供一个空数组 [] 作为默认值。
    // 这可以防止 .join() 在 undefined 上被调用，从而避免崩溃。
    const pathSegments = params.path || [];
    const subpath = pathSegments.join('/');
  
    // 2. 构造 R2 中的对象键
    let key = 'alex/' + subpath;
  
    // 3. 如果请求的是目录，则默认提供该目录下的 index.html
    if (key.endsWith('/') || subpath === '') {
      key = 'alex/index.html';
    }
  
    // 4. 从 R2 获取对象
    const object = await bucket.get(key);
  
    // 5. 如果对象未找到，返回一个明确的 404 响应
    if (object === null) {
      return new Response(`Object Not Found: ${key}`, { status: 404 });
    }
  
    // 6. 成功找到对象，构建并返回响应
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
  
    return new Response(object.body, {
      headers,
    });
  }