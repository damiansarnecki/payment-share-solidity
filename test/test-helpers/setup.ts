import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Signer } from "ethers";
import { ethers } from "hardhat";

export interface Users {
  Owner: SignerWithAddress;
  UserOne: SignerWithAddress;
  UserTwo: SignerWithAddress;
  UserThree: SignerWithAddress;
}

export const getUsers = async () => {
  const accounts = await ethers.getSigners();

  const users: Users = {
    Owner: accounts[0],
    UserOne: accounts[2],
    UserTwo: accounts[3],
    UserThree: accounts[4],
  };

  return users
};
