---
title: LLM工具大全
date: 2024-01-05 20:29:28
tags:
  - AI
  - LLMs
---

## 背景

2023年是开源LLM爆发的一年，不仅包含非常多优秀的开源模型，还有大量结合LLM开发智能应用的工具，这篇文章主要整理相关内容，包括但不限于以下：

- 本地LLM部署
- LLM+RAG 工具
- Agent工具

<!--more-->


## 本地LLM部署

在本地LLM部署方面，有多个开源工具可供选择，以下是其中一些的对比：

| 工具           | 部署难度 | GUFF量化模型支持 | 兼容OpenAI的REST风格API | 模型微调 | 函数调用工具 | 文本嵌入模型支持 | Apple M芯片支持 |
| -------------- | -------- | ---------------- | ------------------------- | -------- | ------------ | ---------------- | --------------- |
| [LocalAI](https://github.com/mudler/LocalAI)     | ⭐️⭐️⭐️⭐️ | ✅               | ✅                        | ❌       | ❌           | ❌               | ✅              |
| [Ollama](https://github.com/jmorganca/ollama)     | ⭐️           | ✅               | ❌                        | ❌       | ❌           | ❌               | ✅              |
| [OpenLLM](https://github.com/bentoml/OpenLLM)     | ⭐️⭐️        | ✅               |    ❌                     | ✅       | ❌           | ❌               | ❌              |
| [Xinference](https://github.com/xorbitsai/inference) | ⭐️⭐️        | ✅               | ✅                        | ❌       | ✅           | ❌               | ✅              |
| [Fastchat](https://github.com/lm-sys/FastChat)    | ⭐️⭐️        | ❌               | ✅                        | ❌       | ❌           | ❌               | ✅              |

## OpenAI API代理

对于不兼容OpenAI的REST风格API的部署工具，可以使用以下代理服务：

| 代理服务            | 支持工具                               |
| ------------------- | -------------------------------------- |
| [liteLLM](https://github.com/BerriAI/litellm)   | 对于某些不兼容openai的REST风格API的部署工具，比如Ollama，可以使用liteLLM开启代理服务，从而间接支持                                |
| [oneapi](https://github.com/songquanpeng/one-api) | 统一接口管理和分发系统，整合多种开源模型的API |
| [AI gateway](https://github.com/Portkey-AI/gateway) |                                       |

## 低代码工具开发

在低代码工具开发方面，有几个项目可供选择：

| 工具                  | 部署难度 | 易用度       | RAG支持      | 多路召回 | rerank模型 | 函数调用工具 |
| --------------------- | -------- | ------------ | ------------ | -------- | ---------- | ------------ |
| [dify](https://github.com/langgenius/dify)        | ⭐️⭐️       | ⭐️⭐️⭐️⭐️  | ⭐️⭐️⭐️⭐️  | ✅       | ✅         | ❌           |
| [fastgpt](https://github.com/labring/FastGPT)     | ⭐️⭐️⭐️⭐️   | ⭐️⭐️        | ⭐️⭐️⭐️⭐️  | ✅       | ❌         | ✅           |
| [flowise](https://github.com/FlowiseAI/Flowise)   | ⭐️          | ⭐️⭐️⭐️⭐️  | ⭐️⭐️        | ❌       | ❌         | ✅           |
| [langflow](https://github.com/logspace-ai/langflow)                                      |  ⭐️            |  ⭐️ ⭐️ ⭐️             |   ⭐️ ⭐️ ⭐️            |  ✅        |    ❌        |    ✅          |
| [bionic-gpt](https://github.com/bionic-gpt/bionic-gpt) | ⭐️⭐️      | ⭐️⭐️        | ⭐️⭐️        | ❌       | ❌         | ❌           |

## Agent工具

以下是一些Agent工具：

- [autogen](https://github.com/microsoft/autogen)
- [metagpt](https://github.com/geekan/MetaGPT)
- [autogpt](https://github.com/Significant-Gravitas/AutoGPT)
- [crewAI](https://github.com/joaomdmoura/crewAI)
- [chatdev](https://github.com/OpenBMB/ChatDev)

## 聊天平台

以下是一些免费的大模型聊天平台，包含许多最新的开源模型：

- [HuggingChat](https://huggingface.co/chat/)
- [vercel.ai](https://sdk.vercel.ai/)

## 其他

* 关于Hugging Face访问和下载慢的问题，可以更改镜像源，具体参考 [hf-mirror](https://hf-mirror.com/)。
* 优秀prompt分享网站： [Prompt Genius](https://www.promptgenius.site/)。