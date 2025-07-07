export async function onRequest(context) {
    try {
      const { env, params, request } = context;
  
      // 准备一个对象来存放我们要检查的所有调试信息
      const debugInfo = {
        message: "DearAI Pages Function - Debugging Session",
        request_url: request.url,
        did_env_exist: typeof env !== 'undefined',
        env_keys: env ? Object.keys(env) : "env object does not exist.",
        is_articles_bucket_defined: env ? (typeof env.ARTICLES_BUCKET !== 'undefined') : "N/A",
        articles_bucket_type: env ? typeof env.ARTICLES_BUCKET : "N/A",
        params_path_value: params.path,
      };
  
      // 将调试信息格式化为 JSON 字符串并返回
      return new Response(JSON.stringify(debugInfo, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
  
    } catch (e) {
      // 如果连上面的调试代码都出错了，就把错误信息返回
      return new Response(e.stack || e.toString(), { status: 500 });
    }
  }