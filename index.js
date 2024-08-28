import * as helper from './helper/index.js'
import chalk from 'chalk'
import packageJson from './package.json' assert { type: 'json' }

// Just to show the result in console. Timeout is for emulating the delay.
console.log(chalk.inverse.bold(' Non Standard Magistrate Fees - CRM7 '), '\n','\n', chalk.green.underline( `Risk Automation Engine Concept - ${packageJson.version}` ))
console.log(chalk.italic.gray('\n','\u27F6','assessing the bill ....'), '\n')
setTimeout(() => {  console.log(helper.risk_automation_process()) }, 1)
