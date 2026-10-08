---
title: nuxt3上实现动态配置反向代理的方法
date: 2024-04-08 21:59:41
tags:
    - nuxt
    - vue
    - 前端
    - 反向代理
---

## 场景

实现一个本地LLM前端Chat界面，使用[Ollama](https://ollama.com)部署本地LLM。基本功能：在前端设置模型的服务地址如`http://localhost:11434`，由于浏览器存在跨域问题，所以必须采用一些方法来解决该问题。

<!--more-->

## 思路

方式一：当然，最简单的办法是在启动ollama服务的时候，开启跨域支持，通过配置`OLLAMA_ORIGIN=*`变量来解决跨域问题，具体参考[这里](https://medium.com/dcoderai/how-to-handle-cors-settings-in-ollama-a-comprehensive-guide-ee2a5a1beef0)。

存在的问题：需要修改服务端配置，而且前端最好可以支持多种不同的服务端，不能每次都要求服务端修改配置。所以另一种方式就是用反向代理。

方式二：Nuxt3框架提供了不少方法，比如在nuxt.config.js中可以配置反向代理。具体参考[这里](https://stackoverflow.com/questions/74570188/how-do-i-set-proxy-in-nuxt3)。

存在的问题：只支持动态的服务地址，由于用户可以在前端输入任意的服务端地址，所以这种方案也不适用。

## 解决方案

最终找到了一个解决方案，就是直接挂载后端服务到nuxt3框架中。参考[这里](https://nuxt.com/docs/guide/directory-structure/server)

nuxt3有一个目录`server`，该目录下可以部署api服务，从而解决思路是利用api服务自己写一个反向代理就好了。

比如在`server`下新建一个路径`api/openai.js`，代码如下：
```js
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    try {
        const response = await fetch(body.url + "/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${body.sk || 'sk-none'}`
            },
            body: JSON.stringify({
                messages: body.messages,
                model: body.model,
                temperature: body.temperature,
                max_tokens: body.max_tokens,
                stop: body.stop,
                stream: body.stream
            })
        })
        return sendStream(event, response.body)
    } catch (e) {
        console.log(e)
        return {error: e}
    }

})
```

然后前端可以直接`fetch('/api/openai')`来发送请求了。

## 总结

对于刚接触不久的前端er来说，一直在思考反向代理的服务地址动态配置的方法，研究了半天，发现并没有什么方法。最后还是要自己写一个反向代理。

然后一个坑在于，转发openai api的stream response的时候，各种问题出现了，如果使用openai的js官方api的话，返回的stream类型无法直sendStream，要转为普通的stream reponse还挺麻烦，比如`vercel`的ai库就提供这个功能，但是我不想引入更多第三方库了。

最后还是用fetch来手动发送请求，这样得到的response就可以sendStream了。

另：所有代码在这https://github.com/gamersover/chatgpt-playground-clone