import { TestMarketplace } from './../typechain-types/contracts/TestMarketplace';
import { ethers } from 'hardhat';
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";


describe("Royalties", function () {
  
  const deployBaseFixture = async () => {

    const RoyaltySplitter = await ethers.getContractFactory("RoyaltySplitter");

    const splitter = await RoyaltySplitter.deploy(3);

    const signers = await ethers.getSigners()

    await splitter.addRecipient(signers[1].address, 30);
    await splitter.addRecipient(signers[2].address, 50);
    await splitter.addRecipient(signers[3].address, 20);

    await splitter.deployed();

    const TestMarketplace = await ethers.getContractFactory("TestMarketplace");
    const marketplace = await TestMarketplace.deploy(splitter.address);

    return {splitter, signers, marketplace}
  }

  describe("Testing", function () {
    it("Should work", async () => {
      const { marketplace, signers } = await loadFixture(deployBaseFixture);  
      await marketplace.buy({value : 1000})

      console.log(await signers[1].getBalance())

    })
  });
});
