import { config } from 'dotenv'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { app as apiApp, type Bindings } from './index'

config()

const readEnv = (...keys: string[]): string => {
    for (const key of keys) {
        const value = process.env[key];
        if (value !== undefined && value !== '') {
            return value;
        }
    }
    return '';
}

const runtimeBindings: Readonly<Bindings> = Object.freeze({
    MAIN_URLS: readEnv('MAIN_URLS', 'OPLIST_MAIN_URLS'),
    PROXY_API: readEnv('PROXY_API', 'OPLIST_PROXY_API'),
    baiduyun_ext: readEnv('baiduyun_ext', 'OPLIST_BAIDUYUN_EXT'),
    onedrive_uid: readEnv('onedrive_uid', 'OPLIST_ONEDRIVE_UID'),
    onedrive_key: readEnv('onedrive_key', 'OPLIST_ONEDRIVE_KEY'),
    alicloud_uid: readEnv('alicloud_uid', 'OPLIST_ALICLOUD_UID'),
    alicloud_key: readEnv('alicloud_key', 'OPLIST_ALICLOUD_KEY'),
    baiduyun_uid: readEnv('baiduyun_uid', 'OPLIST_BAIDUYUN_UID'),
    baiduyun_key: readEnv('baiduyun_key', 'OPLIST_BAIDUYUN_KEY'),
    cloud115_uid: readEnv('cloud115_uid', 'OPLIST_CLOUD115_UID'),
    cloud115_key: readEnv('cloud115_key', 'OPLIST_CLOUD115_KEY'),
    googleui_uid: readEnv('googleui_uid', 'OPLIST_GOOGLEUI_UID'),
    googleui_key: readEnv('googleui_key', 'OPLIST_GOOGLEUI_KEY'),
    yandexui_uid: readEnv('yandexui_uid', 'OPLIST_YANDEXUI_UID'),
    yandexui_key: readEnv('yandexui_key', 'OPLIST_YANDEXUI_KEY'),
    dropboxs_uid: readEnv('dropboxs_uid', 'OPLIST_DROPBOXS_UID'),
    dropboxs_key: readEnv('dropboxs_key', 'OPLIST_DROPBOXS_KEY'),
    quarkpan_uid: readEnv('quarkpan_uid', 'OPLIST_QUARKPAN_UID'),
    quarkpan_key: readEnv('quarkpan_key', 'OPLIST_QUARKPAN_KEY'),
})

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', async(c, next)=>{
    c.env = runtimeBindings as typeof c.env
    await next()
})

app.route('/', apiApp)

app.use('*', serveStatic({root: 'public/'}))

serve({
    fetch: app.fetch,
    port: Number(process.env.SERVER_PORT) || 3000,
})

export default app
