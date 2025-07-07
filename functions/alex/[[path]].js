export async function onRequest(context) {
    const { env, params, request, next } = context;
    const bucket = env.ARTICLES_BUCKET;
  
    // 1. 检查请求是否来自我们的 Function 自身，避免无限循环
    // 这是个安全措施，防止 next() 调用后又回到这里
    if (request.headers.get('x-pages-function-invoked')) {
      return next();
    }
  
    // 2. 构造 R2 中的对象键 (Object Key)
    let key = 'alex/' + params.path.join('/');
  
    // 3. 处理对目录的请求，默认查找 index.html
    if (key.endsWith('/')) {
      key += 'index.html';
    }
  
    // 4. 从 R2 获取对象
    const object = await bucket.get(key);
  
    // 5. 如果在 R2 中没有找到对象，把请求交给 Pages 的静态处理器
    if (object === null) {
      // 设置一个请求头，标记我们已经尝试过 Function 处理
      const newRequest = new Request(request);
      newRequest.headers.set('x-pages-function-invoked', 'true');
      // 把带有标记的新请求交给 next()
      return next(newRequest);
    }
  
    // 6. 成功找到对象，返回响应
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
  
    return new Response(object.body, {
      headers,
    });
  }