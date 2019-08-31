
const expect = require("expect.js");
const { createAccount } = require("orbs-client-sdk");
const { Lemming } = require("../src/lemming");
const { deploy, getClient } = require("../src/deploy");

describe("Lemming", () => {
    xit("updates contract state", async () => {
		const contractOwner = createAccount();
		const contractName = "Lemming" + new Date().getTime();

		await deploy(getClient(), contractOwner, contractName);
		const lemming = new Lemming(getClient(), contractName, contractOwner.publicKey, contractOwner.privateKey);

		const defaultValue = await lemming.value();
		expect(defaultValue).to.be.eql(0);

		const updatedValue = await lemming.add(7);
		expect(updatedValue).to.be.eql(7);
	});

	it("creates a page with a single revision", async () => {
		const contractOwner = createAccount();
		const contractName = "Lemming" + new Date().getTime();

		await deploy(getClient(), contractOwner, contractName);
		const lemming = new Lemming(getClient(), contractName, contractOwner.publicKey, contractOwner.privateKey);

		await lemming.createPage("Iggy Pop", "Iggy Pop is amazing");

		const text = await lemming.getPage("Iggy Pop");
		expect(text).to.be.eql("Iggy Pop is amazing");
	});

	it("can't create a page if it already exists", async () => {
		const contractOwner = createAccount();
		const contractName = "Lemming" + new Date().getTime();

		await deploy(getClient(), contractOwner, contractName);
		const lemming = new Lemming(getClient(), contractName, contractOwner.publicKey, contractOwner.privateKey);

		await lemming.createPage("Iggy Pop", "Iggy Pop is amazing");

		let err;
		try {
			await lemming.createPage("Iggy Pop", "Iggy Pop wrote The Passenger");
		} catch (e) {
			err = e.toString();
		}

		expect(err).to.be.eql("Error: page already exists!");
	});

	it("can create new revision", async () => {
		const contractOwner = createAccount();
		const contractName = "Lemming" + new Date().getTime();

		await deploy(getClient(), contractOwner, contractName);
		const lemming = new Lemming(getClient(), contractName, contractOwner.publicKey, contractOwner.privateKey);

		let err;
		try {
			await lemming.createRevision("Iggy Pop", "Iggy Pop wrote The Passenger");
		} catch (e) {
			err = e.toString();
		}
		expect(err).to.be.eql("Error: page does not exist!");

		await lemming.createPage("Iggy Pop", "Iggy Pop is amazing");
		await lemming.createRevision("Iggy Pop", "Iggy Pop wrote The Passenger");

		const text = await lemming.getPage("Iggy Pop");
		expect(text).to.be.eql("Iggy Pop wrote The Passenger");

		let revisionErr;
		try {
			await lemming.getPageRevisionCount("David Bowie");
		} catch (e) {
			revisionErr = e.toString()
		}
		expect(revisionErr).to.be.eql("Error: page does not exist!");

		const numRevisions = await lemming.getPageRevisionCount("Iggy Pop");
		expect(numRevisions).to.be.eql(2);
	});
});
