import { ethers } from "hardhat";
import { RoyaltySplitter } from "../../typechain-types/contracts/RoyaltySplitter";
import { TestMarketplace } from "../../typechain-types/contracts/TestMarketplace";
import { RoyaltySplitter__factory } from "../../typechain-types/factories/contracts/RoyaltySplitter__factory";
import { TestMarketplace__factory } from "../../typechain-types/factories/contracts/TestMarketplace__factory";
import { DEFAULT_SPLITTER } from "./defaults";
import { getUsers } from "./setup";

export const deploySplitterFixture = async () => {
  const RoyaltySplitter = (await ethers.getContractFactory(
    "RoyaltySplitter"
  )) as RoyaltySplitter__factory;

  const splitter = (await RoyaltySplitter.deploy(
    DEFAULT_SPLITTER.maxRecipients
  )) as RoyaltySplitter;

  const signers = await ethers.getSigners();
  await splitter.deployed();

  const TestMarketplace = (await ethers.getContractFactory(
    "TestMarketplace"
  )) as TestMarketplace__factory;

  const marketplace = (await TestMarketplace.deploy(
    splitter.address
  )) as TestMarketplace;


  return { splitter, signers, marketplace };
};

export const deploySplitterWithRecipientsFixture = async () => {
	const RoyaltySplitter = (await ethers.getContractFactory(
	  "RoyaltySplitter"
	)) as RoyaltySplitter__factory;
  
	const splitter = (await RoyaltySplitter.deploy(
	  DEFAULT_SPLITTER.maxRecipients
	)) as RoyaltySplitter;
  
	const users = await getUsers();
  
	await splitter.addRecipient(users.UserOne.getAddress(), 30);
	await splitter.addRecipient(users.UserTwo.getAddress(), 50);
	await splitter.addRecipient(users.UserThree.getAddress(), 20);
  
	await splitter.deployed();
  
	const TestMarketplace = (await ethers.getContractFactory(
	  "TestMarketplace"
	)) as TestMarketplace__factory;
  
	const marketplace = (await TestMarketplace.deploy(
	  splitter.address
	)) as TestMarketplace;
    
	return { splitter, marketplace };
  };
