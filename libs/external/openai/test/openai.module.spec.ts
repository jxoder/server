import { Test } from '@nestjs/testing'
import { CommonModule } from '@slibs/common'
import { OpenaiModule } from '@slibs/openai'
import OpenAI from 'openai'
import util from 'util'

describe('openai test', () => {
  let openai: OpenAI

  beforeAll(async () => {
    const module = Test.createTestingModule({
      imports: [CommonModule, OpenaiModule],
    })

    const app = await module.compile()
    openai = app.get(OpenAI)
  })

  it('embedding', async () => {
    const res = await openai.embeddings.create({
      model: 'nomic-embed-text',
      input: 'The food was delicious and the waiter was friendly.',
    })

    console.log(
      util.inspect(res, { showHidden: true, depth: null, colors: true }),
    )
  })

  it('vision', async () => {
    // Notice: base64 로 encoding된 이미지는 동작하지 않음. url 만 동작됨.
    const res = await openai.chat.completions.create({
      model: 'llama3.2-vision-11b',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What’s in this image?' },
            {
              type: 'image_url',
              image_url: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg',
                detail: 'high',
              },
            },
          ],
        },
      ],
    })

    console.log(
      util.inspect(res, { showHidden: true, depth: null, colors: true }),
    )
  })

  it('text completion', async () => {
    const res = await openai.chat.completions.create({
      model: 'llama3.2-3b',
      messages: [{ role: 'user', content: 'hello' }],
    })

    console.log(
      util.inspect(res, { showHidden: true, depth: null, colors: true }),
    )
  })

  it('model list', async () => {
    const list = await openai.models.list()
    expect(list.data.length).toBeGreaterThan(0)
  })
})
