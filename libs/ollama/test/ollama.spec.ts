import { readFile } from 'fs-extra'
import { Ollama } from 'ollama'
import path from 'path'
import * as util from 'util'

const log = (o: any) => console.log(util.inspect(o, false, null, true))

describe('Ollama', () => {
  let ollama: Ollama

  beforeAll(async () => {
    ollama = new Ollama({ host: undefined })
  })

  it('ollama tools', async () => {
    /**
     * tools 지원하는 모델. (24.09.10 기준)
     * - llama3.1
     * - mistral-nemo (format: json 설정해야 동작함.)
     */
    const res = await ollama.chat({
      model: 'llama3.1',
      messages: [{ role: 'user', content: 'reply me!' }],
      format: 'json',
      tools: [
        {
          type: 'function',
          function: {
            name: 'reply to user',
            description: 'reply to the user',
            parameters: {
              type: 'object',
              required: ['reply'],
              properties: {
                reply: {
                  type: 'string',
                  description: 'the reply message',
                },
              },
            },
          },
        },
      ],
    })
    // log(res)
    expect(res.message.tool_calls).toHaveLength(1)
    expect(res.message.tool_calls![0].function.name).toEqual('reply to user')
    expect(res.message.tool_calls![0].function.arguments).toHaveProperty(
      'reply',
    )
  })

  it('ollama embedding', async () => {
    const res = await ollama.embeddings({
      model: 'llama3.1',
      prompt: 'i am a sentence.',
    })
    // log(res)
    expect(res.embedding.length).toBeGreaterThan(0)
  })

  it('ollama vision', async () => {
    /**
     * vision 지원하는 모델. (24.09.10 기준)
     * - llava:7b
     * - llava:13b
     */
    const image = await readFile(path.join(__dirname, 'res/face.png'))
    const res = await ollama.chat({
      model: 'llava:7b',
      messages: [
        {
          role: 'user',
          content: 'describe this image',
          images: [image],
        },
      ],
    })

    // log(res)
    expect(res.message.content).toBeTruthy()
  })
})
