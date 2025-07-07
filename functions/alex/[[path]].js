export async function onRequest(context) {
    // 从上下文中解构所需的对象
    const { env, params } = context;
    const bucket = env.ARTICLES_BUCKET;
  
    // 1. 构造 R2 中的对象键
    // params.path 是一个数组，例如 ['letters', 'some-article.html']
    let key = 'alex/' + params.path.join('/');
  
    // 2. 如果请求的是目录 (如 /alex/ 或 /alex/letters/)，
    //    则默认提供该目录下的 index.html。
    //    注意：我们不再检查路径是否包含点。
    if (key.endsWith('/')) {
      key += 'index.html';
    }
  
    // 3. 从 R2 获取对象
    const object = await bucket.get(key);
  
    // 4. 如果对象未找到，返回一个明确的 404 响应
    if (object === null) {
      // 我们可以返回一个简单的文本 404
      return new Response(`Object Not Found: ${key}`, { status: 404 });
      // 或者，如果你有一个自定义的静态 404.html 页面在你的项目根目录，
      // 可以用 context.next() 去获取它，但直接返回更简单可靠。
    }
  
    // 5. 成功找到对象，构建并返回响应
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
  
    return new Response(object.body, {
      headers,
    });
  }