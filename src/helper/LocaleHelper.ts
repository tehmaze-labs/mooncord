import {readFileSync} from 'fs'

import {ConfigHelper} from "./ConfigHelper";
import path from "path";
import {getEntry, setData, updateData} from "../utils/CacheUtil";

export class LocaleHelper {
    protected config = new ConfigHelper()
    protected fallbackLocalePath = path.resolve(__dirname, '../locales/en.json')
    protected localePath = path.resolve(__dirname, `../locales/${this.config.getLocale()}.json`)
    protected syntaxLocalePath = path.resolve(__dirname, `../locales/${this.config.getSyntaxLocale()}.json`)

    public constructor() {
        this.loadFallback()
        this.loadLocales()
    }

    protected loadLocales() {
        const localeRaw = readFileSync(this.localePath, {encoding: 'utf8'})
        const syntaxLocaleRaw  = readFileSync(this.syntaxLocalePath, {encoding: 'utf8'})

        updateData('locale', JSON.parse(localeRaw))
        updateData('syntax_locale', JSON.parse(syntaxLocaleRaw))
    }

    protected loadFallback() {
        const fallbackLocaleRaw = readFileSync(this.fallbackLocalePath, {encoding: 'utf8'})

        setData('locale', JSON.parse(fallbackLocaleRaw))
        setData('syntax_locale', JSON.parse(fallbackLocaleRaw))
    }

    public getLocale() {
        return getEntry('locale')
    }

    public getSyntaxLocale() {
        return getEntry('syntax_locale')
    }

    public getAdminOnlyError(username:string) {
        return this.getLocale().errors.admin_only.replace(/(\${username})/g, username)
    }

    public getControllerOnlyError(username:string) {
        return this.getLocale().errors.controller_only.replace(/(\${username})/g, username)
    }

    public getGuildOnlyError(username:string) {
        return this.getLocale().errors.guild_only.replace(/(\${username})/g, username)
    }

    public getCommandNotReadyError(username:string) {
        return this.getLocale().errors.not_ready.replace(/(\${username})/g, username)
    }

    public getSystemComponents() {
        const components = [
            {
                "name": this.getLocale().systeminfo.cpu.title,
                "value": "cpu"
            }, {
                "name": this.getLocale().systeminfo.system.title,
                "value": "system"
            }, {
                "name": this.getLocale().systeminfo.memory.title,
                "value": "memory"
            }, {
                "name": this.getLocale().systeminfo.updates.title,
                "value": "updates"
            }
        ]

        for(const stateComponent in getEntry('state')) {
            if(/(mcu)/g.test(stateComponent) && !/(temperature_sensor)/g.test(stateComponent)) {
                components.push({
                    name: stateComponent.toUpperCase(),
                    value: stateComponent
                })
            }
        }

        return components
    }
}