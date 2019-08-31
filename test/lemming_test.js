
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
});
