
const { argString, argBytes, argUint64, argUint32 } = require("orbs-client-sdk");

function getErrorFromReceipt(receipt) {
    const value = receipt.outputArguments.length == 0 ? receipt.executionResult : receipt.outputArguments[0].value;
    return new Error(value);
}

class Lemming {
	constructor(orbsClient, contractName, publicKey, privateKey) {
		this.client = orbsClient;
		this.contractName = contractName;
		this.publicKey = publicKey;
		this.privateKey = privateKey;
	}

	async add(n) {
		const [ tx, txId ] = this.client.createTransaction(
			this.publicKey, this.privateKey, this.contractName,
			"add",
			[
				argUint64(n)
			]
		);

		const receipt = await this.client.sendTransaction(tx);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return receipt.outputArguments[0].value;
	}

	async value() {
		const query = this.client.createQuery(
			this.publicKey,
			this.contractName,
			"value",
			[]
		);

		const receipt = await this.client.sendQuery(query);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return receipt.outputArguments[0].value;
	}

	async createPage(title, content){
		const [ tx, txId ] = this.client.createTransaction(
			this.publicKey, this.privateKey, this.contractName,
			"createPage",
			[
				argString(title), argString(content)
			]
		);

		const receipt = await this.client.sendTransaction(tx);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

	}

	async getPage(title) {

		const query = this.client.createQuery(
			this.publicKey,
			this.contractName,
			"getPage",
			[
				argString(title)
			]
		);

		const receipt = await this.client.sendQuery(query);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return receipt.outputArguments[0].value;

	}

	async createRevision(title, content) {
		const [ tx, txId ] = this.client.createTransaction(
			this.publicKey, this.privateKey, this.contractName,
			"createRevision",
			[
				argString(title), argString(content)
			]
		);

		const receipt = await this.client.sendTransaction(tx);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

	}

	async getPageRevisionCount(title) {

		const query = this.client.createQuery(
			this.publicKey,
			this.contractName,
			"getPageRevisionCount",
			[
				argString(title)
			]
		);

		const receipt = await this.client.sendQuery(query);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return receipt.outputArguments[0].value;
	}

	
}

module.exports = {
	Lemming
};
