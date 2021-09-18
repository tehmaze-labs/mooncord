import * as packageConfig from '../package.json'
import {ConsoleLogger} from "./helper/ConsoleLogger";
import {MoonrakerClient} from "./clients/MoonrakerClient";

const logger = new ConsoleLogger()

logger.logSuccess(`starting ${packageConfig.name} ${packageConfig.version}...`)
logger.logEmpty()

const moonrakerClient = new MoonrakerClient()

