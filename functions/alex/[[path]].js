export async function onRequest(context) {
    // 从上下文中获取 R2 存储桶的绑定
    const { env, params, next } = context;
    const bucket = env.ARTICLES_BUCKET;
  
    // 1. 构造 R2 中的对象键 (Object Key)
    // params.path 是一个数组，包含了 /alex/ 后面的所有路径部分
    // 例如，访问 /alex/index.html, params.path 就是 ['index.html']
    // 访问 /alex/letters/some-article.html, params.path 就是 ['letters', 'some-article.html']
    let key = 'alex/' + params.path.join('/');
  
    // 2. 处理对目录的请求 (例如 /alex/ 或 /alex/letters/)
    // 如果请求的路径以 / 结尾，或者不包含点 (很可能是一个目录)，
    // 我们就默认去查找该目录下的 index.html 文件。
    if (key.endsWith('/') || !key.includes('.')) {
      if (!key.endsWith('/')) {
        key += '/';
      }
      key += 'index.html';
    }
  
    // 3. 从 R2 获取对象
    const object = await bucket.get(key);
  
    // 4. 处理未找到对象的情况
    if (object === null) {
      // 在 R2 中没有找到对应的文件，将请求传递给静态资源处理器
      // 这允许 Pages 仍然可以提供 /css/style.css 等其他静态文件
      return next();
    }
  
    // 5. 成功找到对象，返回响应
    // 从对象中提取 HTTP 元数据 (如 Content-Type)
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
  
    return new Response(object.body, {
      headers,
    });
  }