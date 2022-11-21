import { TestMarketplace } from "./../typechain-types/contracts/TestMarketplace";
import { TestMarketplace__factory } from "./../typechain-types/factories/contracts/TestMarketplace__factory";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { RoyaltySplitter__factory } from "./../typechain-types/factories/contracts/RoyaltySplitter__factory";
import { RoyaltySplitter } from "../typechain-types/contracts/RoyaltySplitter";

const DEFAULT_SPLITTER = {
  maxRecipients: 3,
};

describe("Royalties", function () {
  const deployBaseFixture = async () => {

    const RoyaltySplitter = (await ethers.getContractFactory(
      "RoyaltySplitter"
    )) as RoyaltySplitter__factory;

    const splitter = (await RoyaltySplitter.deploy(
      DEFAULT_SPLITTER.maxRecipients
    )) as RoyaltySplitter;

    const signers = await ethers.getSigners();

    await splitter.addRecipient(signers[1].address, 30);
    await splitter.addRecipient(signers[2].address, 50);
    await splitter.addRecipient(signers[3].address, 20);

    await splitter.deployed();

    const TestMarketplace = (await ethers.getContractFactory(
      "TestMarketplace"
    )) as TestMarketplace__factory;
    
    const marketplace = (await TestMarketplace.deploy(
      splitter.address
    )) as TestMarketplace;

    return { splitter, signers, marketplace };
  };

  describe("Testing", function () {
    it("Should work", async () => {
      const { marketplace, signers } = await loadFixture(deployBaseFixture);
      await marketplace.buy({ value: 1000 });

      console.log(await signers[1].getBalance());
    });
  });
});
