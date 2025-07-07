export async function onRequest(context) {
    const { params } = context;
  
    // 我们只检查 params 对象本身和它的 path 属性
    const debugInfo = {
      message: "Second Debugging Attempt: Checking 'params'",
      is_params_defined: typeof params !== 'undefined',
      params_path_raw: "Not yet checked", // 先设为默认值
    };
  
    // 只有在 params 确认存在时，才去尝试访问它的 path 属性
    if (debugInfo.is_params_defined) {
      debugInfo.params_path_raw = params.path;
    }
    
    return new Response(JSON.stringify(debugInfo, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }