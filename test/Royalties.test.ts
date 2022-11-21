import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deploySplitterFixture } from "./test-helpers/fixtures";
import { REVERT_MESSAGES } from "./test-helpers/reverts";
import { getUsers } from "./test-helpers/setup";

describe("RoyaltySplitter", function () {
  describe("Deplyoment", function () {
    it("Should set owner properly", async () => {
      const { splitter } = await loadFixture(deploySplitterFixture);

      const users = await getUsers();

      expect(await splitter.owner()).to.be.equal(users.Owner.address);
    });
  });
  describe("Adding recipient", async () => {
    it("Should be reverted if not owner", async () => {
      const { splitter } = await loadFixture(deploySplitterFixture);

      const users = await getUsers();

      await expect(
        splitter.connect(users.UserOne).addRecipient(users.UserTwo.address, 100)
      ).to.be.revertedWith(REVERT_MESSAGES.ownable.callerNotOwner);
    });
  });
});
