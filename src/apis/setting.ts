import http from '@/apis/http'
import { ISetting } from '@/models/ISetting'

const $apiSetting = {
    update (setting: ISetting) {
        return http<ISetting>({
            url: `setting/${setting.id}`,
            method: 'PATCH',
            data: setting
        })
    },
    detail () {
        return http<ISetting>({
            url: `setting/1`
        })
    }
}

export default $apiSetting