import { ethers } from "hardhat";
import { PaymentShare } from "../../typechain-types/contracts/PaymentShare";
import { PaymentShare__factory } from "../../typechain-types/factories/contracts/PaymentShare__factory";
import { DEFAULT_SPLITTER } from "./defaults";
import { getUsers } from "./setup";

export const deploySplitterFixture = async () => {
  const PaymentShare = (await ethers.getContractFactory(
    "PaymentShare"
  )) as PaymentShare__factory;

  const splitter = (await PaymentShare.deploy(
    DEFAULT_SPLITTER.maxRecipients
  )) as PaymentShare;

  const signers = await ethers.getSigners();
  await splitter.deployed();

  const users = await getUsers();

  return { splitter, signers, users };
};

export const deploySplitterWithRecipientsFixture = async () => {
  const PaymentShare = (await ethers.getContractFactory(
    "PaymentShare"
  )) as PaymentShare__factory;

  const share = (await PaymentShare.deploy(
    DEFAULT_SPLITTER.maxRecipients
  )) as PaymentShare;

  const users = await getUsers();

  await share.addShareholder(users.UserOne.getAddress(), 30);
  await share.addShareholder(users.UserTwo.getAddress(), 50);
  await share.addShareholder(users.UserThree.getAddress(), 20);

  await share.deployed();


  return { share, users };
};
