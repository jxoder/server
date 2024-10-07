import { ComponentLoader } from 'adminjs'
import * as path from 'path'

const componentLoader = new ComponentLoader()

/**
 * @param key uniq component key
 * @param p static/adminjs/{p} (custom component path)
 */
function registerComponent(key: string, p: string) {
  return componentLoader.add(
    key,
    path.join(process.cwd(), 'static', 'adminjs', p),
  )
}

export { componentLoader, registerComponent }
