import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deploySplitterFixture } from "./test-helpers/fixtures";
import { REVERT_MESSAGES } from "./test-helpers/reverts";
import { getUsers } from "./test-helpers/setup";

describe("RoyaltySplitter", function () {
  describe("Deplyoment", function () {
    it("Should set owner properly", async () => {
      const { splitter, users } = await loadFixture(deploySplitterFixture);

      expect(await splitter.owner()).to.be.equal(users.Owner.address);
    });
  });
  describe("Adding recipient", async () => {
    it("Should be reverted if not owner", async () => {
      const { splitter, users } = await loadFixture(deploySplitterFixture);

      await expect(
        splitter
          .connect(users.UserOne)
          .addShareholder(users.UserTwo.address, 100)
      ).to.be.revertedWith(REVERT_MESSAGES.ownable.callerNotOwner);
    });
    it("Should be reverted if one time percentage is over 100", async () => {
      const { splitter, users } = await loadFixture(deploySplitterFixture);

      await expect(
        splitter.addShareholder(users.UserTwo.address, 101)
      ).to.be.revertedWith(REVERT_MESSAGES.paymentShare.sumOverHundred);
    });
    it("Should be reverted if sum of percentages is over 100", async () => {
      const { splitter, users } = await loadFixture(deploySplitterFixture);

      const percentOne = 36;
      const percentTwo = 65;

      await splitter.addShareholder(users.UserThree.address, percentOne);

      expect(percentOne + percentTwo).to.be.greaterThan(100);

      await expect(
        splitter.addShareholder(users.UserTwo.address, percentTwo)
      ).to.be.revertedWith(REVERT_MESSAGES.paymentShare.sumOverHundred);
    });
    it("Should be reverted if user is already added", async () => {
      const { splitter, users } = await loadFixture(deploySplitterFixture);

      const percentOne = 10;
      const percentTwo = 10;

      await splitter.addShareholder(users.UserTwo.address, percentOne);

      await expect(
        splitter.addShareholder(users.UserTwo.address, percentTwo)
      ).to.be.revertedWith(REVERT_MESSAGES.paymentShare.alreadyAdded);
    });
    it("Should set shares properly", async () => {
      const { splitter, users } = await loadFixture(deploySplitterFixture);

      const percentOne = 10;
      await splitter.addShareholder(users.UserTwo.address, percentOne);

      expect(await splitter.getShare(users.UserTwo.address)).to.be.equal(
        percentOne
      );
    });
    it("Should revert if shareholders reached limit", async () => {
      const { splitter, users } = await loadFixture(deploySplitterFixture);

      const percentOne = 1;

      await splitter.addShareholder(users.UserOne.address, percentOne);
      await splitter.addShareholder(users.UserTwo.address, percentOne);
      await splitter.addShareholder(users.UserThree.address, percentOne);

      expect(await splitter.getMaxShareholders()).to.be.equal(3);
      await expect(
        splitter.addShareholder(users.Owner.address, percentOne)
      ).to.be.revertedWith(REVERT_MESSAGES.paymentShare.limitReached);
    });
    it("Should revert if shareholders reached limit", async () => {
      const { splitter, users } = await loadFixture(deploySplitterFixture);

      const percentOne = 0;

      await expect(
        splitter.addShareholder(users.UserOne.address, percentOne)
      ).to.be.revertedWith(REVERT_MESSAGES.paymentShare.zeroPercentage);
    });
  });
  describe("Deleting recipient", () => {
    describe("by index", () => {
      it("should revert if not owner", async () => {
        const { splitter, users } = await loadFixture(deploySplitterFixture);

        await expect(
          splitter.connect(users.UserOne).deleteShareholderByIndex(0)
        ).to.be.revertedWith(REVERT_MESSAGES.ownable.callerNotOwner);
      });
      it("should revert if passing non existent index", async () => {
        const { splitter, users } = await loadFixture(deploySplitterFixture);

        await splitter.addShareholder(users.UserOne.address, 10);

        await expect(splitter.deleteShareholderByIndex(1)).to.be.revertedWith(
          REVERT_MESSAGES.paymentShare.invalidIndex
        );
      });
      it("should ", async () => {
        const { splitter, users } = await loadFixture(deploySplitterFixture);

      });
    });
    describe("by address", () => {
      it("should", async () => {});
    });
  });
});
