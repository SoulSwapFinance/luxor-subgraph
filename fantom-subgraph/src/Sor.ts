import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Sor } from "../generated/schema";
import { Approval, Sor as SorContract } from "../generated/Sor/Sor";
import {
  // FARMING_AGGREGATOR_ADDRESS,
  // FARMING_STAKING_REWARDS_ADDRESS,
  SOR_CONTRACT,
  // SOR_LP_POOL_ADDRESS,
} from "./utils/Constants";
import { toDecimal } from "./utils/Decimals";

export function handleTransfer(event: Approval): void {
  const id = event.transaction.hash.toHex();
  let currentSor = Sor.load(id);
  // if (currentSor == null) {
  //   return;
  // }

  // const contract = SorContract.bind(Address.fromString(SOR_CONTRACT));
  // const currentSupply = toDecimal(contract.totalSupply(), contract.decimals());

  // const lastSor = Sor.load("0");
  // if (lastSor && lastSor.supply.equals(currentSupply)) {
  //   // SOR supply hasn't changed. Avoid saving this transaction and creating useless duplicates.
  //   return;
  // }

  // currentSor = new Sor(id);
  // currentSor.supply = currentSupply;
  // currentSor.timestamp = event.block.timestamp;
  // currentSor.sorTVL = getSORTvl();
  // currentSor.apy = getSorAPY();
  // currentSor.save();

  // // Save for the next SOR event handler.
  // currentSor.id = "0";
  // currentSor.save();

  if (currentSor == null) {
    currentSor = new Sor(id);
  }
  const contract = SorContract.bind(Address.fromString(SOR_CONTRACT));
  const currentSupply = toDecimal(contract.totalSupply(), contract.decimals());
  currentSor.supply = currentSupply;
  currentSor.timestamp = event.block.timestamp;
  // currentSor.sorTVL = getSORTvl();
  // currentSor.apy = getSorAPY();
  currentSor.save();
}

// export function getSORTvl(): BigDecimal {
//   const sorLPContract = SorLPPool.bind(Address.fromString(SOR_LP_POOL_ADDRESS));
//   const sorTVL = sorLPContract.balanceOf(
//     Address.fromString(FARMING_STAKING_REWARDS_ADDRESS)
//   );
//   return toDecimal(sorTVL);
// }

