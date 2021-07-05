const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const render = require('./render')

const forbiddenDirs = ['node_modules']

class Runner {
	constructor() {
		this.testFiles = []
	}

	async runTests() {
		for (let file of this.testFiles) {
			const lastDirSeparatorIdx = file.shortName.lastIndexOf('/') + 1
			const dirName = file.shortName.slice(0, lastDirSeparatorIdx)
			const fileName = file.shortName.slice(lastDirSeparatorIdx)
			console.log(
				chalk.black.bgYellowBright(' RUNS '),
				chalk.gray(dirName) + chalk.white(fileName)
			)
			const beforeEachFns = []

			global.render = render

			global.beforeEach = (fn) => {
				beforeEachFns.push(fn)
			}

			global.test = async (desc, fn) => {
				beforeEachFns.forEach((func) => func())
				try {
					await fn()
					console.log(chalk.green(`✔ ${desc}`))
				} catch (err) {
					const message = err.message.replace(/\n/g, '\n\t ')
					console.log(chalk.red(`❌ ${desc}`))
					console.log(chalk.red('\t', message))
				}
			}

			global.expect = (actual) => {
				return {
					toBe(expected) {
						if (actual !== expected) {
							throw new Error(
								`Expected values to be strictly equal:\n${chalk.green(
									'+ expected'
								)} ${chalk.red('- actual')}\n\n${chalk.green(
									'+ ' + `'${actual}'`
								)}\n${chalk.red('-')} '${expected}'`
							)
						}
					},
				}
			}

			try {
				await require(file.name)
			} catch (err) {
				console.log(chalk.red(err))
			}
		}
	}

	async collectFiles(targetPath) {
		const files = await fs.promises.readdir(targetPath)

		for (let file of files) {
			const filePath = path.join(targetPath, file)
			const stats = await fs.promises.lstat(filePath)

			if (stats.isFile() && file.includes('.test.js')) {
				this.testFiles.push({ name: filePath, shortName: file })
			} else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
				const childFiles = await fs.promises.readdir(filePath)

				files.push(...childFiles.map((f) => path.join(file, f)))
			}
		}
	}
}

module.exports = Runner
